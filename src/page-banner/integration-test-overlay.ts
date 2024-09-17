import type { autoPlacement, computePosition } from "@floating-ui/dom";

import {
  autoPlacement as autoPlacementFromCDN,
  computePosition as computePositionFromCDN,
  // downloaded from https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.10/+esm
  // and adjusted imports from +esm to +esm.js
  // and removed source maps
  // TODO figure out a better solution
} from "../npm/@floating-ui/dom@1.6.10/+esm.js";
import {
  fullscreenClass,
  IFrameStyleId,
  innerOverlayId,
  outerOverlayId,
  overlayId,
  sovendusOverlayButtonClass,
  sovendusOverlayErrorClass,
  sovendusOverlayFontClass,
  sovendusOverlayH1Class,
  sovendusOverlayH2Class,
  sovendusOverlayH3Class,
  sovendusOverlayRepeatTestsId,
  sovendusOverlayTextClass,
  testLoadedIFrameId,
  testNotLoadedIFrameId,
  toggleSovendusOverlayId,
  tooltipButtonClass,
  tooltipClass,
} from "./integration-test-overlay-css-vars.js";
import SelfTester, { transmitIntegrationError } from "./integration-tester.js";
import { StatusCodes } from "./integration-tester-data-to-sync-with-dev-hub.js";

void (async (): Promise<void> => {
  await repeatTestsOnSPA(async () => {
    await executeTests();
  });
})();

async function executeTests(): Promise<void> {
  removeOverlay();
  window.sovSelfTester = new SelfTester();
  await window.sovSelfTester.waitForSovendusIntegrationDetected();
  const overlay = new SelfTesterOverlay();
  overlay.createLoadingOverlay();
  await window.sovSelfTester.waitForSovendusIntegrationToBeLoaded();
  window.sovSelfTester.selfTestIntegration();
  overlay.createOverlay(window.sovSelfTester);
}

