class TestResult {
  elementValue: ElementValue;
  statusCode: StatusCode;
  statusMessage: StatusMessage;
  constructor(
    elementValue: ElementValue = undefined,
    statusMessage: StatusMessage = undefined,
    statusCode: StatusCode
  ) {
    this.elementValue = elementValue;
    this.statusCode = statusCode;
    this.statusMessage = statusMessage || "";
  }
}

export default class SelfTester {
  integrationType?: string;
  consumerSalutation?: TestResult;
  consumerFirstName?: TestResult;
  consumerLastName?: TestResult;
  consumerYearOfBirth?: TestResult;
  consumerEmail?: TestResult;
  consumerEmailHash?: TestResult;
  consumerStreet?: TestResult;
  consumerStreetNumber?: TestResult;
  consumerZipCode?: TestResult;
  consumerPhone?: TestResult;
  consumerCity?: TestResult;
  consumerCountry?: TestResult;
  trafficSourceNumber?: TestResult;
  trafficMediumNumber?: TestResult;
  iframeContainerId?: TestResult;
  isEnabledInBackend?: TestResult;
  wasExecuted?: TestResult;
  awinTest?: TestResult;
  sovendusDivFound?: TestResult;
  sovDivIdInIFrames?: TestResult;
  multipleSovIFramesDetected?: TestResult;
  sovIFramesAmount?: TestResult;
  multipleIFramesAreSame?: TestResult;
  orderCurrency?: TestResult;
  orderId?: TestResult;
  orderValue?: TestResult;
  sessionId?: TestResult;
  timestamp?: TestResult;
  usedCouponCode?: TestResult;
  flexibleIFrameOnDOM?: TestResult;

  sovConsumer?: SovApplicationConsumer;

  async selfTestIntegration() {
    this.integrationType = this.getIntegrationType();
    this.trafficSourceNumber = this.getTrafficSourceNumberTestResult();
    this.trafficMediumNumber = this.getTrafficMediumNumberTestResult();
    this.wasExecuted = this.getWasExecutedTestResult(
      this.trafficSourceNumber,
      this.trafficMediumNumber
    );
    if (this.wasExecuted) {
      console.log("Sovendus was executed");
      this.sovConsumer = window.sovApplication?.consumer || {};
    } else {
      console.log("Sovendus was detected but not executed");
      this.sovConsumer = convertToSovApplicationConsumer(
        window.sovConsumer || {}
      );
    }
    if (
      this.wasExecuted.statusCode === StatusCodes.Error &&
      this.awinIntegrationDetected()
    ) {
      this.awinTest = this.getAwinNotExecutedTestResult();
    } else {
      this.consumerSalutation = this.getConsumerSalutationTestResult(
        this.sovConsumer
      );
      this.consumerFirstName = this.getConsumerFirstNameTestResult(
        this.sovConsumer
      );
      this.consumerLastName = this.getConsumerLastNameTestResult(
        this.sovConsumer
      );
      this.consumerYearOfBirth = this.getConsumerYearOfBirthTestResult(
        this.sovConsumer
      );
      this.consumerEmail = this.getConsumerEmailTestResult(this.sovConsumer);
      this.consumerEmailHash = this.getConsumerEmailHashTestResult(
        this.sovConsumer,
        this.consumerEmail
      );
      this.consumerStreet = this.getConsumerStreetTestResult(this.sovConsumer);
      this.consumerStreetNumber = this.getConsumerStreetNumberTestResult(
        this.sovConsumer
      );
      this.consumerZipCode = this.getConsumerZipCodeTestResult(
        this.sovConsumer
      );
      this.consumerPhone = this.getConsumerPhoneTestResult(this.sovConsumer);
      this.consumerCity = this.getConsumerCityTestResult(this.sovConsumer);
      this.consumerCountry = this.getConsumerCountryTestResult(
        this.sovConsumer
      );
      this.iframeContainerId = this.getIframeContainerIdTestResult();
      this.isEnabledInBackend = this.getIsEnabledInBackendTestResult(
        this.wasExecuted
      );
      this.sovIFramesAmount = this.getSovIFramesAmountTestResult();
      this.sovDivIdInIFrames = this.getSovDivIdInIFramesTestResult(
        this.sovIFramesAmount
      );
      this.sovendusDivFound = this.getSovendusDivFoundTestResult(
        this.sovDivIdInIFrames,
        this.iframeContainerId
      );
      this.multipleSovIFramesDetected =
        this.getMultipleSovIFamesDetectedTestResult(this.sovIFramesAmount);
      this.multipleIFramesAreSame = this.getMultipleIFramesAreSameTestResult(
        this.multipleSovIFramesDetected,
        this.sovIFramesAmount
      );
      this.executeOrderDataTests();
      this.flexibleIFrameOnDOM = this.getIsFlexibleIFrameOnDOM(
        this.wasExecuted,
        this.trafficSourceNumber,
        this.trafficMediumNumber
      );
    }
  }

