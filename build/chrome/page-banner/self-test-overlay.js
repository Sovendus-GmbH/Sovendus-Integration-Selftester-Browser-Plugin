import SelfTester from "./self-tester.js";
(async () => {
    const selfTester = new SelfTester();
    await selfTester.waitForSovendusIntegrationDetected();
    await selfTester.selfTestIntegration();
    new SelfTesterOverlay(selfTester);
})();
class SelfTesterOverlay {
    constructor(selfTester) {
        this.createOverlay(selfTester);
    }
    createOverlay(selfTester) {
        var overlay = document.createElement("div");
        overlay.id = "outerSovendusOverlay";
        overlay.innerHTML = `
      ${this.getOverlayStyle()}
      <button class="sovendus-overlay-font" id="toggleSovendusOverlay">
        Hide
      </button>
      <div class="sovendus-overlay-font" id="sovendusOverlay">  
        <div style="margin:auto;max-width:500px;">
          <div>
            <h1 class="sovendus-overlay-font sovendus-overlay-h1">Sovendus Selftest Overlay</h1>
          </div>
          ${this.createInnerOverlay(selfTester)}
        </div>
      </div>
    `;
        document.getElementsByTagName("body")[0].appendChild(overlay);
        document
            .getElementById("toggleSovendusOverlay")
            .addEventListener("click", this.toggleOverlay);
        const checkmarks = document.getElementsByClassName("sovendus-info");
        for (let element of checkmarks) {
            element.parentElement.parentElement.addEventListener("mouseover", this.showInfoText);
            element.parentElement.parentElement.addEventListener("mouseout", this.hideInfoText);
        }
    }
    createInnerOverlay(selfTester) {
        let innerOverlay = "";
        if (selfTester.wasExecuted.elementValue) {
            innerOverlay = `
        ${this.getSovIFramesData(selfTester)}
        ${this.generateConsumerDataReport(selfTester)}
    `;
        }
        else {
            innerOverlay = `
        ${this.getSovIFramesData(selfTester)}
        ${this.generateConsumerDataReport(selfTester)}
        `;
        }
        return innerOverlay;
    }
    generateConsumerDataReport(testresult) {
        return `
        <div class="sovendus-overlay-font">
          <h2 class="sovendus-overlay-font sovendus-overlay-h2">Customer Data:</h2>
          <ul class="sovendus-overlay-font sovendus-overlay-ul">
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerSalutation: ${testresult.consumerSalutation.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerFirstName: ${testresult.consumerFirstName.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerLastName: ${testresult.consumerLastName.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerYearOfBirth: ${testresult.consumerYearOfBirth.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerEmail: ${testresult.consumerEmail.statusMessage}
            </li>
            ${testresult.consumerEmailHash.statusMessage &&
            testresult.consumerEmailHash.statusMessage}            
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerPhone: ${testresult.consumerPhone.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerStreet: ${testresult.consumerStreet.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerStreetNumber: ${testresult.consumerStreetNumber.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerZipcode: ${testresult.consumerZipcode.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerCity: ${testresult.consumerCity.statusMessage}
            </li>
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              consumerCountry: ${testresult.consumerCountry.statusMessage}
            </li>
          </ul>
        </div>
    `;
    }
    getSovIFramesData(testresult) {
        return `
      <div>
        ${testresult.flexibleiframeOnDOM.statusMessage}
        <h2 class="sovendus-overlay-font sovendus-overlay-h2">Sovendus Partner Numbers:</h2>
        <ul class="sovendus-overlay-font sovendus-overlay-ul">
          <li class'sovendus-overlay-font sovendus-overlay-text'>
            trafficSourceNumber: ${testresult.trafficSourceNumber.statusMessage}
          </li>
          <li class'sovendus-overlay-font sovendus-overlay-text'>
            trafficMediumNumber: ${testresult.trafficMediumNumber.statusMessage}
          </li>
        </ul>
        <h2 class="sovendus-overlay-font sovendus-overlay-h2">Sovendus Container:</h2>
        <ul class="sovendus-overlay-font sovendus-overlay-ul">
            <li class'sovendus-overlay-font sovendus-overlay-text'>
              iframeContainerId: ${testresult.iframeContainerId.statusMessage}
            </li>
            ${testresult.isEnabledInBackend.statusMessage}
            ${testresult.sovendusDivFound.statusMessage}
            ${testresult.multipleIframesAreSame.statusMessage}
        </ul>
        <h2 class="sovendus-overlay-font sovendus-overlay-h2">Order Data:</h2>
        <ul class="sovendus-overlay-font sovendus-overlay-ul">
          <li class'sovendus-overlay-font sovendus-overlay-text'>
            orderCurrency: ${testresult.orderCurrency.statusMessage}
          </li>
          <li class'sovendus-overlay-font sovendus-overlay-text'>
            orderId: ${testresult.orderId.statusMessage}
          </li>
          <li class'sovendus-overlay-font sovendus-overlay-text'>
            orderValue: ${testresult.orderValue.statusMessage}
          </li>
          <li class'sovendus-overlay-font sovendus-overlay-text'>
            sessionId: ${testresult.sessionId.statusMessage}
          </li>
          <li class'sovendus-overlay-font sovendus-overlay-text'>
            timestamp: ${testresult.timestamp.statusMessage}
          </li>
          <li class'sovendus-overlay-font sovendus-overlay-text'>
            usedCouponCode: ${testresult.usedCouponCode.statusMessage}
          </li>
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
          #toggleSovendusOverlay {
            position: fixed !important;
            left: calc(50% - 10px) !important;
            right: calc(50% - 10px) !important;
            top: 20px !important;
            background: #293049 !important;
            color: #fff !important;
            width: 62px !important;
            padding: 9px !important;
            z-index: 2147483647 !important;
            font-size: 16px !important;
            border-radius: 8px !important;
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
            }
            else {
                overlay.style.display = "none";
                toggle.innerText = "Show";
            }
        }
    }
    showInfoText(event) {
        const label = event.currentTarget.firstElementChild
            .firstElementChild;
        if (label) {
            label.style.display = "block";
        }
    }
    hideInfoText(event) {
        const label = event.currentTarget.firstElementChild
            .firstElementChild;
        if (label) {
            label.style.display = "none";
        }
    }
}
