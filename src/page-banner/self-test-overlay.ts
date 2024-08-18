import {
  fullscreenClass,
  outerOverlayId,
  overlayId,
  sovendusInfoClass,
  sovendusOverlayButtonClass,
  sovendusOverlayErrorClass,
  sovendusOverlayFontClass,
  sovendusOverlayH1Class,
  sovendusOverlayH2Class,
  sovendusOverlayH3Class,
  sovendusOverlayRepeatTestsId,
  sovendusOverlayTextClass,
  toggleSovendusOverlayId,
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
    const overlay = document.getElementById(outerOverlayId) as HTMLElement;
    overlay.innerHTML = this.createOuterOverlay({
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
          ${this.createInnerOverlay(selfTester)}
      `,
    });
    overlay.addEventListener("click", toggleOverlay);
    this.addButtonAndInfoEventListener();
    // this.moveOverlayAboveAll();
  }

  createLoadingOverlay(): void {
    const overlay = document.createElement("div");
    overlay.id = outerOverlayId;
    overlay.innerHTML = this.createOuterOverlay({
      children: `
          <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}">
            Sovendus detected, tests are currently running...
          </h2>
          <h3 class="${sovendusOverlayFontClass} ${sovendusOverlayH3Class}">
            This can take up to 10 seconds
          </h3>
      `,
    });
    document.body.appendChild(overlay);
    overlay.addEventListener("click", toggleOverlay);
  }

  createOuterOverlay({
    headerRightElement = "",
    children,
  }: {
    headerRightElement?: string;
    children: string;
  }): string {
    return `
      ${this.getOverlayStyle()}
      <button class="${sovendusOverlayFontClass} ${sovendusOverlayButtonClass}" id="${toggleSovendusOverlayId}">
        Hide
      </button>
      <div class="${sovendusOverlayFontClass}" id="${overlayId}">  
        <div style="margin:auto;max-width:700px; background: #293049">
          <div style="display: flex">
            <h1 class="${sovendusOverlayFontClass} ${sovendusOverlayH1Class}" style="margin-right: auto">
              Sovendus Self-Test Overlay
            </h1>
            ${headerRightElement}
          </div>
          ${children}
        </div>
      </div>
    `;
  }

  createInnerOverlay(selfTester: SelfTester): string {
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

  getOverlayStyle(): string {
    return `
        <style>
          #${overlayId} {
            position: fixed !important;
            left: calc(50% - 350px) !important;
            right: calc(50% - 350px) !important;
            width: 700px !important;
            max-width: calc(100vw) !important;
            top: 50px !important;
            padding: 22px !important;
            background: #293049 !important;
            z-index: 2147483648 !important;
            overflow-y: auto !important;
            max-height: calc(100vh - 100px) !important;
            border: unset !important;
            border-radius: 8px !important;    
            line-height: normal !important;        
          }
          #${overlayId}.${fullscreenClass} {
            width: calc(100vw - 44px) !important;
            max-width: calc(100vw - 44px) !important;
            height: 100vh !important;
            top: 0 !important;
            left: 0 !important;
            max-height: 100vh !important;
          }
          #${overlayId} .${sovendusOverlayFontClass},
          #${overlayId} ul .${sovendusOverlayFontClass},
          #${overlayId} li .${sovendusOverlayFontClass} {
            color: white !important;
            font-family: Arial, Helvetica, sans-serif !important;
          }
          #${overlayId} .${sovendusOverlayErrorClass} {
            color: red !important;
            font-size: 17px !important;
            margin: 0 !important;
          }
          #${overlayId} .${sovendusOverlayH1Class} {
            font-size: 27px !important;
            margin-top: 0 !important;
            margin-bottom: 5px !important;
          }
          #${overlayId} .${sovendusOverlayH2Class} {
            font-size: 20px !important;
            margin-top: 6px !important;
            margin-bottom: 0px !important;
          }
          #${overlayId} .${sovendusOverlayH3Class} {
            font-size: 17px !important;
            margin-top: 6px !important;
            margin-bottom: 0px !important;
          }
          #${overlayId} .${sovendusOverlayTextClass} {
            font-size: 15px !important;
          }
          #${overlayId} li {
            font-size: 16px !important;
            margin-left: 45px !important;
          }
          #${overlayId} li::marker {
            content: '🞄 ' !important;
            unicode-bidi: isolate !important;
            font-variant-numeric: tabular-nums !important;
            text-transform: none !important;
            text-indent: 0px !important;
            text-align: start !important;
            text-align-last: start !important;
          }
          #${overlayId} ul {
            margin: 0 !important;
            padding: 0 !important;
          }
          #${overlayId} a {
            color: #197bbd !important;
          }
          #${overlayId} a:hover {
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
              padding: 15px 0 15px 5px !important;
              width: calc(100vw - 5px) !important;
            }
            #${overlayId}.${fullscreenClass} {
              width: calc(100vw - 5px) !important;
              max-width: calc(100vw - 5px) !important;
            }
            #${overlayId} li {
              font-size: 15px !important;
              margin-left: 25px !important;
            }
            #${overlayId} .${sovendusOverlayErrorClass} {
              font-size: 15px !important;
            }
            #${overlayId} .${sovendusOverlayH1Class} {
              font-size: 22px !important;
              margin-bottom: 3px !important;
            }
            #${overlayId} .${sovendusOverlayH2Class} {
              font-size: 18px !important;
            }
            #${overlayId} .${sovendusOverlayH3Class} {
              font-size: 15px !important;
            }
            #${overlayId} .${sovendusOverlayTextClass} {
              font-size: 14px !important;
            }
          }
        </style>
        `;
  }

  addButtonAndInfoEventListener(): void {
    document
      .getElementById(sovendusOverlayRepeatTestsId)
      ?.addEventListener("click", () => {
        void executeTests();
      });
    const checkMarks: HTMLCollectionOf<Element> =
      document.getElementsByClassName(sovendusInfoClass);
    for (const element of checkMarks) {
      element.parentElement?.parentElement?.addEventListener(
        "mouseover",
        showInfoText,
      );
      element.parentElement?.parentElement?.addEventListener(
        "mouseout",
        hideInfoText,
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

function showInfoText(event: MouseEvent): void {
  const label = (event.currentTarget as HTMLElement)?.lastElementChild
    ?.firstElementChild;
  if (label) {
    (label as HTMLElement).style.display = "block";
  }
}

function hideInfoText(event: MouseEvent): void {
  const label = (event.currentTarget as HTMLElement)?.lastElementChild
    ?.firstElementChild;
  if (label) {
    (label as HTMLElement).style.display = "none";
  }
}

interface SovWindow extends Window {
  sovSelfTester?: SelfTester;
}

declare let window: SovWindow;
