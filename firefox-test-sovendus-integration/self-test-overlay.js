(async () => {
  await waitForSovendusIntegrationDetected();
  createOverlay();
})();

function getSovConsumerData(consumer) {
  return `
    <div class="sovendus-overlay-font">
      <h2 class="sovendus-overlay-font sovendus-overlay-h2">Customer Data:</h2>
      <ul class="sovendus-overlay-font sovendus-overlay-ul">
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          consumerSalutation: ${returnValueIfValidOrError(
            consumer.salutation || consumer.consumerSalutation
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          consumerFirstName: ${returnValueIfValidOrError(
            consumer.firstName || consumer.consumerFirstName
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          consumerLastName: ${returnValueIfValidOrError(
            consumer.lastName || consumer.consumerLastName
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          consumerYearOfBirth: ${returnValueIfValidOrError(
            consumer.yearOfBirth || consumer.consumerYearOfBirth
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          consumerEmail: ${returnValueIfValidOrError(
            consumer.email || consumer.consumerEmail
          )}
        </li>
        ${
          returnValueIfValidOrError(
            consumer.email || consumer.consumerEmail,
            true
          )
            ? ""
            : returnValueIfValidOrError(
                consumer.emailHash || consumer.consumerEmailHash,
                true
              )
            ? "<li class'sovendus-overlay-font sovendus-overlay-text'>consumerEmailHash: " +
                consumer.emailHash || consumer.consumerEmailHash + "</li>"
            : ""
        }            
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          consumerStreet: ${returnValueIfValidOrError(
            consumer.street || consumer.consumerStreet
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          consumerStreetNumber: ${returnValueIfValidOrError(
            consumer.streetNumber || consumer.consumerStreetNumber
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          consumerZipcode: ${returnValueIfValidOrError(
            consumer.zipCode || consumer.consumerZipcode
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          consumerCity: ${returnValueIfValidOrError(
            consumer.city || consumer.consumerCity
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          consumerCountry: ${returnValueIfValidOrError(
            consumer.country || consumer.consumerCountry
          )}
        </li>
      </ul>
    </div>
  `;
}

function getSovIFramesData(
  sovendusDivFound,
  sovDivIdInIframes,
  multipleSovIframesDetected,
  sovIframesAmount,
  isEnabledInBackend,
  wasExecuted
) {
  return `
    <div>
      <h2 class="sovendus-overlay-font sovendus-overlay-h2">Sovendus Partner Numbers:</h2>
      <ul class="sovendus-overlay-font sovendus-overlay-ul">
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          trafficSourceNumber: ${returnValueIfValidOrError(
            window.sovIframes[0].trafficSourceNumber
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          trafficMediumNumber: ${returnValueIfValidOrError(
            window.sovIframes[0].trafficMediumNumber
          )}
        </li>
      </ul>
      <h2 class="sovendus-overlay-font sovendus-overlay-h2">Sovendus Container:</h2>
      <ul class="sovendus-overlay-font sovendus-overlay-ul">
          <li class'sovendus-overlay-font sovendus-overlay-text'>
            iframeContainerId: ${returnValueIfValidOrError(
              window.sovIframes[0].iframeContainerId
            )}
          </li>
          ${
            isEnabledInBackend
              ? ""
              : wasExecuted
              ? "<h3 class='sovendus-overlay-error'>ERROR: Seems like the Sovendus banner is disabled in the Sovendus backend. Please contact your account manager to fix this issue.</h3>"
              : ""
          }
          ${
            sovendusDivFound
              ? ""
              : sovDivIdInIframes
              ? '<h3 class="sovendus-overlay-error">ERROR: The sovendus container div with the id "' +
                window.sovIframes[0].iframeContainerId +
                '" was not found on the DOM! Make sure to add the div to the DOM before the Sovendus integration script gets executed.</h2>'
              : "<h3 class='sovendus-overlay-error'>ERROR: There was no iframeContainerId specified in sovIframes. Make sure to define it and also make sure the div with this id exists on the DOM.</h3>"
          }
          ${
            multipleSovIframesDetected
              ? "<h3 class='sovendus-overlay-error'>ERROR: sovIframes was found " +
                sovIframesAmount +
                " times. This is probably due to Sovendus being executed multiple times or Sovendus was integrated multiple times.</h3>"
              : ""
          }
      </ul>
      <h2 class="sovendus-overlay-font sovendus-overlay-h2">Order Data:</h2>
      <ul class="sovendus-overlay-font sovendus-overlay-ul">
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          orderCurrency: ${returnValueIfValidOrError(
            window.sovIframes[0].orderCurrency
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          orderId: ${returnValueIfValidOrError(window.sovIframes[0].orderId)}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          orderValue: ${returnValueIfValidNumberOrError(
            window.sovIframes[0].orderValue
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          sessionId: ${returnValueIfValidOrError(
            window.sovIframes[0].sessionId
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          timestamp: ${returnValueIfValidUnixtimeOrError(
            window.sovIframes[0].timestamp
          )}
        </li>
        <li class'sovendus-overlay-font sovendus-overlay-text'>
          usedCouponCode: ${returnValueIfValidOrError(
            window.sovIframes[0].usedCouponCode
          )}
        </li>
      </ul>
    </div>`;
}