  executeOrderDataTests(): void {
    this.orderCurrency = this.getOrderCurrencyTestResult();
    this.orderId = this.getOrderIdTestResult();
    this.orderValue = this.getOrderValueTestResult();
    this.sessionId = this.getSessionIdTestResult();
    this.timestamp = this.getTimestampTestResult();
    this.usedCouponCode = this.getUsedCouponCodeTestResult();
  }

  getIntegrationType(): string {
    return (
      window.sovIframes?.[0]?.integrationType ||
      (this.awinIntegrationDetected()
        ? `Awin (Merchant ID: ${this.getAwinMerchantId()})`
        : "unknown")
    );
  }

  getAwinNotExecutedTestResult(): TestResult {
    this.executeOrderDataTests();

    const statusCode: StatusCode = StatusCodes.Error;
    let statusMessage: StatusMessage = undefined;
    if (this.awinSaleTracked()) {
      statusMessage = `
          <h3 class='sovendus-overlay-error'>
            ERROR: Awin integration detected and a sale has been tracked, but for an unknown reason Sovendus hasn't been executed. 
            A potential cause for the issue could be that the sale has been tracked after the www.dwin1.com/XXXX.js script got executed.
            <a href="https://wiki.awin.com/index.php/Advertiser_Tracking_Guide/Standard_Implementation#Conversion_Tag" target="_blank">
              How to set up sales tracking with Awin?
            </a>  
          </h3>`;
    } else {
      statusMessage = `
          <h3 class='sovendus-overlay-h3 sovendus-overlay-error'>
            ERROR: No Sale tracked yet
          </h3>
          <h2 class='sovendus-overlay-h2 sovendus-overlay-error'>It's normal if this isn't the order success page!</h2>
          <h3 class='sovendus-overlay-font sovendus-overlay-h3'>
            If this happens on the order success page, make sure you've implemented Awin sales tracking properly, as no sale was tracked.
            <a href="https://wiki.awin.com/index.php/Advertiser_Tracking_Guide/Standard_Implementation#Conversion_Tag" target="_blank">
              How to set up sales tracking with Awin?
            </a>  
          </h3>`;
    }

    const elementValue: ElementValue = false;

    this.trafficSourceNumber = new TestResult(
      window.AWIN?.Tracking?.Sovendus?.trafficSourceNumber,
      window.AWIN?.Tracking?.Sovendus?.trafficSourceNumber +
        this.getInfoMarkWithLabel(trafficSourceInfoMessage),
      StatusCodes.Success
    );
    this.trafficMediumNumber = new TestResult(
      window.AWIN?.Tracking?.Sovendus?.trafficMediumNumber,
      window.AWIN?.Tracking?.Sovendus?.trafficMediumNumber +
        this.getInfoMarkWithLabel(trafficMediumInfoMessage),
      StatusCodes.Success
    );

    return new TestResult(elementValue, statusMessage, statusCode);
  }
  getConsumerSalutationTestResult(
    consumer: SovApplicationConsumer
  ): TestResult {
    const missingSalutationError =
      "Make sure to pass the salutation of the customer, valid are Mrs. and Mr.";
    const valueTestResult: TestResult = this.validValueTestResult(
      consumer.salutation || window.sovConsumer?.consumerSalutation,
      missingSalutationError
    );
    if (valueTestResult.statusCode === StatusCodes.Success) {
      const validSalutations = ["Mr.", "Mrs."];
      let statusCode: StatusCode = StatusCodes.Success;
      let statusMessage: StatusMessage =
        String(valueTestResult.elementValue) + this.getCheckMarkWithLabel();
      if (!validSalutations.includes(String(valueTestResult.elementValue))) {
        statusCode = StatusCodes.Error;
        statusMessage = `<span class='sovendus-overlay-error' >${
          valueTestResult.elementValue
        } ISN'T A VALID SALUTATION${this.getInfoMarkWithLabel(
          missingSalutationError
        )}</span>`;
      }
      return new TestResult(
        valueTestResult.elementValue,
        statusMessage,
        statusCode
      );
    }
    return valueTestResult;
  }

  getConsumerFirstNameTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.firstName,
      "Make sure to pass the customers first name.",
      "Make sure this value aligns with the customers first name"
    );
  }

  getConsumerLastNameTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.lastName,
      "Make sure to pass the customers last name.",
      "Make sure this value aligns with the customers last name"
    );
  }

  getConsumerYearOfBirthTestResult(
    consumer: SovApplicationConsumer
  ): TestResult {
    const missingMailError: string =
      "Make sure to pass the year of birth of the customer, e.g. 1991";
    const yearOfBirthTestResult: TestResult = this.validValueTestResult(
      consumer.yearOfBirth || window.sovConsumer?.consumerYearOfBirth,
      missingMailError
    );
    if (yearOfBirthTestResult.statusCode === StatusCodes.Success) {
      const validFromYear: number = 1890;
      const validToYear: number = 2024;
      let statusCode: StatusCode = StatusCodes.Success;
      let statusMessage: StatusMessage =
        String(yearOfBirthTestResult.elementValue) +
        this.getCheckMarkWithLabel();
      const yearOfBirthNumber: number = Number(
        yearOfBirthTestResult.elementValue
      );
      if (
        !(yearOfBirthNumber < validToYear && yearOfBirthNumber > validFromYear)
      ) {
        statusCode = StatusCodes.Error;
        statusMessage = `<span class='sovendus-overlay-error' >${
          yearOfBirthTestResult.elementValue
        } ISN'T A VALID BIRTH YEAR${this.getInfoMarkWithLabel(
          missingMailError
        )}</span>`;
      }
      return new TestResult(
        yearOfBirthTestResult.elementValue,
        statusMessage,
        statusCode
      );
    }
    return yearOfBirthTestResult;
  }

  getConsumerEmailTestResult(consumer: SovApplicationConsumer): TestResult {
    const missingEmailError =
      "Make sure to pass the email address of the customer.";
    const emailTestResult: TestResult = this.validValueTestResult(
      consumer.email,
      missingEmailError
    );
    if (emailTestResult.statusCode === StatusCodes.Success) {
      function validateEmail(email: string) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      }
      const mailIsValid = validateEmail(String(emailTestResult.elementValue));
      let statusCode: StatusCode = StatusCodes.Success;
      let elementValue: ElementValue = emailTestResult.elementValue;
      let statusMessage: StatusMessage =
        String(emailTestResult.elementValue) + this.getCheckMarkWithLabel();
      if (!mailIsValid) {
        statusCode = StatusCodes.Error;
        statusMessage = `<span class='sovendus-overlay-error' >${
          emailTestResult.elementValue
        } ISN'T A VALID EMAIL${this.getInfoMarkWithLabel(
          missingEmailError
        )}</span>`;
      }
      return new TestResult(elementValue, statusMessage, statusCode);
    }
    return emailTestResult;
  }

  getConsumerEmailHashTestResult(
    consumer: SovApplicationConsumer,
    consumerEmail: TestResult
  ): TestResult {
    let statusCode: StatusCode = StatusCodes.Success;
    let elementValue: ElementValue = undefined;
    let statusMessage: StatusMessage = undefined;
    if (!consumerEmail.elementValue) {
      const testResult = this.validValueTestResult(
        consumer.emailHash,
        "Make sure either a valid email or a md5 hashed email is provided. Note that hashed email support must be enabled by Sovendus."
      );
      statusCode = testResult.statusCode;
      elementValue = testResult.elementValue;
      if (testResult.statusCode === 0) {
        const hashIsValid = this.checkIfValidMd5Hash(
          String(testResult.elementValue)
        );
        if (hashIsValid) {
          statusMessage =
            "<li class='sovendus-overlay-font sovendus-overlay-text'>consumerEmailHash: " +
            testResult.elementValue +
            this.getCheckMarkWithLabel() +
            "</li>";
        } else {
          statusCode = StatusCodes.Error;
          statusMessage =
            "<li class='sovendus-overlay-font sovendus-overlay-text'>consumerEmailHash: " +
            testResult.elementValue +
            "<span class='sovendus-overlay-error' >NOT A MD5 HASH" +
            this.getInfoMarkWithLabel(
              "The value is not a valid MD5 hash, make sure the email is properly encoded."
            ) +
            "</span>";
          ("</li>");
        }
      } else if (testResult.statusCode === 2) {
        statusMessage =
          "<li class='sovendus-overlay-font sovendus-overlay-text'>consumerEmailHash: " +
          testResult.statusMessage +
          "</li>";
      }
    }
    return new TestResult(elementValue, statusMessage, statusCode);
  }

  checkIfValidMd5Hash(emailHash: string): boolean {
    const regexExp = /^[a-f0-9]{32}$/gi;
    return regexExp.test(emailHash);
  }

  getConsumerStreetTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.street,
      "Make sure to pass the street name of the delivery address.",
      "Make sure this value aligns with the delivery address street name."
    );
  }

  getConsumerStreetNumberTestResult(
    consumer: SovApplicationConsumer
  ): TestResult {
    return this.validValueTestResult(
      consumer.streetNumber,
      "Make sure to pass the street number from the delivery address.",
      "Make sure this value aligns with the delivery address street number."
    );
  }

  getConsumerZipCodeTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.zipCode,
      "Make sure to pass the zip code of the delivery address.",
      "Make sure this value aligns with the delivery address zip code."
    );
  }

  getConsumerPhoneTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.phone,
      "Make sure to pass the phone number of the customer.",
      "Make sure this value aligns with the customers phone number."
    );
  }

  getConsumerCityTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.city,
      "Make sure to pass the city of the delivery address.",
      "Make sure this value aligns with the delivery address city."
    );
  }

  getConsumerCountryTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.country,
      "Make sure to pass the country id of the delivery address."
    );
  }

  getTrafficSourceNumberTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.trafficSourceNumber,
      "Make sure to pass the traffic source number you've received in your integration docs.",
      trafficSourceInfoMessage
    );
  }

  getTrafficMediumNumberTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.trafficMediumNumber,
      "Make sure to pass the traffic medium number you've received in your integration docs.",
      trafficMediumInfoMessage
    );
  }

  getIframeContainerIdTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.iframeContainerId,
      "Make sure to pass a iframe container id, this id corresponds to a div with this id on the DOM."
    );
  }

  getIsFlexibleIFrameOnDOM(
    wasExecuted: TestResult,
    trafficSourceNumber: TestResult,
    trafficMediumNumber: TestResult
  ) {
    const flexibleIframeJs: HTMLScriptElement | null = document.querySelector(
      '[src$="api.sovendus.com/sovabo/common/js/flexibleIframe.js"]'
    );
    let errorMessage: StatusMessage = "";
    let statusCode: StatusCode = StatusCodes.Success;
    let isSuccess: boolean = true;
    if (
      wasExecuted.statusCode === StatusCodes.Error &&
      trafficSourceNumber.statusCode === StatusCodes.Success &&
      trafficMediumNumber.statusCode === StatusCodes.Success
    ) {
      let innerErrorMessage: string = "";
      statusCode = StatusCodes.Error;
      isSuccess = false;
      const isOnDom = !!flexibleIframeJs;
      if (isOnDom) {
        innerErrorMessage =
          this.getFlexileIframeDidNotExecuteErrorMessage(flexibleIframeJs);
      } else {
        innerErrorMessage =
          "Sovendus was detected but flexibleiframe.js was not found on the DOM. Make sure to place the flexibleiframe.js on the DOM after the Sovendus Integration Script.";
      }
      errorMessage = `<h2 class="sovendus-overlay-font sovendus-overlay-h2" style="color:red !important;">Error: ${innerErrorMessage}</h2>`;
    }
    return new TestResult(isSuccess, errorMessage, statusCode);
  }

  getFlexileIframeDidNotExecuteErrorMessage(
    flexibleIframeJs: HTMLScriptElement
  ): string {
    let innerErrorMessage: string = "";
    if (this.checkIfFlexibleIframeIsExecutable(flexibleIframeJs)) {
      const sovendusJs: HTMLScriptElement = document.getElementById(
        "sovloader-script"
      ) as HTMLScriptElement;
      if (sovendusJs) {
        if (sovendusJs.type === "text/javascript" || sovendusJs.type === null) {
          innerErrorMessage =
            "Sovendus was detected and flexibleiframe.js was executed. For an unknown reason the integration script didn't run successfully tho.";
        } else {
          innerErrorMessage = `Sovendus was detected and flexibleiframe.js was executed. But the sovendus.js script, which gets placed by the flexibleiframe.js script, got blocked most likely because of your cookie consent tool. The type of the sovendus.js script should not be set, but is "${sovendusJs.type}" instead.`;
        }
      } else {
        innerErrorMessage =
          "Sovendus was detected but flexibleiframe.js was not executed. This is probably because the flexibleiframe.js script got placed on the DOM / executed before the Sovendus integration script. Make sure the flexibleiframe.js gets placed on the DOM / executed after the the Sovendus integration script.";
      }
    } else {
      innerErrorMessage = `Sovendus was detected but flexibleiframe.js was not executed because the script type is "${flexibleIframeJs.type}" instead of "text/javascript". This probably happened because your cookie consent tool blocked the script.`;
    }
    return innerErrorMessage;
  }

  checkIfFlexibleIframeIsExecutable(
    flexibleIframeJs: HTMLScriptElement
  ): boolean {
    return flexibleIframeJs.type === "text/javascript";
  }

  getWasExecutedTestResult(
    trafficSourceNumber: TestResult,
    trafficMediumNumber: TestResult
  ): TestResult {
    const wasExecuted =
      trafficSourceNumber.elementValue &&
      trafficMediumNumber.elementValue &&
      window.hasOwnProperty("sovApplication") &&
      window.sovApplication?.instances?.length;
    return new TestResult(
      wasExecuted,
      undefined,
      wasExecuted ? StatusCodes.Success : StatusCodes.Error
    );
  }

  getIsEnabledInBackendTestResult(wasExecuted: TestResult): TestResult {
    let statusCode: StatusCode = StatusCodes.TestDidNotRun;
    let isEnabled: boolean | undefined = undefined;
    let statusMessage: StatusMessage = undefined;
    if (wasExecuted.statusCode === StatusCodes.Success) {
      isEnabled = window.sovApplication?.instances?.some(
        (instance) =>
          Object.keys(instance.config?.overlay || {}).length > 0 ||
          Object.keys(instance.config?.stickyBanner || {}).length > 0 ||
          instance?.banner?.bannerExists
      );
      if (isEnabled) {
        statusCode = StatusCodes.Success;
      } else {
        statusCode = StatusCodes.Error;
        statusMessage =
          "<h3 class='sovendus-overlay-error'>ERROR: Seems like the Sovendus banner is disabled in the Sovendus backend, or doesn't exist at all. Please contact your account manager to check if you're using the right traffic source and medium numbers and check if the banner is configured properly.</h3>";
      }
    }
    return new TestResult(isEnabled, statusMessage, statusCode);
  }

  getSovDivIdInIFramesTestResult(sovIFramesAmount: TestResult): TestResult {
    const elementValue: boolean = Boolean(
      window.sovIframes?.[0]?.iframeContainerId
    );
    let statusMessage: StatusMessage = undefined;
    let statusCode: StatusCode = StatusCodes.Success;
    if ((elementValue && sovIFramesAmount.elementValue) || 0 > 0) {
      statusCode = StatusCodes.Error;
      statusMessage =
        "<h3 class='sovendus-overlay-error'>ERROR: There was no iframeContainerId specified in sovIframes. Make sure to define it and also make sure the div with this id exists on the DOM.</h3>";
    }
    return new TestResult(elementValue, statusMessage, statusCode);
  }

  getSovendusDivFoundTestResult(
    sovDivIdInIframes: TestResult,
    iframeContainerId: TestResult
  ): TestResult {
    let statusMessage: StatusMessage = undefined;
    let statusCode: StatusCode = StatusCodes.Success;
    let sovendusDivFound: boolean = false;
    if (sovDivIdInIframes.elementValue) {
      sovendusDivFound =
        sovDivIdInIframes &&
        Boolean(
          typeof iframeContainerId.elementValue === "string" &&
            document.getElementById(iframeContainerId.elementValue)
        );
      if (!sovendusDivFound) {
        statusMessage =
          '<li><h3 class="sovendus-overlay-error">ERROR: The sovendus container div with the id "' +
          iframeContainerId.elementValue +
          '" was not found on the DOM! Make sure to add the div to the DOM before the Sovendus integration script gets executed. If the container is missing, you wont see any inline banners on the page, only overlays. On SPA (like react, angular, etc.) this will also have the effect that the banner is not disappearing after leaving the success page.</h2></li>';
      }
    }
    return new TestResult(sovendusDivFound, statusMessage, statusCode);
  }

  getMultipleSovIFamesDetectedTestResult(
    sovIframesAmount: TestResult
  ): TestResult {
    const multipleSovIframesDetected =
      Number(sovIframesAmount.elementValue) > 1;
    return new TestResult(
      multipleSovIframesDetected,
      undefined,
      multipleSovIframesDetected ? StatusCodes.Error : StatusCodes.Success
    );
  }

  getSovIFramesAmountTestResult(): TestResult {
    const sovIframesAmount = window.sovIframes?.length;
    return new TestResult(
      sovIframesAmount,
      undefined,
      sovIframesAmount === 1 ? StatusCodes.Success : StatusCodes.Error
    );
  }

  getMultipleIFramesAreSameTestResult(
    multipleSovIframesDetected: TestResult,
    sovIframesAmount: TestResult
  ): TestResult {
    let multipleIframesAreSame = true;
    if (multipleSovIframesDetected.elementValue) {
      let prevSovIframe: SovIframes | undefined = undefined;
      multipleIframesAreSame = Boolean(
        window.sovIframes?.every((sovIframe) => {
          let isTheSame = true;
          if (prevSovIframe) {
            isTheSame =
              sovIframe.trafficSourceNumber ===
                prevSovIframe.trafficSourceNumber &&
              sovIframe.trafficMediumNumber ===
                prevSovIframe.trafficMediumNumber &&
              sovIframe.sessionId === prevSovIframe.sessionId &&
              sovIframe.timestamp === prevSovIframe.timestamp &&
              sovIframe.orderId === prevSovIframe.orderId &&
              sovIframe.orderValue === prevSovIframe.orderValue &&
              sovIframe.orderCurrency === prevSovIframe.orderCurrency &&
              sovIframe.usedCouponCode === prevSovIframe.usedCouponCode &&
              sovIframe.iframeContainerId === prevSovIframe.iframeContainerId;
          }
          prevSovIframe = sovIframe;
          return isTheSame;
        })
      );
    }

    let statusMessage = multipleSovIframesDetected.elementValue
      ? "<li><h3 class='sovendus-overlay-error'>ERROR: sovIframes was found " +
        sovIframesAmount.elementValue +
        " times " +
        (multipleIframesAreSame
          ? "with the same content. This is probably due to Sovendus being executed multiple times or"
          : "with different content. Make sure to check the window.sovIframes variable in the browser console. This is probably due to ") +
        " Sovendus being integrated multiple times.</h3></li>"
      : "";

    return new TestResult(
      multipleIframesAreSame,
      statusMessage,
      multipleSovIframesDetected.elementValue && multipleIframesAreSame
        ? StatusCodes.Error
        : StatusCodes.Success
    );
  }
  getOrderCurrencyTestResult(): TestResult {
    const validCurrencies = ["EUR", "GBP", "CHF", "PLN", "SEK", "DKK", "NOK"];
    const missingCurrencyError =
      "Make sure a valid order currency gets passed, valid currencies are: " +
      validCurrencies;
    const valueTestResult: TestResult = this.validValueTestResult(
      window.sovIframes?.[0]?.orderCurrency,
      missingCurrencyError
    );
    if (valueTestResult.statusCode === StatusCodes.Success) {
      const isValidCurrency = validCurrencies.includes(
        String(valueTestResult.elementValue)
      );
      let statusMessage: StatusMessage =
        String(valueTestResult.elementValue) + this.getCheckMarkWithLabel();
      let statusCode: StatusCode = StatusCodes.Success;
      if (!isValidCurrency) {
        statusMessage = `<span class='sovendus-overlay-error' >${
          valueTestResult.elementValue
        } ISN'T A VALID CURRENCY${this.getInfoMarkWithLabel(
          missingCurrencyError
        )}</span>`;
        statusCode = StatusCodes.Error;
      }
      return new TestResult(
        valueTestResult.elementValue,
        statusMessage,
        statusCode
      );
    }
    return valueTestResult;
  }

  getOrderIdTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.orderId,
      "Make sure to pass the order id",
      "Make sure the value aligns with the actual order id."
    );
  }

  getOrderValueTestResult(): TestResult {
    return this.validNumberTestResult(window.sovIframes?.[0]?.orderValue);
  }

  getSessionIdTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.sessionId,
      "Make sure a session id gets passed",
      "Make sure the session id doesn't change after a refresh, but changes with a new session."
    );
  }

  getTimestampTestResult(): TestResult {
    return this.validUnixTimeTestResult(window.sovIframes?.[0]?.timestamp);
  }

  getUsedCouponCodeTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.usedCouponCode,
      "Make sure the used coupon code from the order gets passed",
      "Make sure the used coupon code from the order aligns with this value."
    );
  }

  validValueTestResult(
    value: ElementValue,
    missingErrorMessage: string = "",
    successMessage?: string
  ): TestResult {
    let elementValue: ElementValue = undefined;
    let statusCode: StatusCode = StatusCodes.Error;
    let statusMessage: StatusMessage = undefined;
    if (value && value !== "undefined") {
      statusCode = StatusCodes.Success;
      elementValue = decodeURIComponent(decodeURI(String(value)));
      statusMessage =
        String(elementValue) +
        (successMessage
          ? this.getInfoMarkWithLabel(successMessage)
          : this.getCheckMarkWithLabel());
    } else {
      statusMessage = this.getDataIsMissingWarning(missingErrorMessage);
    }
    return new TestResult(elementValue, statusMessage, statusCode);
  }

  validNumberTestResult(value: ElementValue): TestResult {
    const missingNumberError =
      "Make sure to pass the order value, it needs to be a number e.g. 20.5 and NOT 20,5";
    const decodedValue: TestResult = this.validValueTestResult(
      value,
      missingNumberError
    );
    let statusMessage: StatusMessage = undefined;
    let statusCode: StatusCode = StatusCodes.Error;
    if (decodedValue.statusCode === StatusCodes.Success) {
      if (isNaN(Number(decodedValue.elementValue))) {
        statusMessage = `<span class='sovendus-overlay-error' >${
          decodedValue.elementValue
        } IS NOT A NUMBER${this.getInfoMarkWithLabel(
          missingNumberError
        )}</span>`;
        statusCode = StatusCodes.Error;
      } else {
        statusCode = StatusCodes.Success;
        statusMessage =
          String(decodedValue.elementValue) +
          this.getInfoMarkWithLabel(
            "Make sure the order value is net without shipping cost."
          );
      }
    } else {
      statusMessage = this.getDataIsMissingWarning(
        "This value needs to be a number e.g. 20.5 and NOT 20,5"
      );
      statusCode = StatusCodes.Error;
    }
    return new TestResult(decodedValue.elementValue, statusMessage, statusCode);
  }

  validUnixTimeTestResult(value: ElementValue): TestResult {
    const missingUnixTimeError =
      "Make sure to pass a unix timestamp in seconds.";
    const decodedValue: TestResult = this.validValueTestResult(
      value,
      missingUnixTimeError
    );
    let statusMessage: StatusMessage = undefined;
    let statusCode: StatusCode = StatusCodes.Error;
    let isUnixTime = false;
    if (decodedValue.statusCode === StatusCodes.Success) {
      const truncatedTime = Math.floor(Number(decodedValue.elementValue));
      isUnixTime =
        !isNaN(truncatedTime) &&
        [13, 10].includes(truncatedTime.toString().length);
      if (isUnixTime) {
        statusCode = StatusCodes.Success;
        statusMessage =
          String(decodedValue.elementValue) + this.getCheckMarkWithLabel();
      } else {
        statusMessage = `<span class='sovendus-overlay-error' >${
          decodedValue.elementValue
        } IS NOT A UNIX TIME${this.getInfoMarkWithLabel(
          missingUnixTimeError
        )}</span>`;
        statusCode = StatusCodes.Error;
      }
    } else {
      statusMessage = this.getDataIsMissingWarning(
        "A unix timestamp in seconds should be provided"
      );
      statusCode = StatusCodes.Error;
    }
    return new TestResult(decodedValue.elementValue, statusMessage, statusCode);
  }

  getCheckMarkWithLabel(): string {
    return `
      <span style="position:relative">
        <img style="height:18px;width:auto;margin-bottom: -4px" class="sovendus-check-mark"
         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAS5AAAEuQER4c0nAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAcZJREFUWIXtlT1Lw1AUht+bFOql+A8qCO4Blzalgwo6pLX+AWdxaC1UcHBzlULVdHDzF+jg1+RgoEJSSpfugiJdO2mr9OM6WEqa5japjRmk73jP4T4P54RcYJZZfEqsEKOyKmdxBMF8LvoBV1Ql2BSalwCyYRpeqEfrd9DAfBFQVCXYQOMKQLJ/tGyWID7DzbkoN8o7fyYQK8RoT+xdg2CD0/IodISkwClODw/0bsbAS1SkW/q+3vJ8AgM4sD4GntDS2jsAeCowKdxTgd/ARwTix/H5Nm2fM5EdVtKVNw/hWifYSVZ3q01rYfARSnkp1KbtWwKyLXSFknwiL3oEL1GRpuzgQH8CUl4KzQXn7gnIiqn2Srpk1cgZL1PCR8Y+JNC/5AFA3FpkYM9MZGt263Az9tZXa7N2UPvgwQFA0HP6J4CqrR3Ikt06XMCfqEhTTvAfBgAwkGgxegogy+kbrMMlXBk39lEBlxIAEgDOvIIPC/Ql5KKsMrAMp78DIMCpudq5NcNvAQEz9owsAJXTz4O73rk19n9C53VY4RON3VnAvcRU8PECzhJTw50F+BKewN0JjEp4Bp8sDCSiRjJSXgr5C57lv+cbJ0juWerPx1oAAAAASUVORK5CYII=" />
      </span>
    `;
  }

  getInfoMarkWithLabel(labelText: string, isWarning: boolean = true): string {
    const infoIcon = isWarning
      ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAOVJREFUWEftl10OhDAIhNtz7vn2nG58cFMrMMPYpGr01QKfw0+xlslPnRy/3BNg+ZbFUq5+8h9EK+AF9VLIwkCAbOAeCIGEAGeDbzARhAug5jlrZwJknfSyZ+xpAEvGNhB6v0JaZw4AFj3j3AvQ++t9QQCvgFTQFABqIZSCrTYiFXYKILnaYht1VgLIVPkKPVyB6QBMbtl0SSl4LgAqGDRy2ZnRnpMHEQuL2hUCeCOWAWCm5fUuI+vLmMUiarvI/poLidfn6j+EtJKNgkA3KtyKVRAU+F8XiqzZyyiKQSuggDI2L8APUoSuITyX8cMAAAAASUVORK5CYII="
      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAONJREFUWEftl9sOhDAIROX/P7obHzS1C8wwNqm70VcLHIdL0bbFjy2Ov/0mQGutecqZWfmDaIMoaJRCFgYCVAOPQAgkBbgb/IDJIEIANc9VOxeg6mSUvWJPA3gy9oHQ+x3SO/MF4NEzzqMAo7/RFwSICkgFLQGgFkIpOGojU+GiAJKrL7ZZZyWASpXv0NMVWA7A5JZNl5SC/wVABYNGLjsz+nPyIGJhUbtCgGjEMgDMtHzeZeR9GbNYZG2X2T9zIYn6XP2HkFayWRDoRoVbsQqCAp91ochavYyyGLQCCihj8wJ8AKPZ6CHFW/ndAAAAAElFTkSuQmCC";
    return `
      <span style="position:relative">
        <div style="display:none;
          position: absolute;
          right: -75px;
          background: orange;
          width: 250px;
          padding: 12px;
          color: #fff;
          border-radius: 8px;
          margin-top: 3px;
          z-index: 99;  
          bottom: 25px;
          "
          class="sovendus-info"
        >
        <img style="height:18px;width:auto"
         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAONJREFUWEftl9sOhDAIROX/P7obHzS1C8wwNqm70VcLHIdL0bbFjy2Ov/0mQGutecqZWfmDaIMoaJRCFgYCVAOPQAgkBbgb/IDJIEIANc9VOxeg6mSUvWJPA3gy9oHQ+x3SO/MF4NEzzqMAo7/RFwSICkgFLQGgFkIpOGojU+GiAJKrL7ZZZyWASpXv0NMVWA7A5JZNl5SC/wVABYNGLjsz+nPyIGJhUbtCgGjEMgDMtHzeZeR9GbNYZG2X2T9zIYn6XP2HkFayWRDoRoVbsQqCAp91ochavYyyGLQCCihj8wJ8AKPZ6CHFW/ndAAAAAElFTkSuQmCC"
         />
          ${labelText}
        </div>
        <img style="height:20px;width:auto;margin-bottom: -4px;"
         src=${infoIcon} />
      </span>
    `;
  }

  sovIframesOrConsumerExists() {
    return (
      window.hasOwnProperty("sovIframes") ||
      window.hasOwnProperty("sovConsumer")
    );
  }

  sovApplicationExists() {
    return window.sovApplication?.hasOwnProperty("consumer");
  }

  awinIntegrationDetected(): boolean {
    return Boolean(window.AWIN?.Tracking?.Sovendus?.trafficMediumNumber);
  }

  awinSaleTracked(): boolean {
    return Boolean(window.AWIN?.Tracking?.Sale);
  }

  getAwinMerchantId(): number | string {
    return window.AWIN?.Tracking?.iMerchantId || "not available";
  }

  sovInstancesLoaded() {
    return window.sovApplication?.instances?.find(
      (instance) =>
        instance.banner?.bannerExists ||
        instance.collapsableOverlayClosingType ||
        instance.stickyBanner?.bannerExists
    );
  }

  async waitForSovendusIntegrationDetected() {
    console.log("No Sovendus integration detected yet");
    let waitedSeconds = 0;
    while (!this.sovIframesOrConsumerExists()) {
      if (waitedSeconds > 5 && this.awinIntegrationDetected()) {
        return; // continue with awin diagnostics
      }
      waitedSeconds += 0.5;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    await this.waitForSovApplicationObject();
  }

  async waitForSovApplicationObject() {
    let waitedSeconds = 0;
    while (!this.sovApplicationExists() && waitedSeconds < 5) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      waitedSeconds += 0.5;
    }
    console.log("Sovendus has been detected");
    if (this.sovApplicationExists()) {
      await this.waitForBannerToBeLoaded();
    }
  }

  async waitForBannerToBeLoaded() {
    let waitedSeconds = 0;
    while (!this.sovInstancesLoaded() && waitedSeconds < 4) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      waitedSeconds += 0.5;
    }
    // wait a bit longer, just in case multiple integrations fire later
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Sovendus banner loaded");
  }
  getDataIsMissingWarning(missingErrorMessage: string) {
    return (
      "<span class='sovendus-overlay-error' >DATA MISSING" +
      this.getInfoMarkWithLabel(missingErrorMessage) +
      "</span>"
    );
  }
  getBrowserName(): string {
    if (navigator.userAgent.indexOf("Firefox") != -1) {
      return "Firefox";
    }
    if (navigator.userAgent.indexOf("Edg") != -1) {
      return "Edge";
    }
    if (navigator.userAgent.indexOf("Chrome") != -1) {
      return "Chrome";
    }
    return "Not detected";
  }
}

