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
  transmitTestResult(window.sovSelfTester);
  const overlay = new SelfTesterOverlay();
  await overlay.createOverlay(window.sovSelfTester);
}

interface testsFn {
  (): Promise<void>;
}

async function transmitTestResult(testResult: SelfTester) {
  try {
    const response = await fetch("http://localhost:3000/api/tests", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testResult.getTestResultResponseData()),
    });
    const result = response.ok;
    console.log(result);
  } catch (e) {
    console.error("Failed to transmit sovendus test result - error:", e);
  }
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
  constructor() {}

  async createOverlay(selfTester: SelfTester) {
    var overlay = document.createElement("div");
    overlay.id = "outerSovendusOverlay";
    overlay.innerHTML = `
      ${this.getOverlayStyle()}
      <button class="sovendus-overlay-font sovendus-overlay-button" id="toggleSovendusOverlay">
        Hide
      </button>
      <div class="sovendus-overlay-font" id="sovendusOverlay">  
        <div style="margin:auto;max-width:500px;">
          <div>
            <h1 class="sovendus-overlay-font sovendus-overlay-h1">Sovendus Self-Test Overlay</h1>
            <button class="sovendus-overlay-font sovendus-overlay-button" id="sovendusOverlayRepeatTests">repeat tests</button>
          </div>
          <p class="sovendus-overlay-font" style="margin:0 !important">
            Integration Type: ${selfTester.integrationType.elementValue}
          </p>
          <p class="sovendus-overlay-font" style="margin:0 !important">
            Browser: ${selfTester.browserName.elementValue}
          </p>
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
        this.showInfoText
      );
      element.parentElement?.parentElement?.addEventListener(
        "mouseout",
        this.hideInfoText
      );
    }
    // this.moveOverlayAboveAll();
  }

  createInnerOverlay(selfTester: SelfTester) {
    let innerOverlay: string = "";
    const awinIntegrationDetected = selfTester.awinIntegrationDetected();
    if (selfTester.wasExecuted.statusCode === StatusCodes.Success) {
      innerOverlay = `
        ${this.getSovIFramesData(selfTester, false, awinIntegrationDetected)}
        ${
          awinIntegrationDetected
            ? ""
            : this.generateConsumerDataReport(selfTester)
        }
    `;
    } else if (awinIntegrationDetected) {
      const awinIntegrationNoSaleTracked = true;
      innerOverlay = `
        ${this.getSovIFramesData(
          selfTester,
          awinIntegrationNoSaleTracked,
          awinIntegrationDetected
        )}
        `;
    } else {
      innerOverlay = `
        ${this.getSovIFramesData(selfTester)}
        ${this.generateConsumerDataReport(selfTester)}
        `;
    }
    return innerOverlay;
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
            <li class='sovendus-overlay-font sovendus-overlay-text'>
              consumerEmailHash: ${
                testResult.consumerEmailHash.statusCode !==
                StatusCodes.TestDidNotRun
                  ? testResult.consumerEmailHash.getFormattedStatusMessage()
                  : ""
              }
            </li>
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
    testResult: SelfTester,
    awinIntegrationNoSaleTracked: boolean = false,
    awinIntegrationDetected: boolean = false
  ): string {
    let additionalInfo: string;
    if (awinIntegrationNoSaleTracked) {
      additionalInfo = `
          ${testResult.awinTest.getFormattedStatusMessage()}
    `;
    } else {
      additionalInfo = `
      <h2 class="sovendus-overlay-font sovendus-overlay-h2">Sovendus Container:</h2>
      <ul class="sovendus-overlay-font sovendus-overlay-ul">
        <li class='sovendus-overlay-font sovendus-overlay-text'>
          iframeContainerId: ${testResult.iframeContainerId.getFormattedStatusMessage()}
        </li>
        ${testResult.isEnabledInBackend.getFormattedGeneralStatusMessage()}
        ${testResult.sovendusDivFound.getFormattedGeneralStatusMessage()}
        ${testResult.multipleIFramesAreSame.getFormattedGeneralStatusMessage()}
        ${testResult.flexibleIFrameOnDOM.getFormattedGeneralStatusMessage()}
        ${testResult.isFlexibleIframeExecutable.getFormattedGeneralStatusMessage()}
        ${testResult.isSovendusJsOnDom.getFormattedGeneralStatusMessage()}
        ${testResult.isSovendusJsExecutable.getFormattedGeneralStatusMessage()}
        ${testResult.flexibleIFrameOnDOM.getFormattedGeneralStatusMessage()}
      </ul>
      <h2 class="sovendus-overlay-font sovendus-overlay-h2">Order Data:</h2>
      <ul class="sovendus-overlay-font sovendus-overlay-ul">
        <li class='sovendus-overlay-font sovendus-overlay-text'>
          orderCurrency: ${testResult.orderCurrency.getFormattedStatusMessage()}
        </li>
        <li class='sovendus-overlay-font sovendus-overlay-text'>
          orderId: ${testResult.orderId.getFormattedStatusMessage()}
        </li>
        <li class='sovendus-overlay-font sovendus-overlay-text'>
          orderValue: ${testResult.orderValue.getFormattedStatusMessage()}
        </li>
        ${
          awinIntegrationDetected
            ? ""
            : "<li class='sovendus-overlay-font sovendus-overlay-text'>" +
              "sessionId: " +
              testResult.sessionId.getFormattedStatusMessage() +
              "</li>"
        }
        <li class='sovendus-overlay-font sovendus-overlay-text'>
          timestamp: ${testResult.timestamp.getFormattedStatusMessage()}
        </li>
        <li class='sovendus-overlay-font sovendus-overlay-text'>
          usedCouponCode: ${testResult.usedCouponCode.getFormattedStatusMessage()}
        </li>
      </ul>
    `;
    }
    return `
      <div>
        <h2 class="sovendus-overlay-font sovendus-overlay-h2">Sovendus Partner Numbers:</h2>
        <ul class="sovendus-overlay-font sovendus-overlay-ul">
          <li class='sovendus-overlay-font sovendus-overlay-text'>
            trafficSourceNumber: ${testResult.trafficSourceNumber.getFormattedStatusMessage()}
          </li>
          <li class='sovendus-overlay-font sovendus-overlay-text'>
            trafficMediumNumber: ${testResult.trafficMediumNumber.getFormattedStatusMessage()}
          </li>
          ${additionalInfo}
        </ul>
      </div>`;
  }

  getOverlayStyle() {
    return `
        <style>
          #sovendusOverlay {
            position: fixed !important;
            left: calc(50% - 250px) !important;
            right: calc(50% - 250px) !important;
            width: 500px !important;
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
            margin: 5px 0 !important;
          }
          #sovendusOverlay .sovendus-overlay-h1 {
            font-size: 27px !important;
            margin-top: 0 !important;
            margin-bottom: 5px !important;
          }
          #sovendusOverlay .sovendus-overlay-h2 {
            font-size: 20px !important;
            margin-top: 4px !important;
            margin-bottom: 4px !important;
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
    const label = (event.currentTarget as HTMLElement)?.firstElementChild
      ?.firstElementChild;
    if (label) {
      (label as HTMLElement).style.display = "block";
    }
  }
  hideInfoText(event: MouseEvent) {
    const label = (event.currentTarget as HTMLElement)?.firstElementChild
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