function toggleOverlay() {
  var overlay = document.getElementById("sovendusOverlay");
  var toggle = document.getElementById("toggleSovendusOverlay");
  if (overlay.style.display === "none") {
    overlay.style.display = "block";
    toggle.innerText = "Hide";
  } else {
    overlay.style.display = "none";
    toggle.innerText = "Show";
  }
}

const dataIsMissingWarning =
  "<span class='sovendus-overlay-error' >DATA MISSING</span>";
function returnValueIfValidOrError(value, returnFalseIfEmpty) {
  if (value && value !== "undefined") {
    return decodeURIComponent(decodeURI(value));
  }
  if (returnFalseIfEmpty) {
    return false;
  }
  return dataIsMissingWarning;
}

function returnValueIfValidNumberOrError(value) {
  const decodedValue = returnValueIfValidOrError(value, true);
  if (decodedValue) {
    return isNaN(Number(decodedValue))
      ? `<span class='sovendus-overlay-error' >${decodedValue} IS NOT A NUMBER</span>`
      : decodedValue;
  }
  return dataIsMissingWarning;
}

function returnValueIfValidUnixtimeOrError(value) {
  const decodedValue = returnValueIfValidOrError(value, true);
  if (decodedValue) {
    const truncatedTime = Math.floor(decodedValue);

    return !isNaN(truncatedTime) &&
      [13, 10].includes(truncatedTime.toString().length)
      ? decodedValue
      : `<span class='sovendus-overlay-error' >${decodedValue} IS NOT A UNIXTIME</span>`;
  }
  return dataIsMissingWarning;
}

async function waitForSovendusIntegrationDetected() {
  console.log("No Sovendus integration detected yet");
  while (!window.hasOwnProperty("sovIframes")) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  await waitForSovApplicationObject();
}

async function waitForSovApplicationObject() {
  let waitedSeconds = 0;
  while (!sovApplicationExists() && waitedSeconds < 5) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    waitedSeconds += 0.5;
  }
  console.log("Sovendus has been detected");
  if (sovApplicationExists()) {
    await waitForBannerToBeLoaded();
  }
}

function sovApplicationExists() {
  return (
    window.hasOwnProperty("sovApplication") &&
    window.sovApplication.hasOwnProperty("consumer")
  );
}

function sovInstancesLoaded() {
  return (
    window.sovApplication.hasOwnProperty("instances") &&
    window.sovApplication.instances.length &&
    window.sovApplication.instances[0].banner &&
    window.sovApplication.instances[0].selectBanner
  );
}

async function waitForBannerToBeLoaded() {
  let waitedSeconds = 0;
  while (!sovInstancesLoaded() && waitedSeconds < 4) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    waitedSeconds += 0.5;
  }
  console.log("Sovendus banner loaded");
}

function getSovendusSelfTestData() {
  const sovDivIdInIframes = Boolean(window.sovIframes[0].iframeContainerId);
  const sovendusDivFound =
    sovDivIdInIframes &&
    document.getElementById(window.sovIframes[0].iframeContainerId)
      ? true
      : false;
  const sovIframesAmount = window.sovIframes.length;
  const multipleSovIframesDetected = sovIframesAmount > 1;
  const wasExecuted =
    window.hasOwnProperty("sovApplication") && sovApplication.instances.length;
  const isEnabledInBackend = checkIfEnabledInBackend(wasExecuted);
  return {
    sovendusDivFound,
    sovDivIdInIframes,
    multipleSovIframesDetected,
    sovIframesAmount,
    wasExecuted,
    isEnabledInBackend,
  };
}

function checkIfEnabledInBackend(wasExecuted) {
  return (
    wasExecuted &&
    sovApplication.instances.some(
      (instance) =>
        Object.keys(instance.config?.overlay || {}).length > 0 ||
        Object.keys(instance.config?.stickyBanner || {}).length > 0 ||
        instance?.banner?.bannerExists
    )
  );
}

