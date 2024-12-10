// import type { autoPlacement, computePosition } from "@floating-ui/dom";

import type { SovSelfTesterWindow } from "../integration-tester/integration-tester";
import SelfTester from "../integration-tester/integration-tester";
import { transmitIntegrationError } from "../integration-tester/integration-tester";
import { StatusCodes } from "../integration-tester/integration-tester-data-to-sync-with-dev-hub";
// TODO
// import {
//   autoPlacement as autoPlacementFromCDN,
//   computePosition as computePositionFromCDN,
//   // downloaded from https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.10/+esm
//   // and adjusted imports from +esm to +esm.js
//   // and removed source maps
//   // TODO figure out a better solution
// } from "../npm/@floating-ui/dom@1.6.10/+esm.js";
import {
  closeSovendusOverlayId,
  fullscreenClass,
  iFrameStyleId,
  innerOverlayId,
  openSovendusOverlayId,
  outerMiniOverlayId,
  outerOverlayId,
  overlayId,
  sovendusActiveButtonClass,
  sovendusOverlayButtonClass,
  sovendusOverlayErrorClass,
  sovendusOverlayFontClass,
  sovendusOverlayH1Class,
  sovendusOverlayH2Class,
  sovendusOverlayH3Class,
  sovendusOverlayOpenButtonClass,
  sovendusOverlayRepeatTestsId,
  sovendusOverlayTextClass,
  testLoadedIFrameId,
  testNotLoadedIFrameId,
  tooltipButtonClass,
  tooltipClass,
} from "./integration-test-overlay-css-vars";

export async function executeTests(): Promise<void> {
  const sovSelfTester = new SelfTester();
  window.sovSelfTester = sovSelfTester;
  await sovSelfTester.waitForSovendusIntegrationDetected();
  const overlay = new SelfTesterOverlay();
  overlay.createLoadingOverlay(executeTests);
  await sovSelfTester.waitForSovendusIntegrationToBeLoaded();
  sovSelfTester.selfTestIntegration();
  overlay.createOverlay(sovSelfTester, executeTests);
}