async function repeatTestsOnSPA(tests: () => Promise<void>): Promise<void> {
  let visitedPath = "";
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (visitedPath !== window.location.pathname) {
      visitedPath = window.location.pathname;
      await tests();
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

function removeOverlay(): void {
  document.getElementById(outerOverlayId)?.remove();
}
class SelfTesterOverlay {
  createOverlay(selfTester: SelfTester): void {
    document.getElementById(outerOverlayId)?.remove();
    this.createOuterOverlay();
    this.createInnerOverlay({
      loadingDone: true,
      headerRightElement: `
            <button class="${sovendusOverlayFontClass} ${sovendusOverlayButtonClass}" id="${sovendusOverlayRepeatTestsId}" style="margin-left: auto">
              repeat tests
            </button>        
        `,
      children: `
            <ul class="${sovendusOverlayFontClass}">
              <li class="${sovendusOverlayFontClass}">
                Integration Type: ${selfTester.integrationType.getFormattedStatusMessage(false)}
              </li>
              <li class="${sovendusOverlayFontClass}">
                Browser: ${selfTester.browserName.elementValue}
              </li>
              <li class="${sovendusOverlayFontClass}" style="font-size: 9px !important">
                URL: ${selfTester.websiteURL.elementValue}
              </li>
              ${selfTester.multipleIFramesAreSame.getFormattedGeneralStatusMessage()}
              ${selfTester.flexibleIFrameOnDOM.getFormattedGeneralStatusMessage()}
              ${selfTester.isFlexibleIFrameExecutable.getFormattedGeneralStatusMessage()}
              ${selfTester.isSovendusJsOnDom.getFormattedGeneralStatusMessage()}
              ${selfTester.isSovendusJsExecutable.getFormattedGeneralStatusMessage()}
              ${selfTester.isUnknownSovendusJsError.getFormattedGeneralStatusMessage()}
            </ul>
            ${this.createInnerInnerOverlay(selfTester)}
        `,
    });
  }

  createLoadingOverlay(): void {
    this.createOuterOverlay();
    this.createInnerOverlay({
      children: `
        <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}">
          Sovendus detected, tests are currently running...
        </h2>
        <h3 class="${sovendusOverlayFontClass} ${sovendusOverlayH3Class}">
          This can take up to 10 seconds
        </h3>
    `,
    });
  }

  createOuterOverlay(): void {
    const overlay = document.createElement("div");
    overlay.id = outerOverlayId;
    overlay.translate = false;
    overlay.innerHTML = `
      ${this.getOuterOverlayStyle()}
      <button class="${sovendusOverlayFontClass} ${sovendusOverlayButtonClass}" id="${toggleSovendusOverlayId}">
        Hide
      </button>
      <div id="${overlayId}">
      </div>
    `;
    document.body.appendChild(overlay);
    const toggle = document.getElementById(toggleSovendusOverlayId);
    if (toggle) {
      toggle.addEventListener("click", toggleOverlay);
    } else {
      // eslint-disable-next-line no-console
      console.error("Failed to add click event to show / hide button");
      void transmitIntegrationError(
        "Failed to add click event to show / hide button",
        window,
      );
    }
  }

  createInnerOverlay({
    headerRightElement,
    children,
    loadingDone,
  }: {
    headerRightElement?: string;
    children: string;
    loadingDone?: true;
  }): void {
    const overlay = document.getElementById(overlayId) as HTMLElement;

    // use an iframe to prevent styles from being overridden by the pages css
    const iframe = document.createElement("iframe");
    iframe.onload = (): void => {
      if (iframe.contentDocument) {
        iframe.contentDocument.body.innerHTML = `
      ${this.getInnerOverlayStyle()}
      <div id="${innerOverlayId}" style="margin:auto !important;max-width:700px !important; background: #293049 !important" class="${sovendusOverlayFontClass}">
        <div style="display: flex !important">
          <h1 class="${sovendusOverlayFontClass} ${sovendusOverlayH1Class}" style="margin-right: auto !important">
            Sovendus Self-Test Overlay
          </h1>
          ${headerRightElement ?? ""}
        </div>
        ${children}
      </div>
    `;
      } else {
        // eslint-disable-next-line no-console
        console.error("Failed to get iframe.contentDocument to place content");
        void transmitIntegrationError(
          "Failed to get iframe.contentDocument to place content",
          window,
        );
      }

      const iFrameStyle = document.createElement("style");
      iFrameStyle.id = IFrameStyleId;
      iFrameStyle.innerHTML = `#${testLoadedIFrameId} { height: 1200px !important; }`;
      overlay.insertAdjacentElement("afterbegin", iFrameStyle);

      if (!loadingDone) {
        window.addEventListener("resize", (): void => updateIFrameHeight());
      }

      updateIFrameHeight(iframe);
      if (loadingDone) {
        this.addButtonAndInfoEventListener(iframe);
      }
    };
    iframe.id = loadingDone ? testLoadedIFrameId : testNotLoadedIFrameId;
    overlay.appendChild(iframe);
  }

  createInnerInnerOverlay(selfTester: SelfTester): string {
    const awinIntegrationDetected =
      selfTester.awinIntegrationDetectedTestResult.elementValue;
    const awinIntegrationNoSaleTrackedOrTrackedToEarly =
      awinIntegrationDetected &&
      (!selfTester.awinSaleTrackedTestResult.elementValue ||
        !selfTester.awinExecutedTestResult.elementValue);
    return `
        ${this.getSovIFramesData(selfTester, awinIntegrationNoSaleTrackedOrTrackedToEarly)}
        ${
          awinIntegrationDetected
            ? ""
            : this.generateConsumerDataReport(selfTester)
        }
    `;
  }

  generateConsumerDataReport(testResult: SelfTester): string {
    return `
        <div class="${sovendusOverlayFontClass}">
          <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}">
            Customer Data:
          </h2>
          <ul class="${sovendusOverlayFontClass}">
            <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
              consumerSalutation: ${testResult.consumerSalutation.getFormattedStatusMessage()}
            </li>
            <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
              consumerFirstName: ${testResult.consumerFirstName.getFormattedStatusMessage()}
            </li>
            <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
              consumerLastName: ${testResult.consumerLastName.getFormattedStatusMessage()}
            </li>
            <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
              consumerYearOfBirth: ${testResult.consumerYearOfBirth.getFormattedStatusMessage()}
            </li>
            <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
              consumerEmail: ${testResult.consumerEmail.getFormattedStatusMessage()}
            </li>
            ${
              testResult.consumerEmailHash.statusCode ===
              StatusCodes.TestDidNotRun
                ? ""
                : `<li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
              consumerEmailHash: ${testResult.consumerEmailHash.getFormattedStatusMessage()}
            </li>`
            }
            <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
              consumerPhone: ${testResult.consumerPhone.getFormattedStatusMessage()}
            </li>
            <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
              consumerStreet: ${testResult.consumerStreet.getFormattedStatusMessage()}
            </li>
            <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
              consumerStreetNumber: ${testResult.consumerStreetNumber.getFormattedStatusMessage()}
            </li>
            <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
              consumerZipcode: ${testResult.consumerZipCode.getFormattedStatusMessage()}
            </li>
            <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
              consumerCity: ${testResult.consumerCity.getFormattedStatusMessage()}
            </li>
            <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
              consumerCountry: ${testResult.consumerCountry.getFormattedStatusMessage()}
            </li>
          </ul>
        </div>
    `;
  }

  getSovIFramesData(
    selfTester: SelfTester,
    awinIntegrationNoSaleTrackedOrTrackedToEarly: boolean = false,
  ): string {
    let additionalInfo: string;
    if (awinIntegrationNoSaleTrackedOrTrackedToEarly) {
      additionalInfo = `
        ${selfTester.awinSaleTrackedTestResult.getFormattedGeneralStatusMessage()}
        ${selfTester.awinExecutedTestResult.getFormattedGeneralStatusMessage()}
      `;
    } else {
      additionalInfo = `
      <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}">
        Sovendus Container:
      </h2>
      <ul class="${sovendusOverlayFontClass}">
        <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
          iframeContainerId: ${selfTester.iFrameContainerId.getFormattedStatusMessage()}
        </li>
        ${selfTester.sovendusDivFound.getFormattedGeneralStatusMessage()}
      </ul>
      <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}">
        Order Data:
      </h2>
      <ul class="${sovendusOverlayFontClass}">
        <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
          orderCurrency: ${selfTester.orderCurrency.getFormattedStatusMessage()}
        </li>
        <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
          orderId: ${selfTester.orderId.getFormattedStatusMessage()}
        </li>
        <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
          orderValue: ${selfTester.orderValue.getFormattedStatusMessage()}
        </li>
        ${
          selfTester.sessionId.statusCode === StatusCodes.TestDidNotRun
            ? ""
            : `
                <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
                  sessionId: ${selfTester.sessionId.getFormattedStatusMessage()}
                </li>
              `
        }
        ${
          selfTester.timestamp.statusCode === StatusCodes.TestDidNotRun
            ? ""
            : `
                <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
                  timestamp: ${selfTester.timestamp.getFormattedStatusMessage()}
                </li>
              `
        }
        <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
          usedCouponCode: ${selfTester.usedCouponCode.getFormattedStatusMessage()}
        </li>
      </ul>
    `;
    }
    return `
      <div>
        <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}">
          Sovendus Partner Numbers:
        </h2>
        <ul class="${sovendusOverlayFontClass}">
          <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
            trafficSourceNumber: ${selfTester.trafficSourceNumber.getFormattedStatusMessage()}
          </li>
          <li class='${sovendusOverlayFontClass} ${sovendusOverlayTextClass}'>
            trafficMediumNumber: ${selfTester.trafficMediumNumber.getFormattedStatusMessage()}
          </li>
          ${selfTester.isEnabledInBackend.getFormattedGeneralStatusMessage()}
          ${additionalInfo}
        </ul>
      </div>`;
  }

  getInnerOverlayStyle(): string {
    const bannerPadding = 22;
    const mobileBannerPadding = 5;
    return `
        <style>
          body {
            padding: 0;
            margin: 0;
          }
          .${tooltipClass} {
            max-width: 250px;
            position: absolute;
            display: none;
            background: orange;
            color: white;
            padding: 12px;
            border: unset;
            border-radius: 8px;
            z-index: 99999;
          }
          #${innerOverlayId} {
            padding: ${bannerPadding}px !important;
          }
          #${innerOverlayId} .${sovendusOverlayFontClass},
          #${innerOverlayId} ul .${sovendusOverlayFontClass},
          #${innerOverlayId} li .${sovendusOverlayFontClass} {
            color: white !important;
            font-family: Arial, Helvetica, sans-serif !important;
          }
          #${innerOverlayId} .${sovendusOverlayErrorClass} {
            color: red !important;
            font-size: 17px !important;
            margin: 0 !important;
          }
          #${innerOverlayId} .${sovendusOverlayH1Class} {
            font-size: 27px !important;
            margin-top: 0 !important;
            margin-bottom: 5px !important;
          }
          #${innerOverlayId} .${sovendusOverlayH2Class} {
            font-size: 20px !important;
            margin-top: 6px !important;
            margin-bottom: 0px !important;
          }
          #${innerOverlayId} .${sovendusOverlayH3Class} {
            font-size: 17px !important;
            margin-top: 6px !important;
            margin-bottom: 0px !important;
          }
          #${innerOverlayId} .${sovendusOverlayTextClass} {
            font-size: 15px !important;
          }
          #${innerOverlayId} li {
            font-size: 16px !important;
            margin-left: 45px !important;
          }
          #${innerOverlayId} li::marker {
            content: '🞄 ' !important;
            unicode-bidi: isolate !important;
            font-variant-numeric: tabular-nums !important;
            text-transform: none !important;
            text-indent: 0px !important;
            text-align: start !important;
            text-align-last: start !important;
          }
          #${innerOverlayId} ul {
            margin: 0 !important;
            padding: 0 !important;
          }
          #${innerOverlayId} a {
            color: #197bbd !important;
          }
          #${innerOverlayId} a:hover {
            color: #15669d !important;
          }
          .${sovendusOverlayButtonClass} {
            background: #293049 !important;
            color: #fff !important;
            padding: 9px !important;
            cursor: pointer;
            font-size: 16px !important;
            border-radius: 8px !important;
            border: solid 1px #fff;
          }
          #${sovendusOverlayRepeatTestsId} {
            float: right !important;
            width: 105px !important;
          }

          @media only screen and (max-width: 600px) {
            #${innerOverlayId} {
              padding: 15px ${mobileBannerPadding}px 15px ${mobileBannerPadding}px !important;
            }
            #${innerOverlayId} li {
              font-size: 15px !important;
              margin-left: 25px !important;
            }
            #${innerOverlayId} .${sovendusOverlayErrorClass} {
              font-size: 15px !important;
            }
            #${innerOverlayId} .${sovendusOverlayH1Class} {
              font-size: 22px !important;
              margin-bottom: 3px !important;
            }
            #${innerOverlayId} .${sovendusOverlayH2Class} {
              font-size: 18px !important;
            }
            #${innerOverlayId} .${sovendusOverlayH3Class} {
              font-size: 15px !important;
            }
            #${innerOverlayId} .${sovendusOverlayTextClass} {
              font-size: 14px !important;
            }
          }
        </style>
        `;
  }
  getOuterOverlayStyle(): string {
    const bannerWidth = 700;
    return `
        <style>
          #${testLoadedIFrameId}, #${testNotLoadedIFrameId} {
            width: 100% !important;
            border: none !important;
          }
          #${overlayId} {
            position: fixed !important;
            left: calc(50% - ${bannerWidth / 2}px) !important;
            right: calc(50% - ${bannerWidth / 2}px) !important;
            width: ${bannerWidth}px !important;
            max-width: calc(100vw) !important;
            top: 50px !important;
            padding: 0 !important;
            background: #293049 !important;
            z-index: 2147483648 !important;
            overflow-y: auto !important;
            max-height: calc(100vh - 100px) !important;
            border: unset !important;
            border-radius: 8px !important;    
            line-height: normal !important;        
          }
          .${sovendusOverlayButtonClass} {
            background: #293049 !important;
            color: #fff !important;
            padding: 9px !important;
            cursor: pointer;
            font-size: 16px !important;
            border-radius: 8px !important;
            border: solid 1px #fff;
          }
          #${overlayId}.${fullscreenClass} {
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100vh !important;
            top: 0 !important;
            left: 0 !important;
            max-height: 100vh !important;
          }
          #${toggleSovendusOverlayId} {
            width: 62px !important;
            height: unset !important;
            position: fixed !important;
            left: calc(50% - 31px) !important;
            right: calc(50% - 31px) !important;
            top: 20px !important;
            z-index: 2147483647 !important;
            border: unset !important;
            line-height: normal !important;
          }
          @media only screen and (max-width: 700px) {
            #${overlayId} {
              left: 0 !important;
              right: 0 !important;
              top: 50px !important;
              padding: 15px 0 15px 0 !important;
              width: 100vw !important;
            }
            #${overlayId}.${fullscreenClass} {
              width: 100vw !important;
              max-width: 100vw !important;
            }
          }
        </style>
        `;
  }

  addButtonAndInfoEventListener(iframe: HTMLIFrameElement): void {
    iframe.contentWindow?.document
      .getElementById(sovendusOverlayRepeatTestsId)
      ?.addEventListener("click", () => {
        void executeTests();
      });

    const tooltipInfoIcons = (
      document.getElementById(testLoadedIFrameId) as HTMLIFrameElement
    )?.contentWindow?.document.getElementsByClassName(
      tooltipButtonClass,
    ) as HTMLCollectionOf<HTMLElement>;

    for (const item of tooltipInfoIcons) {
      if (item.nextElementSibling) {
        const tooltip = item.nextElementSibling as HTMLElement;

        const showTooltip = async (): Promise<void> => {
          tooltip.style.display = "block";

          const { x, y } =
            await // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            (computePositionFromCDN as typeof computePosition)(item, tooltip, {
              middleware: [
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                (autoPlacementFromCDN as typeof autoPlacement)(),
              ],
            });
          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
        };

        const hideTooltip = (): void => {
          tooltip.style.display = "none";
        };

        [
          ["mouseenter", showTooltip],
          ["mouseleave", hideTooltip],
          ["focus", showTooltip],
          ["blur", hideTooltip],
        ].forEach(([event, listener]) => {
          item.addEventListener(
            event as "mouseenter" | "mouseleave" | "focus" | "blur",
            listener as () => void,
          );
        });
      }
    }
  }
}