function getOverlayStyle() {
  return `
    <style>
      #sovendusOverlay {
        position: fixed;
        left: calc(50% - 250px);
        right: calc(50% - 250px);
        width: 500px;
        top: 50px;
        border: solid;
        padding: 22px;
        background: #293049;
        z-index: 2147483647;
        overflow-y: auto;
        max-height: calc(100vh - 100px);
      }
      #sovendusOverlay.fullscreen {
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        max-height: 100vh;
      }
      @media only screen and (max-width: 700px) {
        #sovendusOverlay {
          left: 0;
          right: 0;
          width: 500px;
          max-width: 500px;
          top: 50px;
          padding: 22px;
         
        }
      }
      .sovendus-overlay-font {
        color: white !important;
        font-family: Arial, Helvetica, sans-serif !important;
      }
      .sovendus-overlay-error {
        color: red !important;
        font-size: 17px !important;
        margin: 5px 0 !important;
      }
      .sovendus-overlay-h1 {
        font-size: 27px !important;
        margin-top: 0 !important;
        margin-bottom: 5px !important;
      }
      .sovendus-overlay-h2 {
        font-size: 20px !important;
        margin-top: 4px !important;
        margin-bottom: 4px !important;
      }
      .sovendus-overlay-text {
        font-size: 15px !important;
      }
      .sovendus-overlay-ul {
        margin-left: 5px !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
      #toggleSovendusOverlay {
        position: fixed;
        left: calc(50% - 10px);
        right: calc(50% - 10px);
        top: 15px;
        background: #293049;
        width: 58px;
        padding: 9px;
        z-index: 2147483647;
        font-size: 15px;
      }
    </style>
  `;
}

function createOverlay() {
  const innerOverlay = createInnerOverlay();
  var overlay = document.createElement("div");
  overlay.id = "outerSovendusOverlay";
  overlay.innerHTML = `
    ${getOverlayStyle()}
    <button class="sovendus-overlay-font" id="toggleSovendusOverlay" onclick="toggleOverlay()">
      Hide
    </button>
    <div class="sovendus-overlay-font" id="sovendusOverlay">  
      <div style="margin:auto;max-width:500px;">
        <div>
          <h1 class="sovendus-overlay-font sovendus-overlay-h1">Sovendus Selftest Overlay</h1>
        </div>
        ${innerOverlay}
      </div>
    </div>
  `;
  document.getElementsByTagName("body")[0].appendChild(overlay);
}

function createInnerOverlay() {
  const {
    sovendusDivFound,
    sovDivIdInIframes,
    multipleSovIframesDetected,
    sovIframesAmount,
    wasExecuted,
    isEnabledInBackend,
  } = getSovendusSelfTestData();
  let innerOverlay = "";
  if (wasExecuted) {
    console.log("Sovendus was executed");
    innerOverlay = `
        ${getSovIFramesData(
          sovendusDivFound,
          sovDivIdInIframes,
          multipleSovIframesDetected,
          sovIframesAmount,
          isEnabledInBackend,
          wasExecuted
        )}
        ${getSovConsumerData(window.sovApplication.consumer)}
    `;
  } else {
    console.log("Sovendus was detected but not executed");
    const errorMessage = getFlexibleIframeErrorMessage();
    innerOverlay = `
      <h2 class="sovendus-overlay-font sovendus-overlay-h2" style="color:red !important;">Error: ${errorMessage}</h2>
      ${getSovIFramesData(
        sovendusDivFound,
        sovDivIdInIframes,
        multipleSovIframesDetected,
        sovIframesAmount,
        isEnabledInBackend,
        wasExecuted
      )}
      ${getSovConsumerData(window.sovConsumer || {})}
      `;
  }
  return innerOverlay;
}

function getFlexibleIframeErrorMessage() {
  const flexibleiframeOnDOM = Boolean(
    document.querySelector(
      '[src$="api.sovendus.com/sovabo/common/js/flexibleIframe.js"]'
    )
  );
  const errorMessage = flexibleiframeOnDOM
    ? "Sovendus was detected but flexibleiframe.js was probalby placed on the DOM / executed before the Sovendus integration script. Make sure the flexibleiframe.js gets placed on the DOM / executed after the the Sovendus integration script."
    : "Sovendus was detected but flexibleiframe.js was not found on the DOM. Make sure to place the flexibleiframe.js on the DOM after the Sovendus Integration Script.";

  return errorMessage;
}