export async function repeatTestsOnSPA(
  tests: () => Promise<void>,
): Promise<void> {
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

export function removeSelfTesterOverlay(): void {
  document.getElementById(outerOverlayId)?.remove();
  if (window.sovSelfTester) {
    delete window.sovSelfTester;
  }
}

export class SelfTesterOverlay {
  iframe!: HTMLIFrameElement;
  btnCBVN!: HTMLElement;
  btnOptimize!: HTMLElement;
  btnCheckout!: HTMLElement;
  btnIntegration!: HTMLElement;

  currentSovendusProduct:
    | undefined
    | "optimize"
    | "voucherNetwork"
    | "checkoutProducts"
    | "IntegrationInfo";

  createOverlay(
    selfTester: SelfTester,
    onRepeatTests: () => Promise<void>,
  ): void {
    this.createOuterOverlay();
    this.createInnerOverlay({
      loadingDone: true,
      onRepeatTests,
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

            <div class="${sovendusOverlayFontClass}" style="display: flex; gap: 8px; margin-bottom: 10px; margin-top: 10px">
                <button id="button-CBVN" class="${sovendusOverlayFontClass} ${sovendusOverlayButtonClass}">CB & VN <span class="button-checkmark" style="display: inline;">✔️</span></button>
                <button id="button-Optimize" class="${sovendusOverlayFontClass} ${sovendusOverlayButtonClass}">Optimize <span class="button-checkmark" style="display: none;">✔️</span></button>
                <button id="button-Checkout" class="${sovendusOverlayFontClass} ${sovendusOverlayButtonClass}">Checkout Products <span class="button-checkmark" style="display: none;">✔️</span></button>
            </div>

            ${this.createInnerInnerOverlay(selfTester)}
        `,
    });
    this.iframe = document.getElementById(
      testLoadedIFrameId,
    ) as HTMLIFrameElement;

    this.btnCBVN = this.iframe.contentWindow?.document.getElementById(
      "button-CBVN",
    ) as HTMLElement;
    this.btnOptimize = this.iframe.contentWindow?.document.getElementById(
      "button-Optimize",
    ) as HTMLElement;
    this.btnCheckout = this.iframe.contentWindow?.document.getElementById(
      "button-Checkout",
    ) as HTMLElement;
    this.btnIntegration = this.iframe.contentWindow?.document.getElementById(
      "button-IntegrationInfo",
    ) as HTMLElement;

    this.btnCBVN.addEventListener("click", (): void => {
      this.currentSovendusProduct = "voucherNetwork";
      this.toggleView(this.iframe);
    });

    this.btnOptimize.addEventListener("click", (): void => {
      this.currentSovendusProduct = "optimize";
      this.toggleView(this.iframe);
    });

    this.btnCheckout.addEventListener("click", (): void => {
      this.currentSovendusProduct = "checkoutProducts";
      this.toggleView(this.iframe);
    });

    this.btnIntegration.addEventListener("click", (): void => {
      this.currentSovendusProduct = "IntegrationInfo";
      this.toggleView(this.iframe);
    });
  }

  toggleView(iframe: HTMLIFrameElement): void {
    const CBVNdiv = iframe.contentWindow?.document.getElementById(
      "CBVNdiv",
    ) as HTMLElement;
    const optimizeDiv = iframe.contentWindow?.document.getElementById(
      "Optimizediv",
    ) as HTMLElement;
    const checkoutProductsDiv = iframe.contentWindow?.document.getElementById(
      "CheckoutProductsDIV",
    ) as HTMLElement;
    const IntegrationInfoDiv = iframe.contentWindow?.document.getElementById(
      "IntegrationInfoDIV",
    ) as HTMLElement;

    if (CBVNdiv) {
      CBVNdiv.style.display = "none";
    }
    if (optimizeDiv) {
      optimizeDiv.style.display = "none";
    }
    if (checkoutProductsDiv) {
      checkoutProductsDiv.style.display = "none";
    }
    if (IntegrationInfoDiv) {
      IntegrationInfoDiv.style.display = "none";
    }

    switch (this.currentSovendusProduct) {
      case "voucherNetwork":
        if (CBVNdiv) {
          CBVNdiv.style.display = "inline";
        }
        break;
      case "optimize":
        if (optimizeDiv) {
          optimizeDiv.style.display = "inline";
        }
        break;
      case "checkoutProducts":
        if (checkoutProductsDiv) {
          checkoutProductsDiv.style.display = "inline";
        }
        break;
      case "IntegrationInfo":
        if (IntegrationInfoDiv) {
          IntegrationInfoDiv.style.display = "inline";
        }
        break;
    }

    this.updateButtonStyles(iframe);
  }

  updateButtonStyles(iframe: HTMLIFrameElement): void {
    const btnCBVN = iframe.contentWindow?.document.getElementById(
      "button-CBVN",
    ) as HTMLElement;
    const btnOptimize = iframe.contentWindow?.document.getElementById(
      "button-Optimize",
    ) as HTMLElement;
    const btnCheckout = iframe.contentWindow?.document.getElementById(
      "button-Checkout",
    ) as HTMLElement;
    const btnIntegration = iframe.contentWindow?.document.getElementById(
      "button-IntegrationInfo",
    ) as HTMLElement;

    btnCBVN.querySelector(".button-checkmark")!.style.display =
      this.currentSovendusProduct === "voucherNetwork" ? "inline" : "none";
    btnOptimize.querySelector(".button-checkmark")!.style.display =
      this.currentSovendusProduct === "optimize" ? "inline" : "none";
    btnCheckout.querySelector(".button-checkmark")!.style.display =
      this.currentSovendusProduct === "checkoutProducts" ? "inline" : "none";
    btnIntegration.querySelector(".button-checkmark")!.style.display =
      this.currentSovendusProduct === "IntegrationInfo" ? "inline" : "none";
  }

  createLoadingOverlay(onRepeatTests: () => Promise<void>): void {
    this.createOuterOverlay();
    this.createInnerOverlay({
      onRepeatTests,
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
    removeSelfTesterOverlay();
    const overlay = document.createElement("div");
    overlay.id = outerOverlayId;
    overlay.translate = false;
    overlay.innerHTML = `
      ${this.getOuterOverlayStyle()}
      <button class="${sovendusOverlayFontClass} ${sovendusOverlayOpenButtonClass}" id="${openSovendusOverlayId}">
        <img src="/sovendus.png?v=1" alt="Toggle Overlay" />
      </button>
      <button id="${closeSovendusOverlayId}" class="${sovendusOverlayFontClass} ${sovendusOverlayButtonClass}">
        &#10006;
      </button>
      <div id="${overlayId}">
      </div>
    `;
    document.body.appendChild(overlay);

    const toggle = document.getElementById(openSovendusOverlayId);
    const close = document.getElementById(closeSovendusOverlayId);

    if (toggle && close) {
      toggle.addEventListener("click", toggleOverlay);
      close.addEventListener("click", toggleOverlay);
      this.makeButtonDraggable(toggle);
    } else {
      console.error("Failed to add click event to show / hide buttons");
      void transmitIntegrationError(
        "Failed to add click event to show / hide buttons",
        { windowParameter: window },
      );
    }
  }

  makeButtonDraggable(button: HTMLElement): void {
    let isDragging = false;
    let startX: number;
    let startY: number;

    const onMouseDown = (e: MouseEvent): void => {
      isDragging = true;
      startX = e.clientX - button.offsetLeft;
      startY = e.clientY - button.offsetTop;
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent): void => {
      if (!isDragging) {
        return;
      }

      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      const maxX = window.innerWidth - button.offsetWidth;
      const maxY = window.innerHeight - button.offsetHeight;

      button.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
      button.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
      button.style.bottom = "auto";
    };

    const onMouseUp = (): void => {
      isDragging = false;
      localStorage.setItem(
        "buttonPosition",
        JSON.stringify({
          left: button.style.left,
          top: button.style.top,
        }),
      );
    };

    button.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    const savedPosition = localStorage.getItem("buttonPosition");
    if (savedPosition) {
      const { left, top } = JSON.parse(savedPosition);
      button.style.left = left;
      button.style.top = top;
      button.style.bottom = "auto";
    } else {
      button.style.left = "20px";
      button.style.bottom = "20px";
      button.style.top = "auto";
    }
  }

  createInnerOverlay({
    headerRightElement,
    children,
    loadingDone,
    onRepeatTests,
  }: {
    headerRightElement?: string;
    children: string;
    loadingDone?: true;
    onRepeatTests: () => Promise<void>;
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
          { windowParameter: window },
        );
      }

      const iFrameStyle = document.createElement("style");
      iFrameStyle.id = iFrameStyleId;
      iFrameStyle.innerHTML = `#${testLoadedIFrameId} { height: 1200px !important; }`;
      overlay.insertAdjacentElement("afterbegin", iFrameStyle);

      if (!loadingDone) {
        window.addEventListener("resize", (): void => updateIFrameHeight());
      }

      updateIFrameHeight(iframe);
      if (loadingDone) {
        this.addButtonAndInfoEventListener(iframe, onRepeatTests);
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
        <div id="CBVNdiv" style="display: inline;">
          ${this.getSovIFramesData(selfTester, awinIntegrationNoSaleTrackedOrTrackedToEarly)}
          ${
            awinIntegrationDetected
              ? ""
              : this.generateConsumerDataReport(selfTester)
          }
        </div>
        <div id="Optimizediv" style="display: none;">
          ${this.generateOptimizeDataReport()}
        </div>
        <div id="CheckoutProductsDIV" style="display: none;">
          ${this.generateCheckoutProductsDataReport()}
        </div>
        <div id="IntegrationInfoDIV" style="display: none;">
          ${this.generateIntegrationInfoReport()}
        </div>
    `;
  }

  generateOptimizeDataReport(): string {
    return `
      <ul class="${sovendusOverlayFontClass}">
      <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}">
        Data:
      </h2>
      ${
        window.sovIntegrationInfo.data &&
        Object.entries(window.sovIntegrationInfo.data)
          .map(([key, value]) => {
            return `
            <li class="${sovendusOverlayFontClass}">
              ${key}: ${JSON.stringify(value)}
            </li>
        `;
          })
          .join("")
      }
      </ul>
    `;
  }

  generateCheckoutProductsDataReport(): string {
    return `
    <ul class="${sovendusOverlayFontClass}">
    <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}">
    Data:
    </h2>
    ${
      window.sovIntegrationInfo.data &&
      Object.entries(window.sovIntegrationInfo.data)
        .map(([key, value]) => {
          return `
        <li class="${sovendusOverlayFontClass}">
        ${key}: ${JSON.stringify(value)}
        </li>
        `;
        })
        .join("")
    }
    </ul>
    `;
  }

  generateIntegrationInfoReport(): string {
    return `
        ${
          window.sovIntegrationInfo &&
          Object.entries(window.sovIntegrationInfo)
            .map(([groupKey, values]) => {
              if (groupKey === "data") {
                return;
              }
              return `
        <ul class="${sovendusOverlayFontClass}">
          <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}">
            ${groupKey}:
          </h2>
          ${
            values &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            Object.entries(values)
              .map(([key, value]) => {
                return `
                <li class="${sovendusOverlayFontClass}">
                  ${key}: ${JSON.stringify(value)}
                </li>
                `;
              })
              .join("")
          }
        </ul>
      `;
            })
            .join("")
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
              consumerDateOfBirth: ${testResult.consumerDateOfBirth.getFormattedStatusMessage()}
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

  // ${
  //   window.sovIntegrationInfo &&
  //   Object.entries(window.sovIntegrationInfo).map(([groupKey, values]) => {
  //     return `
  //         <ul class="${sovendusOverlayFontClass}">
  //           <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}">
  //             ${groupKey}:
  //           </h2>
  //           ${
  //             values &&
  //             // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  //             Object.entries(values)
  //               .map(([key, value]) => {
  //                 return `
  //                 <li class="${sovendusOverlayFontClass}">
  //                   ${key}: ${JSON.stringify(value)}
  //                 </li>
  //                 `;
  //               })
  //               .join("")
  //           }
  //         </ul>
  //       `;
  //   })
  // }

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
          .${sovendusOverlayOpenButtonClass} {
              background: transparent !important;
              border: none;
              padding: 0;
              cursor: pointer;
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
          .${sovendusActiveButtonClass} {
            background: #008000 !important;
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
          #${openSovendusOverlayId} {
            background: transparent !important;
            width: 60px !important;
            height: 60px !important;
            position: fixed !important;
            display: none;
            z-index: 2147483647 !important;
            border: unset !important;
            line-height: normal !important;
            cursor: move;
            touch-action: none;
            user-select: none;
            padding: 0 !important;
            margin: 0 !important;
            transition: none !important;
          }
          #${openSovendusOverlayId} img {
              display: block;
              width: 60px;
              height: 60px;
          }
          #${openSovendusOverlayId}:active {
            cursor: grabbing;
          }
          #${closeSovendusOverlayId} {
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

  addButtonAndInfoEventListener(
    iframe: HTMLIFrameElement,
    onRepeatTests: () => Promise<void>,
  ): void {
    iframe.contentWindow?.document
      .getElementById(sovendusOverlayRepeatTestsId)
      ?.addEventListener("click", () => {
        void onRepeatTests();
      });

    // const btnCBVN = iframe.contentWindow?.document.getElementById(
    //   "button-CBVN",
    // ) as HTMLElement;
    // window.activeButton = btnCBVN;
    // const btnOptimize = iframe.contentWindow?.document.getElementById(
    //   "button-Optimize",
    // ) as HTMLElement;
    // const btnCheckout = iframe.contentWindow?.document.getElementById(
    //   "button-Checkout",
    // ) as HTMLElement;

    // btnCBVN.addEventListener("click", (): void => {
    //   void showCBVN(btnCBVN, iframe);
    // });
    // btnOptimize.addEventListener("click", (): void => {
    //   void showOptimize(btnOptimize, iframe);
    // });
    // btnCheckout.addEventListener("click", (): void => {
    //   void showCheckoutProducts(btnCheckout, iframe);
    // });

    const tooltipInfoIcons = (
      document.getElementById(testLoadedIFrameId) as HTMLIFrameElement
    )?.contentWindow?.document.getElementsByClassName(
      tooltipButtonClass,
    ) as HTMLCollectionOf<HTMLElement>;

    for (const item of tooltipInfoIcons) {
      if (item.nextElementSibling) {
        const tooltip = item.nextElementSibling as HTMLElement;

        const showTooltip = (): void => {
          tooltip.style.display = "block";

          // TODO
          // const { x, y } =
          //   await // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          //   (computePositionFromCDN as typeof computePosition)(item, tooltip, {
          //     middleware: [
          //       // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          //       (autoPlacementFromCDN as typeof autoPlacement)(),
          //     ],
          //   });
          // tooltip.style.left = `${x}px`;
          // tooltip.style.top = `${y}px`;
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

export function updateIFrameHeight(iframe?: HTMLIFrameElement): void {
  const _iframe =
    iframe ||
    (document.getElementById(testLoadedIFrameId) as HTMLIFrameElement | null);
  const innerOverlay = _iframe?.contentDocument?.getElementById(innerOverlayId);
  const iFrameStyle = document.getElementById(
    iFrameStyleId,
  ) as HTMLStyleElement | null;
  if (!_iframe || !innerOverlay || !iFrameStyle) {
    if (!_iframe) {
      // eslint-disable-next-line no-console
      console.error("Failed to get iframe to update iframe height.");
      void transmitIntegrationError(
        "Failed to get iframe to update iframe height.",
        { windowParameter: window },
      );
    }
    if (!innerOverlay) {
      // eslint-disable-next-line no-console
      console.error("Failed to get innerOverlay to update iframe height.");
      void transmitIntegrationError(
        "Failed to get innerOverlay to update iframe height.",
        { windowParameter: window },
      );
    }
    if (!iFrameStyle) {
      // eslint-disable-next-line no-console
      console.error("Failed to get iFrameStyle to update iframe height.");
      void transmitIntegrationError(
        "Failed to get iFrameStyle to update iframe height.",
        { windowParameter: window },
      );
    }
  } else {
    iFrameStyle.innerHTML = `#${testLoadedIFrameId} { height: ${innerOverlay.scrollHeight}px !important; }`;
  }
}

function toggleOverlay(): void {
  const overlay = document.getElementById(overlayId);
  const openButton = document.getElementById(openSovendusOverlayId);
  const closeButton = document.getElementById(closeSovendusOverlayId);

  if (overlay && openButton && closeButton) {
    if (overlay.style.display === "none") {
      overlay.style.display = "block";
      openButton.style.display = "none";
      closeButton.style.display = "block";
      updateIFrameHeight();
    } else {
      overlay.style.display = "none";
      openButton.style.display = "block";
      closeButton.style.display = "none";
    }
  }
}

export interface SovDebugOverlayWindow extends SovSelfTesterWindow {
  originalOnresize?: ((this: GlobalEventHandlers, ev: UIEvent) => void) | null;
}

declare let window: SovDebugOverlayWindow;
