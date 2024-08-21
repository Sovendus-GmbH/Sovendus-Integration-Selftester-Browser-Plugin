import { StatusCodes } from "./self-tester-data-to-sync-with-dev-hub.js";
import SelfTester from "./self-tester.js";

(async () => {
  repeatTestsOnSPA(async () => {
    await executeTests();
  });
})();

async function executeTests() {
  removeOverlay();
  window.sovSelfTester = new SelfTester();
  await window.sovSelfTester.waitForSovendusIntegrationDetected();
  await window.sovSelfTester.selfTestIntegration();

  const overlay = new SelfTesterOverlay();
  await overlay.createOverlay(window.sovSelfTester);
}

interface testsFn {
  (): Promise<void>;
}

async function repeatTestsOnSPA(tests: testsFn) {
  let visitedPath = "";
  while (true) {
    if (visitedPath !== window.location.pathname) {
      visitedPath = window.location.pathname;
      await tests();
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

function removeOverlay() {
  document.getElementById("outerSovendusOverlay")?.remove();
}
class SelfTesterOverlay {
  async createOverlay(selfTester: SelfTester) {
    const overlay = document.createElement("div");
    overlay.id = "outerSovendusOverlay";
    overlay.innerHTML = `
      ${this.getOverlayStyle()}
      <button class="sovendus-overlay-font sovendus-overlay-button" id="toggleSovendusOverlay">
        Hide
      </button>
      <div class="sovendus-overlay-font" id="sovendusOverlay">  
        <div style="margin:auto;max-width:700px; background: #293049">
          <div style="display: flex">
            <h1 class="sovendus-overlay-font sovendus-overlay-h1" style="margin-right: auto">
              Sovendus Self-Test Overlay
            </h1>
            <button class="sovendus-overlay-font sovendus-overlay-button" id="sovendusOverlayRepeatTests" style="margin-left: auto">
              repeat tests
            </button>
          </div>
          <ul class="sovendus-overlay-ul sovendus-overlay-font ">
            <li class="sovendus-overlay-font">
              Integration Type: ${selfTester.integrationType.getFormattedStatusMessage(false)}
            </li>
            <li class="sovendus-overlay-font">
              Browser: ${selfTester.browserName.elementValue}
            </li>
            ${selfTester.multipleIFramesAreSame.getFormattedGeneralStatusMessage()}
            ${selfTester.isFlexibleIframeExecutable.getFormattedGeneralStatusMessage()}
            ${selfTester.isSovendusJsOnDom.getFormattedGeneralStatusMessage()}
            ${selfTester.isSovendusJsExecutable.getFormattedGeneralStatusMessage()}
            ${selfTester.awinExecutedTestResult.getFormattedGeneralStatusMessage()}
          </ul>
          ${this.createInnerOverlay(selfTester)}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document
      .getElementById("toggleSovendusOverlay")
      ?.addEventListener("click", this.toggleOverlay);
    document
      .getElementById("sovendusOverlayRepeatTests")
      ?.addEventListener("click", executeTests);
    const checkMarks: HTMLCollectionOf<Element> =
      document.getElementsByClassName("sovendus-info");
    for (let element of checkMarks) {
      element.parentElement?.parentElement?.addEventListener(
        "mouseover",
        this.showInfoText,
      );
      element.parentElement?.parentElement?.addEventListener(
        "mouseout",
        this.hideInfoText,
      );
    }
    // this.moveOverlayAboveAll();
  }

  createInnerOverlay(selfTester: SelfTester) {
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
        <div class="sovendus-overlay-font">
          <h2 class="sovendus-overlay-font sovendus-overlay-h2">Customer Data:</h2>
          <ul class="sovendus-overlay-font sovendus-overlay-ul">
            <li class='sovendus-overlay-font sovendus-overlay-text'>
              consumerSalutation: ${testResult.consumerSalutation.getFormattedStatusMessage()}
            </li>
            <li class='sovendus-overlay-font sovendus-overlay-text'>
              consumerFirstName: ${testResult.consumerFirstName.getFormattedStatusMessage()}
            </li>
            <li class='sovendus-overlay-font sovendus-overlay-text'>
              consumerLastName: ${testResult.consumerLastName.getFormattedStatusMessage()}
            </li>
            <li class='sovendus-overlay-font sovendus-overlay-text'>
              consumerYearOfBirth: ${testResult.consumerYearOfBirth.getFormattedStatusMessage()}
            </li>
            <li class='sovendus-overlay-font sovendus-overlay-text'>
              consumerEmail: ${testResult.consumerEmail.getFormattedStatusMessage()}
            </li>
            ${
              testResult.consumerEmailHash.statusCode ===
              StatusCodes.TestDidNotRun
                ? ""
                : `<li class='sovendus-overlay-font sovendus-overlay-text'>
              consumerEmailHash: ${testResult.consumerEmailHash.getFormattedStatusMessage()}
            </li>`
            }
            <li class='sovendus-overlay-font sovendus-overlay-text'>
              consumerPhone: ${testResult.consumerPhone.getFormattedStatusMessage()}
            </li>
            <li class='sovendus-overlay-font sovendus-overlay-text'>
              consumerStreet: ${testResult.consumerStreet.getFormattedStatusMessage()}
            </li>
            <li class='sovendus-overlay-font sovendus-overlay-text'>
              consumerStreetNumber: ${testResult.consumerStreetNumber.getFormattedStatusMessage()}
            </li>
            <li class='sovendus-overlay-font sovendus-overlay-text'>
              consumerZipcode: ${testResult.consumerZipCode.getFormattedStatusMessage()}
            </li>
            <li class='sovendus-overlay-font sovendus-overlay-text'>
              consumerCity: ${testResult.consumerCity.getFormattedStatusMessage()}
            </li>
            <li class='sovendus-overlay-font sovendus-overlay-text'>
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
      <h2 class="sovendus-overlay-font sovendus-overlay-h2">Sovendus Container:</h2>
      <ul class="sovendus-overlay-font sovendus-overlay-ul">
        <li class='sovendus-overlay-font sovendus-overlay-text'>
          iframeContainerId: ${selfTester.iframeContainerId.getFormattedStatusMessage()}
        </li>
        ${selfTester.sovendusDivFound.getFormattedGeneralStatusMessage()}
        ${selfTester.flexibleIFrameOnDOM.getFormattedGeneralStatusMessage()}
      </ul>
      <h2 class="sovendus-overlay-font sovendus-overlay-h2">Order Data:</h2>
      <ul class="sovendus-overlay-font sovendus-overlay-ul">
        <li class='sovendus-overlay-font sovendus-overlay-text'>
          orderCurrency: ${selfTester.orderCurrency.getFormattedStatusMessage()}
        </li>
        <li class='sovendus-overlay-font sovendus-overlay-text'>
          orderId: ${selfTester.orderId.getFormattedStatusMessage()}
        </li>
        <li class='sovendus-overlay-font sovendus-overlay-text'>
          orderValue: ${selfTester.orderValue.getFormattedStatusMessage()}
        </li>
        ${
          selfTester.sessionId.statusCode === StatusCodes.TestDidNotRun
            ? ""
            : "<li class='sovendus-overlay-font sovendus-overlay-text'>" +
              "sessionId: " +
              selfTester.sessionId.getFormattedStatusMessage() +
              "</li>"
        }
        <li class='sovendus-overlay-font sovendus-overlay-text'>
          timestamp: ${selfTester.timestamp.getFormattedStatusMessage()}
        </li>
        <li class='sovendus-overlay-font sovendus-overlay-text'>
          usedCouponCode: ${selfTester.usedCouponCode.getFormattedStatusMessage()}
        </li>
      </ul>
    `;
    }
    return `
      <div>
        <h2 class="sovendus-overlay-font sovendus-overlay-h2">Sovendus Partner Numbers:</h2>
        <ul class="sovendus-overlay-font sovendus-overlay-ul">
          <li class='sovendus-overlay-font sovendus-overlay-text'>
            trafficSourceNumber: ${selfTester.trafficSourceNumber.getFormattedStatusMessage()}
          </li>
          <li class='sovendus-overlay-font sovendus-overlay-text'>
            trafficMediumNumber: ${selfTester.trafficMediumNumber.getFormattedStatusMessage()}
          </li>
          ${selfTester.isEnabledInBackend.getFormattedGeneralStatusMessage()}
          ${additionalInfo}
        </ul>
      </div>`;
  }

  getOverlayStyle() {
    return `
        <style>
          #sovendusOverlay {
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
            border-radius: 8px !important;    
            line-height: normal !important;        
          }
          @media only screen and (max-width: 700px) {
            #sovendusOverlay {
              left: 0 !important;
              right: 0 !important;
              top: 50px !important;
              padding: 22px !important;
            }
          }
          #sovendusOverlay.fullscreen {
            width: calc(100vw) !important;
            max-width: calc(100vw) !important;
            height: 100vh !important;
            top: 0 !important;
            left: 0 !important;
            max-height: 100vh !important;
          }
          #sovendusOverlay .sovendus-overlay-font,
          #sovendusOverlay ul .sovendus-overlay-font,
          #sovendusOverlay li .sovendus-overlay-font {
            color: white !important;
            font-family: Arial, Helvetica, sans-serif !important;
          }
          #sovendusOverlay .sovendus-overlay-error {
            color: red !important;
            font-size: 17px !important;
            margin: 0 !important;
          }
          #sovendusOverlay .sovendus-overlay-h1 {
            font-size: 27px !important;
            margin-top: 0 !important;
            margin-bottom: 5px !important;
          }
          #sovendusOverlay .sovendus-overlay-h2 {
            font-size: 20px !important;
            margin-top: 6px !important;
            margin-bottom: 0px !important;
          }
          #sovendusOverlay .sovendus-overlay-text {
            font-size: 15px !important;
          }
          #sovendusOverlay li {
            font-size: 16px !important;
            margin-left: 45px !important;
          }
          #sovendusOverlay li::marker {
            content: '🞄 ' !important;
            unicode-bidi: isolate !important;
            font-variant-numeric: tabular-nums !important;
            text-transform: none !important;
            text-indent: 0px !important;
            text-align: start !important;
            text-align-last: start !important;
          }
          #sovendusOverlay .sovendus-overlay-ul {
            margin: 0 !important;
            padding: 0 !important;
          }
          #sovendusOverlay a {
            color: #197bbd !important;
          }
          #sovendusOverlay a:hover {
            color: #15669d !important;
          }
          .sovendus-overlay-button {
            background: #293049 !important;
            color: #fff !important;
            padding: 9px !important;
            cursor: pointer;
            font-size: 16px !important;
            border-radius: 8px !important;
            border: solid 1px #fff;
          }
          #sovendusOverlayRepeatTests {
            float: right !important;
            width: 105px !important;
          }
          #toggleSovendusOverlay {
            width: 62px !important;
            position: fixed !important;
            left: calc(50% - 10px) !important;
            right: calc(50% - 10px) !important;
            top: 20px !important;
            z-index: 2147483647 !important;
            border: unset !important;
            line-height: normal !important;
          }
        </style>
        `;
  }
  toggleOverlay() {
    var overlay = document.getElementById("sovendusOverlay");
    var toggle = document.getElementById("toggleSovendusOverlay");
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
  showInfoText(event: MouseEvent) {
    const label = (event.currentTarget as HTMLElement)?.lastElementChild
      ?.firstElementChild;
    if (label) {
      (label as HTMLElement).style.display = "block";
    }
  }
  hideInfoText(event: MouseEvent) {
    const label = (event.currentTarget as HTMLElement)?.lastElementChild
      ?.firstElementChild;
    if (label) {
      (label as HTMLElement).style.display = "none";
    }
  }
  // moveOverlayAboveAll() {
  //   function checkAndChangeZIndex(element: HTMLElement) {
  //     if (
  //       element.id !== "sovendusOverlay" &&
  //       element.id !== "toggleSovendusOverlay" &&
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

interface SovWindow extends Window {
  sovSelfTester?: SelfTester;
}

declare let window: SovWindow;
