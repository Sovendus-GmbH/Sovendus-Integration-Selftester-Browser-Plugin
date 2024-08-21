import type { autoPlacement, computePosition } from "@floating-ui/dom";

import {
  autoPlacement as autoPlacementFromCDN,
  computePosition as computePositionFromCDN,
  // downloaded from https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.10/+esm
  // and adjusted imports from +esm to +esm.js
} from "../npm/@floating-ui/dom@1.6.10/+esm.js";
import {
  fullscreenClass,
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
} from "./self-test-overlay-css-vars.js";
import SelfTester from "./self-tester.js";
import { StatusCodes } from "./self-tester-data-to-sync-with-dev-hub.js";

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
    const overlay = document.createElement("div");
    overlay.id = outerOverlayId;
    overlay.innerHTML = this.createOuterOverlay();
    document.body.appendChild(overlay);
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
              ${selfTester.awinExecutedTestResult.getFormattedGeneralStatusMessage()}
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

    document
      .getElementById(toggleSovendusOverlayId)
      ?.addEventListener("click", toggleOverlay);

    this.addButtonAndInfoEventListener();

    // this.moveOverlayAboveAll();
  }

  createLoadingOverlay(): void {
    const overlay = document.createElement("div");
    overlay.id = outerOverlayId;
    overlay.innerHTML = this.createOuterOverlay();
    document.body.appendChild(overlay);
    window.originalOnresize = window.onresize;
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

    document
      .getElementById(toggleSovendusOverlayId)
      ?.addEventListener("click", toggleOverlay);
  }

  createOuterOverlay(): string {
    // TODO OuterOverlayStyle bearbeiten damit er im innerOverlay funktioniert
    return `
      ${this.getOuterOverlayStyle()}
      <button class="${sovendusOverlayFontClass} ${sovendusOverlayButtonClass}" id="${toggleSovendusOverlayId}">
        Hide
      </button>
      <div id="${overlayId}">
      </div>
    `;
  }

  createInnerOverlay({
    headerRightElement = "",
    children,
    loadingDone,
  }: {
    headerRightElement?: string;
    children: string;
    loadingDone?: true;
  }): void {
    const overlay = document.getElementById(overlayId) as HTMLElement;

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
          ${headerRightElement}
        </div>
        ${children}
      </div>
    `;
      } else {
        throw new Error(
          "Failed to get iframe.contentDocument to place content",
        );
      }
      const iFrameStyle = document.createElement("style");
      overlay.insertAdjacentElement("afterbegin", iFrameStyle);
      window.onresize = (ev: UIEvent): void => {
        window.originalOnresize?.(ev);
        this.updateIFrameHeight(iframe, iFrameStyle);
      };
      this.updateIFrameHeight(iframe, iFrameStyle);
    };
    iframe.id = loadingDone ? testLoadedIFrameId : testNotLoadedIFrameId;
    overlay.replaceChildren(iframe);
  }

  updateIFrameHeight(
    iframe: HTMLIFrameElement,
    iFrameStyle: HTMLStyleElement,
  ): void {
    const innerOverlay = iframe.contentDocument?.getElementById(innerOverlayId);
    if (innerOverlay) {
      iFrameStyle.innerHTML = `#${testLoadedIFrameId} { height: ${innerOverlay.scrollHeight}px !important; }`;
      iframe.style.height = `${innerOverlay.scrollHeight}px !important`;
    } else {
      throw new Error("Failed to get innerOverlay to update iframe height.");
    }
  }

  createInnerInnerOverlay(selfTester: SelfTester): string {
    const awinIntegrationDetected =
      selfTester.awinIntegrationDetectedTestResult.elementValue;
    const awinIntegrationNoSaleTracked =
      awinIntegrationDetected &&
      !selfTester.awinSaleTrackedTestResult.elementValue;
    return `
        ${this.getSovIFramesData(selfTester, awinIntegrationNoSaleTracked)}
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
    awinIntegrationNoSaleTracked: boolean = false,
  ): string {
    let additionalInfo: string;
    if (awinIntegrationNoSaleTracked) {
      additionalInfo =
        selfTester.awinSaleTrackedTestResult.getFormattedStatusMessage();
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
            width: calc(100vw - 44px) !important;
            max-width: calc(100vw - 44px) !important;
            height: 100vh !important;
            top: 0 !important;
            left: 0 !important;
            max-height: 100vh !important;
          }
          #${toggleSovendusOverlayId} {
            width: 62px !important;
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

  addButtonAndInfoEventListener(): void {
    const iframe = document.getElementById(
      testLoadedIFrameId,
    ) as HTMLIFrameElement | null;
    if (iframe) {
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
              (computePositionFromCDN as typeof computePosition)(
                item,
                tooltip,
                {
                  middleware: [
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                    (autoPlacementFromCDN as typeof autoPlacement)(),
                  ],
                },
              );
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
    } else {
      throw new Error(
        "Failed to find iframe to add event listeners for repeat button and info icons.",
      );
    }
  }

  // moveOverlayAboveAll() {
  //   function checkAndChangeZIndex(element: HTMLElement) {
  //     if (
  //       element.id !== overlayId &&
  //       element.id !== toggleSovendusOverlayId &&
  //       (getComputedStyle(element).zIndex === "2147483647" ||
  //         element.style.zIndex === "2147483647")
  //     ) {
  //       element.setAttribute("style", "z-index:2147483646 !important");
  //     }

  //     // Handle child elements
  //     let childElement = element.firstElementChild;
  //     while (childElement) {
  //       checkAndChangeZIndex(childElement as HTMLElement);
  //       childElement = childElement.nextElementSibling;
  //     }
  //   }
  //   checkAndChangeZIndex(document.body);
  // }
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