const trafficSourceInfoMessage =
  "Make sure the value aligns with the traffic source number you have received for this country.";
const trafficMediumInfoMessage =
  "Make sure the value aligns with the traffic medium number you have received for this country.";

type ElementValue = undefined | null | string | number | boolean;
export enum StatusCodes {
  Success = 0,
  Warning,
  Error,
  TestDidNotRun,
}
type StatusCode = StatusCodes;
type StatusMessage = string | undefined;

interface SovConsumer {
  consumerSalutation?: "Mr." | "Mrs." | "";
  consumerFirstName?: string;
  consumerLastName?: string;
  consumerYearOfBirth?: number;
  consumerEmail?: string;
  consumerEmailHash?: string;
  consumerPhone?: string;
  consumerStreet?: string;
  consumerStreetNumber?: string;
  consumerZipCode?: string;
  consumerCity?: string;
  consumerCountry?: string;
}

function convertToSovApplicationConsumer(
  sovConsumer: SovConsumer
): SovApplicationConsumer {
  return {
    salutation: sovConsumer.consumerSalutation,
    firstName: sovConsumer.consumerFirstName,
    lastName: sovConsumer.consumerLastName,
    yearOfBirth: sovConsumer.consumerYearOfBirth,
    email: sovConsumer.consumerEmail,
    emailHash: sovConsumer.consumerEmailHash,
    street: sovConsumer.consumerStreet,
    streetNumber: sovConsumer.consumerStreetNumber,
    zipCode: sovConsumer.consumerZipCode,
    city: sovConsumer.consumerCity,
    country: sovConsumer.consumerCountry,
    phone: sovConsumer.consumerPhone,
  };
}