function updateIFrameHeight(iframe?: HTMLIFrameElement): void {
  const _iframe =
    iframe ||
    (document.getElementById(testLoadedIFrameId) as HTMLIFrameElement | null);
  const innerOverlay = _iframe?.contentDocument?.getElementById(innerOverlayId);
  const iFrameStyle = document.getElementById(
    IFrameStyleId,
  ) as HTMLStyleElement | null;
  if (!_iframe || !innerOverlay || !iFrameStyle) {
    if (!_iframe) {
      // eslint-disable-next-line no-console
      console.error("Failed to get iframe to update iframe height.");
      void transmitIntegrationError(
        "Failed to get iframe to update iframe height.",
        window,
      );
    }
    if (!innerOverlay) {
      // eslint-disable-next-line no-console
      console.error("Failed to get innerOverlay to update iframe height.");
      void transmitIntegrationError(
        "Failed to get innerOverlay to update iframe height.",
        window,
      );
    }
    if (!iFrameStyle) {
      // eslint-disable-next-line no-console
      console.error("Failed to get iFrameStyle to update iframe height.");
      void transmitIntegrationError(
        "Failed to get iFrameStyle to update iframe height.",
        window,
      );
    }
  } else {
    iFrameStyle.innerHTML = `#${testLoadedIFrameId} { height: ${innerOverlay.scrollHeight}px !important; }`;
  }
}

function toggleOverlay(): void {
  const overlay = document.getElementById(overlayId);
  const toggle = document.getElementById(toggleSovendusOverlayId);
  if (overlay && toggle) {
    if (overlay.style.display === "none") {
      overlay.style.display = "block";
      toggle.innerText = "Hide";
    } else {
      overlay.style.display = "none";
      toggle.innerText = "Show";
    }
  }
}

interface SovWindow extends Window {
  sovSelfTester?: SelfTester;
  originalOnresize?: ((this: GlobalEventHandlers, ev: UIEvent) => void) | null;
}

declare let window: SovWindow;
