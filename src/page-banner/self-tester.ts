class TestResult {
  elementValue: ElementValue;
  statusMessage: StatusMessage;
  statusMessageKey: MessageKeyTypes;
  statusCode: StatusCode;
  constructor({elementValue = undefined, statusMessage = undefined, statusMessageKey = undefined, statusCode}: {
    elementValue: ElementValue,
    statusMessage: StatusMessage,
    statusMessageKey: MessageKeyTypes,
    statusCode: StatusCode
  }) {
    this.elementValue = elementValue;
    this.statusMessage = statusMessage || "";
    this.statusMessageKey = statusMessageKey;
    this.statusCode = statusCode;
  }
}

export default class SelfTester {
  integrationType?: string;
  browserName?: string;
  websiteURL?: string;
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
    this.browserName = this.getBrowserName();
    this.websiteURL = this.getWebsiteURL();
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
        this.getMultipleSovIFramesDetectedTestResult(this.sovIFramesAmount);
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

    let statusMessageKey: MessageKeyTypes;

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
      statusMessageKey = MessageKeyTypes.awinSaleTrackedAfterScript;
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
      statusMessageKey = MessageKeyTypes.awinNoSalesTracked;
    }

    const elementValue: ElementValue = false;

    this.trafficSourceNumber = new TestResult({
      elementValue: window.AWIN?.Tracking?.Sovendus?.trafficSourceNumber,
      statusMessage: window.AWIN?.Tracking?.Sovendus?.trafficSourceNumber +
        this.getInfoMarkWithLabel(errorsMessages.trafficSourceNumberSuccess.infoText),
        statusMessageKey: undefined,
        statusCode: StatusCodes.Success
    });
    this.trafficMediumNumber = new TestResult({
      elementValue: window.AWIN?.Tracking?.Sovendus?.trafficMediumNumber,
      statusMessage: window.AWIN?.Tracking?.Sovendus?.trafficMediumNumber +
        this.getInfoMarkWithLabel(errorsMessages.trafficMediumNumberSuccess.infoText),
      statusMessageKey: undefined,
      statusCode: StatusCodes.Success
    });

    return new TestResult({
      elementValue,
      statusMessage,
      statusMessageKey,
      statusCode
    });
  }
  getConsumerSalutationTestResult(
    consumer: SovApplicationConsumer
  ): TestResult {
    const missingSalutationError = errorsMessages.salutationNotValid.infoText;
    const valueTestResult: TestResult = this.validValueTestResult(
      consumer.salutation || window.sovConsumer?.consumerSalutation,
      MessageKeyTypes.salutationNotValid,
      MessageKeyTypes.consumerSalutationSuccess
    );
    if (valueTestResult.statusCode === StatusCodes.Success) {
      const validSalutations = ["Mr.", "Mrs."];
      let statusCode: StatusCode = StatusCodes.Success;
      let statusMessage: StatusMessage =
        String(valueTestResult.elementValue) + this.getCheckMarkWithLabel();
      let statusMessageKey: MessageKeyTypes = undefined;
      if (!validSalutations.includes(String(valueTestResult.elementValue))) {
        statusCode = StatusCodes.Error;
        statusMessage = `<span class='sovendus-overlay-error' >${
          valueTestResult.elementValue
        } ISN'T A VALID SALUTATION${this.getInfoMarkWithLabel(
          missingSalutationError
        )}</span>`;
        statusMessageKey = MessageKeyTypes.salutationNotValid;
      }
      return new TestResult({
        elementValue: valueTestResult.elementValue,
        statusMessage,
        statusMessageKey,
        statusCode
      });
    }
    return valueTestResult;
  }

  getConsumerFirstNameTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.firstName,
      MessageKeyTypes.missingConsumerFirstName,
      MessageKeyTypes.consumerFirstNameSuccess,
    );
  }

  getConsumerLastNameTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.lastName,
      MessageKeyTypes.missingConsumerLastName,
      MessageKeyTypes.consumerLastNameSuccess,
    );
  }

  getConsumerYearOfBirthTestResult(
    consumer: SovApplicationConsumer
  ): TestResult {
    const missingMailError: string = errorsMessages.yearOfBirthNotValid.infoText;
    const yearOfBirthTestResult: TestResult = this.validValueTestResult(
      consumer.yearOfBirth || window.sovConsumer?.consumerYearOfBirth,
      MessageKeyTypes.yearOfBirthNotValid,
      MessageKeyTypes.yearOfBirthSuccess,
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
      let statusMessageKey: MessageKeyTypes = undefined;
      if (
        !(yearOfBirthNumber < validToYear && yearOfBirthNumber > validFromYear)
      ) {
        statusCode = StatusCodes.Error;
        statusMessage = `<span class='sovendus-overlay-error' >${
          yearOfBirthTestResult.elementValue
        } ISN'T A VALID BIRTH YEAR${this.getInfoMarkWithLabel(
          missingMailError
        )}</span>`;
        statusMessageKey = MessageKeyTypes.yearOfBirthNotValid;
      }
      return new TestResult({
        elementValue: yearOfBirthTestResult.elementValue,
        statusMessage,
        statusMessageKey,
        statusCode
      });
    }
    return yearOfBirthTestResult;
  }

  getConsumerEmailTestResult(consumer: SovApplicationConsumer): TestResult {
    const missingEmailError = errorsMessages.emailNotValid.infoText;
    const emailTestResult: TestResult = this.validValueTestResult(
      consumer.email,
      MessageKeyTypes.emailNotValid,
      MessageKeyTypes.emailSuccess,
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
      let statusMessageKey: MessageKeyTypes = MessageKeyTypes.emailSuccess;
      if (!mailIsValid) {
        statusCode = StatusCodes.Error;
        statusMessage = `<span class='sovendus-overlay-error' >${
          emailTestResult.elementValue
        } ISN'T A VALID EMAIL${this.getInfoMarkWithLabel(
          missingEmailError
        )}</span>`;
        statusMessageKey = MessageKeyTypes.emailNotValid;
      }
      return new TestResult({
        elementValue,
        statusMessage,
        statusMessageKey,
        statusCode
      });
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
    let statusMessageKey: MessageKeyTypes = undefined;
    if (!consumerEmail.elementValue) {
      const testResult = this.validValueTestResult(
        consumer.emailHash,
        MessageKeyTypes.emailNotMD5Hash,
        MessageKeyTypes.emailHashSuccess
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
            statusMessageKey = MessageKeyTypes.emailHashSuccess;
        } else {
          statusCode = StatusCodes.Error;
          statusMessage =
            "<li class='sovendus-overlay-font sovendus-overlay-text'>consumerEmailHash: " +
            testResult.elementValue +
            `<span class='sovendus-overlay-error' >${errorsMessages.emailNotMD5Hash.errorText}` +
            this.getInfoMarkWithLabel(
              errorsMessages.emailNotMD5Hash.infoText
            ) +
            "</span>";
          ("</li>");
          statusMessageKey = MessageKeyTypes.emailNotMD5Hash;
        }
      } else if (testResult.statusCode === 2) {
        statusMessage =
          "<li class='sovendus-overlay-font sovendus-overlay-text'>consumerEmailHash: " +
          testResult.statusMessage +
          "</li>";
        statusMessageKey = testResult.statusMessageKey;
      }
    }
    return new TestResult({
      elementValue, 
      statusMessage, 
      statusMessageKey, 
      statusCode
    });

  }

  checkIfValidMd5Hash(emailHash: string): boolean {
    const regexExp = /^[a-f0-9]{32}$/gi;
    return regexExp.test(emailHash);
  }

  getConsumerStreetTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.street,
      MessageKeyTypes.missingConsumerStreet,
      MessageKeyTypes.consumerStreetSuccess,
    );
  }

  getConsumerStreetNumberTestResult(
    consumer: SovApplicationConsumer
  ): TestResult {
    return this.validValueTestResult(
      consumer.streetNumber,
      MessageKeyTypes.missingConsumerStreetNumber,
      MessageKeyTypes.consumerStreetNumberSuccess,
    );
  }

  getConsumerZipCodeTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.zipCode,
      MessageKeyTypes.missingConsumerZipCode,
      MessageKeyTypes.consumerZipCodeSuccess,
    );
  }

  getConsumerPhoneTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.phone,
      MessageKeyTypes.missingConsumerPhone,
      MessageKeyTypes.consumerPhoneSuccess,
    );
  }

  getConsumerCityTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.city,
      MessageKeyTypes.missingConsumerCity,
      MessageKeyTypes.consumerCitySuccess,
    );
  }

  getConsumerCountryTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.country,
      MessageKeyTypes.missingConsumerCountry,
      MessageKeyTypes.consumerCountrySuccess,
    );
  }

  getTrafficSourceNumberTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.trafficSourceNumber,
      MessageKeyTypes.missingTrafficSourceNumber,
      MessageKeyTypes.trafficSourceNumberSuccess,
    );
  }

  getTrafficMediumNumberTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.trafficMediumNumber,
      MessageKeyTypes.missingTrafficMediumNumber,
      MessageKeyTypes.trafficMediumNumberSuccess,
    );
  }

  getIframeContainerIdTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.iframeContainerId,
      MessageKeyTypes.missingIframeContainerId,
      undefined,
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
    let statusMessageKey: MessageKeyTypes = undefined;
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
        const {innerErrorMessage, statusMessageKey} = this.getFlexileIframeDidNotExecuteErrorMessage(flexibleIframeJs);

      } else {
        innerErrorMessage = errorsMessages.iFrameNotOnDOM.errorText;
        statusMessageKey = MessageKeyTypes.iFrameNotOnDOM;
      }
      errorMessage = `<h2 class="sovendus-overlay-font sovendus-overlay-h2" style="color:red !important;">Error: ${innerErrorMessage}</h2>`;
    }
    return new TestResult({
      elementValue: isSuccess, 
      statusMessage: errorMessage, 
      statusMessageKey,
      statusCode
    });
  }

  getFlexileIframeDidNotExecuteErrorMessage(
    flexibleIframeJs: HTMLScriptElement
  ):
  {
    innerErrorMessage: string,
    statusMessageKey: MessageKeyTypes
  } 
  {
    let innerErrorMessage: string = "";
    let statusMessageKey: MessageKeyTypes = undefined;
    if (this.checkIfFlexibleIframeIsExecutable(flexibleIframeJs)) {
      const sovendusJs: HTMLScriptElement = document.getElementById(
        "sovloader-script"
      ) as HTMLScriptElement;
      if (sovendusJs) {
        if (sovendusJs.type === "text/javascript" || sovendusJs.type === null) {
          innerErrorMessage = errorsMessages.unknownErrorIntegrationScriptFailed.errorText;
            statusMessageKey = MessageKeyTypes.unknownErrorIntegrationScriptFailed
          } else {
          innerErrorMessage = (errorsMessages.sovendusJsBlockedByCookieConsent.errorText).replace("${elementValue}", sovendusJs.type);
          statusMessageKey = MessageKeyTypes.sovendusJsBlockedByCookieConsent
        }
      } else {
          innerErrorMessage = errorsMessages.flexibleIframeJsExecutedTooEarly.errorText
          statusMessageKey = MessageKeyTypes.flexibleIframeJsExecutedTooEarly
        }
    } else {
      innerErrorMessage = (errorsMessages.flexibleIframeJsBlockedByCookieConsent.errorText).replace("${elementValue}", flexibleIframeJs.type);
      statusMessageKey = MessageKeyTypes.flexibleIframeJsBlockedByCookieConsent
    }
    return {innerErrorMessage, statusMessageKey};
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
    return new TestResult({
      elementValue: wasExecuted,
      statusMessage: undefined,
      statusMessageKey: undefined,
      statusCode: wasExecuted ? StatusCodes.Success : StatusCodes.Error
    });
  }

  getIsEnabledInBackendTestResult(wasExecuted: TestResult): TestResult {
    let statusCode: StatusCode = StatusCodes.TestDidNotRun;
    let isEnabled: boolean | undefined = undefined;
    let statusMessage: StatusMessage = undefined;
    let statusMessageKey: MessageKeyTypes = undefined;
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
          `<h3 class='sovendus-overlay-error'>${errorsMessages.sovendusBannerDisabled.errorText}</h3>`;
        statusMessageKey = MessageKeyTypes.sovendusBannerDisabled;
      }
    }
    return new TestResult({
      elementValue: isEnabled, 
      statusMessage, 
      statusMessageKey, 
      statusCode
    });

  }

  getSovDivIdInIFramesTestResult(sovIFramesAmount: TestResult): TestResult {
    const elementValue: boolean = Boolean(
      window.sovIframes?.[0]?.iframeContainerId
    );
    let statusMessage: StatusMessage = undefined;
    let statusCode: StatusCode = StatusCodes.Success;
    let statusMessageKey: MessageKeyTypes = undefined;
    if ((elementValue && sovIFramesAmount.elementValue) || 0 > 0) {
      statusCode = StatusCodes.Error;
      statusMessage =
        `<h3 class='sovendus-overlay-error'>${errorsMessages.missingIframeContainerId.errorText}</h3>`;
        statusMessageKey = MessageKeyTypes.missingIframeContainerId;
    }
    return new TestResult({
      elementValue, 
      statusMessage, 
      statusMessageKey, 
      statusCode});
  }

  getSovendusDivFoundTestResult(
    sovDivIdInIframes: TestResult,
    iframeContainerId: TestResult
  ): TestResult {
    let statusMessage: StatusMessage = undefined;
    let statusCode: StatusCode = StatusCodes.Success;
    let sovendusDivFound: boolean = false;
    let statusMessageKey: MessageKeyTypes = undefined;
    if (sovDivIdInIframes.elementValue) {
      sovendusDivFound =
        sovDivIdInIframes &&
        Boolean(
          typeof iframeContainerId.elementValue === "string" &&
            document.getElementById(iframeContainerId.elementValue)
        );
      if (!sovendusDivFound) {
        statusMessage =
          `<li><h3 class="sovendus-overlay-error">${(errorsMessages.containerDivNotFoundOnDOM.errorText).replace("${elementValue}", String(iframeContainerId.elementValue) || "")}</h2></li>`;
          statusMessageKey = MessageKeyTypes.containerDivNotFoundOnDOM;
      }
    }
    return new TestResult({
      elementValue: sovendusDivFound,
      statusMessage,
      statusMessageKey,
      statusCode
    });
  }

  getMultipleSovIFramesDetectedTestResult(
    sovIframesAmount: TestResult
  ): TestResult {
    const multipleSovIframesDetected =
      Number(sovIframesAmount.elementValue) > 1;
    return new TestResult({
      elementValue: multipleSovIframesDetected,
      statusMessage: undefined,
      statusMessageKey: undefined,
      statusCode: multipleSovIframesDetected ? StatusCodes.Error : StatusCodes.Success
    });
  }

  getSovIFramesAmountTestResult(): TestResult {
    const sovIframesAmount = window.sovIframes?.length;
    return new TestResult({
      elementValue: sovIframesAmount,
      statusMessage: undefined,
      statusMessageKey: undefined,
      statusCode: sovIframesAmount === 1 ? StatusCodes.Success : StatusCodes.Error
    });
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

    const statusMessage = multipleSovIframesDetected.elementValue
      ? "<li><h3 class='sovendus-overlay-error'>" +
        (multipleIframesAreSame
          ? errorsMessages.multipleSovIframesDetectedAndAreSame.errorText.replace("${elementValue}", String(sovIframesAmount.elementValue))
          : errorsMessages.multipleSovIframesDetected.errorText.replace("${elementValue}", String(sovIframesAmount.elementValue))) +
        "</h3></li>"
      : "";

    const statusMessageKey: MessageKeyTypes = multipleSovIframesDetected.elementValue ? (multipleIframesAreSame ? MessageKeyTypes.multipleSovIframesDetectedAndAreSame : MessageKeyTypes.multipleSovIframesDetected) : undefined;

    return new TestResult({
      elementValue: multipleIframesAreSame,
      statusMessage,
      statusMessageKey,
      statusCode: multipleSovIframesDetected.elementValue && multipleIframesAreSame
        ? StatusCodes.Error
        : StatusCodes.Success
    });
  }
  getOrderCurrencyTestResult(): TestResult {
    const missingCurrencyError = errorsMessages.currencyNotValid.infoText;
    const valueTestResult: TestResult = this.validValueTestResult(
      window.sovIframes?.[0]?.orderCurrency,
      MessageKeyTypes.currencyNotValid,
      MessageKeyTypes.currencySuccess
    );
    if (valueTestResult.statusCode === StatusCodes.Success) {
      const isValidCurrency = validCurrencies.includes(
        String(valueTestResult.elementValue)
      );
      let statusMessage: StatusMessage =
        String(valueTestResult.elementValue) + this.getInfoMarkWithLabel(errorsMessages.currencySuccess.infoText);
      let statusMessageKey: MessageKeyTypes = MessageKeyTypes.currencySuccess;
      let statusCode: StatusCode = StatusCodes.Success;
      if (!isValidCurrency) {
        statusMessage = `<span class='sovendus-overlay-error' >${
          valueTestResult.elementValue
        } ISN'T A VALID CURRENCY${this.getInfoMarkWithLabel(
          missingCurrencyError
        )}</span>`;
        statusMessageKey = MessageKeyTypes.currencyNotValid;
        statusCode = StatusCodes.Error;
      }
      return new TestResult({
        elementValue: valueTestResult.elementValue,
        statusMessage,
        statusMessageKey,
        statusCode
      });
    }
    return valueTestResult;
  }

  getOrderIdTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.orderId,
      MessageKeyTypes.missingOrderId,
      MessageKeyTypes.orderIdSuccess,
    );
  }

  getOrderValueTestResult(): TestResult {
    return this.validNumberTestResult(window.sovIframes?.[0]?.orderValue);
  }

  getSessionIdTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.sessionId,
      MessageKeyTypes.missingSessionId,
      MessageKeyTypes.sessionIdSuccess,
    );
  }

  getTimestampTestResult(): TestResult {
    return this.validUnixTimeTestResult(window.sovIframes?.[0]?.timestamp);
  }

  getUsedCouponCodeTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.usedCouponCode,
      MessageKeyTypes.missingCouponCode,
      MessageKeyTypes.couponCodeSuccess,
    );
  }

  validValueTestResult(
    value: ElementValue,
    missingErrorMessageKey: MessageKeyTypes,
    successMessageKey: MessageKeyTypes
  ): TestResult {
    let elementValue: ElementValue = undefined;
    let statusCode: StatusCode = StatusCodes.Error;
    let statusMessage: StatusMessage = undefined;
    let statusMessageKey: MessageKeyTypes = undefined;
    if (value && value !== "undefined") {
      statusCode = StatusCodes.Success;
      elementValue = decodeURIComponent(decodeURI(String(value)));
      statusMessage =
        String(elementValue) +
        (successMessageKey
          ? this.getInfoMarkWithLabel(errorsMessages[String(successMessageKey)].infoText)
          : this.getCheckMarkWithLabel());
          statusMessageKey = successMessageKey;
    } else {
      statusMessage = this.getDataIsMissingWarning(errorsMessages[String(missingErrorMessageKey)].infoText);
      statusMessageKey = missingErrorMessageKey;
    }
    return new TestResult({
      elementValue,
      statusMessage,
      statusMessageKey,
      statusCode
    });
  }

  validNumberTestResult(value: ElementValue): TestResult {
    const missingNumberError = errorsMessages.orderValueMissing.infoText;
    const decodedValue: TestResult = this.validValueTestResult(
      value,
      MessageKeyTypes.orderValueMissing,
      MessageKeyTypes.orderValueMissing
    );
    let statusMessage: StatusMessage = undefined;
    let statusCode: StatusCode = StatusCodes.Error;
    let statusMessageKey: MessageKeyTypes = undefined;
    if (decodedValue.statusCode === StatusCodes.Success) {
      if (isNaN(Number(decodedValue.elementValue))) {
        statusMessage = `<span class='sovendus-overlay-error' >${
          decodedValue.elementValue
        } IS NOT A NUMBER${this.getInfoMarkWithLabel(
          missingNumberError
        )}</span>`;
        statusMessageKey = MessageKeyTypes.orderValueWrongFormat;
        statusCode = StatusCodes.Error;
      } else {
        statusCode = StatusCodes.Success;
        statusMessage =
          String(decodedValue.elementValue) +
          this.getInfoMarkWithLabel(
            errorsMessages.orderValueSuccess.infoText
          );
        statusMessageKey = MessageKeyTypes.orderValueSuccess;
      }
    } else {
      statusMessage = this.getDataIsMissingWarning(
        errorsMessages.orderValueWrongFormat.infoText
      );
      statusMessageKey = MessageKeyTypes.orderValueWrongFormat;
      statusCode = StatusCodes.Error;
    }
    return new TestResult({
      elementValue: decodedValue.elementValue,
      statusMessage,
      statusMessageKey,
      statusCode
    });
  }

  validUnixTimeTestResult(value: ElementValue): TestResult {
    const missingUnixTimeError = errorsMessages.notAUnixTimestamp.infoText;
    const decodedValue: TestResult = this.validValueTestResult(
      value,
      MessageKeyTypes.notAUnixTimestamp,
      undefined
    );
    let statusMessage: StatusMessage = undefined;
    let statusCode: StatusCode = StatusCodes.Error;
    let isUnixTime = false;
    let statusMessageKey: MessageKeyTypes = undefined;
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
          errorsMessages.notAUnixTimestamp.errorText.replace("${elementValue}", String(decodedValue.elementValue))
        }${this.getInfoMarkWithLabel(
          missingUnixTimeError
        )}</span>`;
        statusMessageKey = MessageKeyTypes.notAUnixTimestamp;
        statusCode = StatusCodes.Error;
      }
    } else {
      statusMessage = this.getDataIsMissingWarning(
        errorsMessages.notValidUnixTimestamp.errorText
      );
      statusMessageKey = MessageKeyTypes.notValidUnixTimestamp;
      statusCode = StatusCodes.Error;
    }
    return new TestResult({
      elementValue: decodedValue.elementValue,
      statusMessage,
      statusMessageKey,
      statusCode
    });
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
    if (navigator.userAgent.indexOf("iPhone") != -1) {
      return "iPhone";
    }
    if (navigator.userAgent.indexOf("Android") != -1) {
      return "Android";
    }
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

  getWebsiteURL(): string {
    return window.location.host;
  }
}

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

enum MessageKeyTypes {
  awinNoSalesTracked = "awinNoSalesTracked",
  awinSaleTrackedAfterScript = "awinSaleTrackedAfterScript",
  salutationNotValid = "salutationNotValid",
  consumerSalutationSuccess = "consumerSalutationSuccess",
  yearOfBirthNotValid = "yearOfBirthNotValid",
  emailNotValid = "emailNotValid",
  emailSuccess = "emailSuccess",
  emailNotMD5Hash = "emailNotMD5Hash",
  emailHashSuccess = "emailHashSuccess",
  iFrameNotOnDOM = "iFrameNotOnDOM",
  unknownErrorIntegrationScriptFailed = "unknownErrorIntegrationScriptFailed",
  sovendusJsBlockedByCookieConsent = "sovendusJsBlockedByCookieConsent",
  flexibleIframeJsExecutedTooEarly = "flexibleIframeJsExecutedTooEarly",
  flexibleIframeJsBlockedByCookieConsent = "flexibleIframeJsBlockedByCookieConsent",
  sovendusBannerDisabled = "sovendusBannerDisabled",
  containerDivNotFoundOnDOM = "containerDivNotFoundOnDOM",
  multipleSovIframesDetected = "multipleSovIframesDetected",
  multipleSovIframesDetectedAndAreSame = "multipleSovIframesDetectedAndAreSame",
  currencyNotValid = "currencyNotValid",
  currencySuccess = "currencySuccess",
  notValidUnixTimestamp = "notValidUnixTimestamp",
  notAUnixTimestamp = "notAUnixTimestamp",
  orderValueMissing = "orderValueMissing",
  orderValueWrongFormat = "orderValueWrongFormat",
  orderValueSuccess = "orderValueSuccess",
  orderIdSuccess = "orderIdSuccess",
  missingOrderId = "missingOrderId",
  missingSessionId = "missingSessionId",
  sessionIdSuccess = "sessionIdSuccess",
  missingCouponCode = "missingCouponCode",
  couponCodeSuccess = "couponCodeSuccess",
  missingConsumerStreet = "missingConsumerStreet",
  consumerStreetSuccess = "consumerStreetSuccess",
  missingConsumerStreetNumber = "missingConsumerStreetNumber",
  consumerStreetNumberSuccess = "consumerStreetNumberSuccess",
  missingConsumerZipCode = "missingConsumerZipCode",
  consumerZipCodeSuccess = "consumerZipCodeSuccess",
  missingConsumerPhone = "missingConsumerPhone",
  consumerPhoneSuccess = "consumerPhoneSuccess",
  missingConsumerCity = "missingConsumerCity",
  consumerCitySuccess = "consumerCitySuccess",
  missingConsumerCountry = "missingConsumerCountry",
  consumerCountrySuccess = "consumerCountrySuccess",
  missingTrafficSourceNumber = "missingTrafficSourceNumber",
  trafficSourceNumberSuccess = "trafficSourceNumberSuccess",
  missingTrafficMediumNumber = "missingTrafficMediumNumber",
  trafficMediumNumberSuccess = "trafficMediumNumberSuccess",
  missingIframeContainerId = "missingIframeContainerId",
  missingConsumerFirstName = "missingConsumerFirstName",
  consumerFirstNameSuccess = "consumerFirstNameSuccess",
  missingConsumerLastName = "missingConsumerLastName",
  consumerLastNameSuccess = "consumerLastNameSuccess",
  yearOfBirthSuccess = "yearOfBirthSuccess",
}

const validCurrencies = ["EUR", "GBP", "CHF", "PLN", "SEK", "DKK", "NOK"]; 

const errorsMessages: {
  [errorKey in MessageKeyTypes]: {
    errorText: string | undefined;
    infoText: string | undefined;
  };
} = {
  awinNoSalesTracked: {
    errorText: "ERROR: Awin integration detected and a sale has been tracked, but for an unknown reason Sovendus hasn't been executed. A potential cause for the issue could be that the sale has been tracked after the www.dwin1.com/XXXX.js script got executed.",
    infoText: "ERROR: Awin integration detected and a sale has been tracked, but for an unknown reason Sovendus hasn't been executed. \
              A potential cause for the issue could be that the sale has been tracked after the www.dwin1.com/XXXX.js script got executed. \
              How to set up sales tracking with Awin? https://wiki.awin.com/index.php/Advertiser_Tracking_Guide/Standard_Implementation#Conversion_Tag"
  },

  awinSaleTrackedAfterScript: {
    errorText: "ERROR: No Sale tracked yet",
    infoText: "If this happens on the order success page, make sure you've implemented Awin sales tracking properly, as no sale was tracked. \
    How to set up sales tracking with Awin? https://wiki.awin.com/index.php/Advertiser_Tracking_Guide/Standard_Implementation#Conversion_Tag"
  },

  salutationNotValid: {
    errorText: "NOT A VALID SALUTATION",
    infoText: "Make sure to pass the salutation of the customer, valid are Mrs. and Mr."
  },

  yearOfBirthNotValid: {
    errorText: "NOT A VALID BIRTH YEAR",
    infoText: "Make sure to pass the year of birth of the customer, e.g. 1991",
  },

  yearOfBirthSuccess: {
    errorText: undefined,
    infoText: "Make sure the year of birth aligns with the year of birth you used for the order.",
  },

  emailNotValid: {
    errorText: "NOT A VALID EMAIL",
    infoText: "Make sure to pass the email address of the customer.",
  },

  emailSuccess: {
    errorText: undefined,
    infoText: "Make sure the email address aligns with the email address you used for the order.",
  },

  emailNotMD5Hash: {
    errorText: "EMAIL HASH IS NOT A MD5 HASH",
    infoText: "The value is not a valid MD5 hash, make sure the email is properly encoded.",
  },

  emailHashSuccess: {
    errorText: undefined,
    infoText: "Make sure either a valid email or a md5 hashed email is provided. Note that hashed email support must be enabled by Sovendus.",
  },

  iFrameNotOnDOM: {
    errorText: "Sovendus was detected but flexibleiframe.js was not found on the DOM. Make sure to place the flexibleiframe.js on the DOM after the Sovendus Integration Script.",
    infoText: undefined,
  },

  sovendusBannerDisabled: {
    errorText: "ERROR: Seems like the Sovendus banner is disabled in the Sovendus backend, or doesn't exist at all. Please contact your account manager to check if you're using the right traffic source and medium numbers and check if the banner is configured properly.",
    infoText: undefined,
  },

  unknownErrorIntegrationScriptFailed: {
    errorText: "Sovendus was detected and flexibleiframe.js was executed. For an unknown reason the integration script didn't run successfully tho.",
    infoText: undefined,
  },

  sovendusJsBlockedByCookieConsent: {
    errorText: "Sovendus was detected and flexibleiframe.js was executed. But the sovendus.js script, which gets placed by the flexibleiframe.js script, got blocked most likely because of your cookie consent tool. The type of the sovendus.js script should not be set, but is ${elementValue} instead.",
    infoText: undefined,
  },

  flexibleIframeJsExecutedTooEarly: {
    errorText: "Sovendus was detected but flexibleiframe.js was not executed. This is probably because the flexibleiframe.js script got placed on the DOM / executed before the Sovendus integration script. Make sure the flexibleiframe.js gets placed on the DOM / executed after the the Sovendus integration script.",
    infoText: undefined,
  },

  flexibleIframeJsBlockedByCookieConsent: {
    errorText: "Sovendus was detected but flexibleiframe.js was not executed because the script type is ${elementValue} instead of text/javascript. This probably happened because your cookie consent tool blocked the script.",
    infoText: undefined,
  },

  containerDivNotFoundOnDOM: {
    errorText: "ERROR: The sovendus container div with the id ${elementValue} was not found on the DOM! Make sure to add the div to the DOM before the Sovendus integration script gets executed. If the container is missing, you wont see any inline banners on the page, only overlays. On SPA (like react, angular, etc.) this will also have the effect that the banner is not disappearing after leaving the success page.",
    infoText: undefined,
  },

  multipleSovIframesDetected: {
    errorText: "ERROR: sovIframes was found ${elementValue} times with different content. Make sure to check the window.sovIframes variable in the browser console. This is probably due to Sovendus being integrated multiple times.",
    infoText: undefined,
  },

  multipleSovIframesDetectedAndAreSame: {
    errorText: "ERROR: sovIframes was found ${elementValue} times with the same content. This is probably due to Sovendus being executed multiple times or Sovendus being integrated multiple times.",
    infoText: undefined,
  },

  currencyNotValid: {
    errorText: "NOT A VALID CURRENCY",
    infoText: "Make sure a valid order currency gets passed, valid currencies are: " + validCurrencies,
  },

  currencySuccess: {
    errorText: undefined,
    infoText: "Make sure the value aligns with the actual currency of your order.",
  },

  notValidUnixTimestamp: {
    errorText: "A unix timestamp in seconds should be provided",
    infoText: "Make sure to pass a unix timestamp in seconds.",
  },

  notAUnixTimestamp: {
    errorText: "${elementValue} IS NOT A UNIX TIME",
    infoText: "Make sure to pass a unix timestamp in seconds.",
  },

  missingOrderId: {
    errorText: "ERROR: Data is missing!",
    infoText: "Make sure to pass the order id",
  },

  orderIdSuccess: {
    errorText: undefined,
    infoText: "Make sure the value aligns with the actual order id of your order.",
  },

  orderValueMissing: {
    errorText: "DATA IS MISSING",
    infoText:
      "Make sure to pass the order value, it needs to be a number e.g. 20.5 and NOT 20,5",
  },

  orderValueWrongFormat: {
    errorText: "VALUE IS NOT A NUMBER",
    infoText: "Make sure to pass the order value, it needs to be a number e.g. 20.5 and NOT 20,5",
  },

  orderValueSuccess: {
    errorText: undefined,
    infoText: "Make sure the order value is net without shipping cost.",
  },

  missingSessionId: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure a session id gets passed",
  },
      
  sessionIdSuccess: {
    errorText: undefined,
    infoText: "Make sure the session id doesn't change after a refresh, but changes with a new session."
  },

  missingCouponCode: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure the used coupon code from the order gets passed",
  },

  couponCodeSuccess: {
    errorText: undefined,
    infoText: "Make sure the used coupon code of your order aligns with this value."
  },

  missingConsumerStreet: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the street name of the delivery address.",
  },
    
  consumerStreetSuccess: {
    errorText: undefined,
    infoText: "Make sure this value aligns with the delivery address street name of your order."
  },

  missingConsumerStreetNumber: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the street number from the delivery address.",
  },
    
  consumerStreetNumberSuccess: {
    errorText: undefined,
    infoText: "Make sure this value aligns with the delivery address street number of your order."
  },

  missingConsumerZipCode: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the zip code of the delivery address.",
  },
    
  consumerZipCodeSuccess: {
    errorText: undefined,
    infoText: "Make sure this value aligns with the delivery address zip code of your order."
  },

  missingConsumerPhone: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the phone number.",
  },
    
  consumerPhoneSuccess: {
    errorText: undefined,
    infoText: "Make sure this value aligns with the phone number you used for the order."
  },

  missingConsumerCity: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the city of the delivery address.",
  },
    
  consumerCitySuccess: {
    errorText: undefined,
    infoText: "Make sure this value aligns with the delivery address city you used for the order."
  },

  missingConsumerCountry: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the country id of the delivery address."
  },
    
  consumerCountrySuccess: {
    errorText: undefined,
    infoText: "Make sure this value aligns with the country of the delivery address you used for the order."
  },

  missingTrafficSourceNumber: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the traffic source number you've received in your integration docs.",
  },
    
  trafficSourceNumberSuccess: {
    errorText: undefined,
    infoText: "Make sure this value aligns with the traffic source number you've received in your integration docs."
  },

  missingTrafficMediumNumber: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the traffic medium number you've received in your integration docs.",
  },
    
  trafficMediumNumberSuccess: {
    errorText: undefined,
    infoText: "Make sure the value aligns with the traffic medium number you have received for this country."
  },

  missingIframeContainerId: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass a iframe container id, this id corresponds to a div with this id on the DOM."
  },
    
  missingConsumerFirstName: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the customers first name.",
  },
    
  consumerFirstNameSuccess: {
    errorText: undefined,
    infoText: "Make sure this value aligns with the customers first name you used for the order."
  },

  missingConsumerLastName: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the customers last name.",
  },
    
  consumerLastNameSuccess: {
    errorText: undefined,
    infoText: "Make sure this value aligns with the customers last name you used for the order."
  },

  consumerSalutationSuccess: {
    errorText: undefined,
    infoText: "Make sure this value aligns with the salutation you used for the order."
  },
};