interface SovApplicationConsumer {
  salutation?: "Mr." | "Mrs." | "" | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  yearOfBirth?: number | undefined;
  email?: string | undefined;
  emailHash?: string | undefined;
  phone?: string | undefined;
  street?: string | undefined;
  streetNumber?: string | undefined;
  zipCode?: string | undefined;
  city?: string | undefined;
  country?: string | undefined;
}

interface SovApplication {
  consumer?: SovApplicationConsumer;
  instances?: Instance[];
}

interface SovIframes {
  trafficSourceNumber?: number;
  trafficMediumNumber?: number;
  sessionId?: string;
  timestamp?: number;
  orderId?: string;
  orderValue?: number;
  orderCurrency?: string;
  usedCouponCode?: string;
  iframeContainerId?: string;
  integrationType?: string;
}

interface Banner {
  bannerExists?: boolean;
}

interface Config {
  overlay?: object;
  stickyBanner?: object;
}

interface Instance {
  banner?: Banner;
  stickyBanner?: Banner;
  selectBanner?: object;
  collapsableOverlayClosingType?: string;
  config?: Config;
}

interface Awin {
  Tracking?: {
    Sovendus?: { trafficSourceNumber?: string; trafficMediumNumber?: string };
    Sale: {};
    iMerchantId: number;
  };
}

interface SovWindow extends Window {
  sovIframes?: SovIframes[];
  sovConsumer?: SovConsumer;
  sovApplication?: SovApplication;
  AWIN?: Awin;
}

declare let window: SovWindow;
