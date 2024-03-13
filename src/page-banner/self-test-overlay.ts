import SelfTester, { StatusCodes } from "./self-tester.js";

(async () => {
  repeatTestsOnSPA(async () => {
    await executeTests();
  });
})();

async function executeTests() {
  removeOverlay();
  const selfTester = new SelfTester();
  await selfTester.waitForSovendusIntegrationDetected();
  await selfTester.selfTestIntegration();
  new SelfTesterOverlay(selfTester);
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
  constructor(selfTester: SelfTester) {
    this.createOverlay(selfTester);
  }

  createOverlay(selfTester: SelfTester) {
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
          <p class="sovendus-overlay-font">Integration Type: ${
            selfTester.integrationType
          }</p>
          ${this.createInnerOverlay(selfTester)}
        </div>
      </div>
    `;
    document.getElementsByTagName("body")[0].appendChild(overlay);
    document
      .getElementById("toggleSovendusOverlay")
      .addEventListener("click", this.toggleOverlay);
    document
      .getElementById("sovendusOverlayRepeatTests")
      .addEventListener("click", executeTests);
    const checkMarks: HTMLCollectionOf<Element> =
      document.getElementsByClassName("sovendus-info");
    for (let element of checkMarks) {
      element.parentElement.parentElement.addEventListener(
        "mouseover",
        this.showInfoText
      );
      element.parentElement.parentElement.addEventListener(
        "mouseout",
        this.hideInfoText
      );
    }
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
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerSalutation: ${testResult.consumerSalutation.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerFirstName: ${testResult.consumerFirstName.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerLastName: ${testResult.consumerLastName.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerYearOfBirth: ${
                testResult.consumerYearOfBirth.statusMessage
              }
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerEmail: ${testResult.consumerEmail.statusMessage}
            </li>
            ${
              testResult.consumerEmailHash.statusMessage &&
              testResult.consumerEmailHash.statusMessage
            }            
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerPhone: ${testResult.consumerPhone.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerStreet: ${testResult.consumerStreet.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerStreetNumber: ${
                testResult.consumerStreetNumber.statusMessage
              }
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerZipcode: ${testResult.consumerZipCode.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerCity: ${testResult.consumerCity.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerCountry: ${testResult.consumerCountry.statusMessage}
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
          ${testResult.awinTest.statusMessage}
    `;
    } else {
      additionalInfo = `
      <h2 class="sovendus-overlay-font sovendus-overlay-h2">Sovendus Container:</h2>
      <ul class="sovendus-overlay-font sovendus-overlay-ul">
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          iframeContainerId: ${testResult.iframeContainerId.statusMessage}
        </li>
        ${testResult.isEnabledInBackend.statusMessage}
        ${testResult.sovendusDivFound.statusMessage}
        ${testResult.multipleIFramesAreSame.statusMessage}
      </ul>
      <h2 class="sovendus-overlay-font sovendus-overlay-h2">Order Data:</h2>
      <ul class="sovendus-overlay-font sovendus-overlay-ul">
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          orderCurrency: ${testResult.orderCurrency.statusMessage}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          orderId: ${testResult.orderId.statusMessage}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          orderValue: ${testResult.orderValue.statusMessage}
        </li>
        ${
          awinIntegrationDetected
            ? ""
            : "<li class'sovendus-overlay-font sovendus-overlay-text'>" +
              "sessionId: " +
              testResult.sessionId.statusMessage +
              "</li>"
        }
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          timestamp: ${testResult.timestamp.statusMessage}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          usedCouponCode: ${testResult.usedCouponCode.statusMessage}
        </li>
      </ul>
    `;
    }
    return `
      <div>
        ${
          testResult.flexibleIFrameOnDOM
            ? testResult.flexibleIFrameOnDOM.statusMessage
            : ""
        }
        <h2 class="sovendus-overlay-font sovendus-overlay-h2">Sovendus Partner Numbers:</h2>
        <ul class="sovendus-overlay-font sovendus-overlay-ul">
          <li class'sovendus-overlay-font sovendus-overlay-text'>
            trafficSourceNumber: ${testResult.trafficSourceNumber.statusMessage}
          </li>
          <li class'sovendus-overlay-font sovendus-overlay-text'>
            trafficMediumNumber: ${testResult.trafficMediumNumber.statusMessage}
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
            top: 50px !important;
            padding: 22px !important;
            background: #293049 !important;
            z-index: 2147483647 !important;
            overflow-y: auto !important;
            max-height: calc(100vh - 100px) !important;
            border-radius: 8px !important;    
            line-height: normal !important;        
          }
          #sovendusOverlay.fullscreen {
            width: 100vw !important;
            height: 100vh !important;
            top: 0 !important;
            left: 0 !important;
            max-height: 100vh !important;
          }
          @media only screen and (max-width: 700px) {
            #sovendusOverlay {
              left: 0 !important;
              right: 0 !important;
              width: 500px !important;
              max-width: 500px !important;
              top: 50px !important;
              padding: 22px !important;
            }
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
    const label = (event.currentTarget as HTMLElement).firstElementChild
      .firstElementChild;
    if (label) {
      (label as HTMLElement).style.display = "block";
    }
  }
  hideInfoText(event: MouseEvent) {
    const label = (event.currentTarget as HTMLElement).firstElementChild
      .firstElementChild;
    if (label) {
      (label as HTMLElement).style.display = "none";
    }
  }
}
