import {
  ElementValue,
  StatusCodes,
  StatusMessageKeyTypes,
  statusMessages,
  TestResultResponseDataType,
  validCountries,
  validCurrencies,
} from "./self-tester-data-to-sync-with-dev-hub.js";

export default class SelfTester {
  integrationType: TestResult;
  browserName: TestResult;
  websiteURL: TestResult;
  consumerSalutation: TestResult;
  consumerFirstName: TestResult;
  consumerLastName: TestResult;
  consumerYearOfBirth: TestResult;
  consumerEmail: TestResult;
  consumerEmailHash: TestResult;
  consumerStreet: TestResult;
  consumerStreetNumber: TestResult;
  consumerZipCode: TestResult;
  consumerPhone: TestResult;
  consumerCity: TestResult;
  consumerCountry: TestResult;
  trafficSourceNumber: TestResult;
  trafficMediumNumber: TestResult;
  orderCurrency: TestResult;
  orderId: TestResult;
  orderValue: TestResult;
  sessionId: TestResult;
  timestamp: TestResult;
  usedCouponCode: TestResult;
  iframeContainerId: TestResult;
  isEnabledInBackend: TestResult;
  wasExecuted: TestResult;
  awinTest: TestResult;
  sovendusDivFound: TestResult;
  sovDivIdInIFrames: TestResult;
  multipleSovIFramesDetected: TestResult;
  sovIFramesAmount: TestResult;
  multipleIFramesAreSame: TestResult;
  flexibleIFrameOnDOM: TestResult;
  isFlexibleIframeExecutable: TestResult;
  isSovendusJsOnDom: TestResult;
  isSovendusJsExecutable: TestResult;

  sovConsumer?: SovApplicationConsumer;
  constructor() {
    const emptyTestResult = new TestResult({
      elementValue: undefined,
      statusCode: StatusCodes.TestDidNotRun,
      statusMessageKey: StatusMessageKeyTypes.empty,
    });
    this.integrationType = emptyTestResult;
    this.browserName = emptyTestResult;
    this.websiteURL = emptyTestResult;
    this.consumerSalutation = emptyTestResult;
    this.consumerFirstName = emptyTestResult;
    this.consumerLastName = emptyTestResult;
    this.consumerYearOfBirth = emptyTestResult;
    this.consumerEmail = emptyTestResult;
    this.consumerEmailHash = emptyTestResult;
    this.consumerStreet = emptyTestResult;
    this.consumerStreetNumber = emptyTestResult;
    this.consumerZipCode = emptyTestResult;
    this.consumerPhone = emptyTestResult;
    this.consumerCity = emptyTestResult;
    this.consumerCountry = emptyTestResult;
    this.trafficSourceNumber = emptyTestResult;
    this.trafficMediumNumber = emptyTestResult;
    this.iframeContainerId = emptyTestResult;
    this.isEnabledInBackend = emptyTestResult;
    this.wasExecuted = emptyTestResult;
    this.awinTest = emptyTestResult;
    this.sovendusDivFound = emptyTestResult;
    this.sovDivIdInIFrames = emptyTestResult;
    this.multipleSovIFramesDetected = emptyTestResult;
    this.sovIFramesAmount = emptyTestResult;
    this.multipleIFramesAreSame = emptyTestResult;
    this.orderCurrency = emptyTestResult;
    this.orderId = emptyTestResult;
    this.orderValue = emptyTestResult;
    this.sessionId = emptyTestResult;
    this.timestamp = emptyTestResult;
    this.usedCouponCode = emptyTestResult;
    this.flexibleIFrameOnDOM = emptyTestResult;
    this.isFlexibleIframeExecutable = emptyTestResult;
    this.isSovendusJsOnDom = emptyTestResult;
    this.isSovendusJsExecutable = emptyTestResult;
  }

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
      this.consumerCountry = this.getConsumerCountryTestResult();
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
      this.executeSovendusJsFilesTests(
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

  getIntegrationType(): TestResult {
    return new TestResult({
      elementValue:
        window.sovIframes?.[0]?.integrationType ||
        (this.awinIntegrationDetected()
          ? `Awin (Merchant ID: ${this.getAwinMerchantId()})`
          : "unknown"),
      statusCode: StatusCodes.Success,
      statusMessageKey: undefined,
    });
  }

  getAwinNotExecutedTestResult(): TestResult {
    this.executeOrderDataTests();

    const statusCode: StatusCodes = StatusCodes.Error;

    let statusMessageKey: StatusMessageKeyTypes;
    // TODO
    // TODO
    // TODO
    // TODO
    // TODO
    // TODO
    let statusMessage = undefined;
    if (this.awinSaleTracked()) {
      statusMessage = `
          <h3 class='sovendus-overlay-error'>
            ERROR: Awin integration detected and a sale has been tracked, but for an unknown reason Sovendus hasn't been executed. 
            A potential cause for the issue could be that the sale has been tracked after the www.dwin1.com/XXXX.js script got executed.
            <a href="https://wiki.awin.com/index.php/Advertiser_Tracking_Guide/Standard_Implementation#Conversion_Tag" target="_blank">
              How to set up sales tracking with Awin?
            </a>  
          </h3>`;
      statusMessageKey = StatusMessageKeyTypes.awinSaleTrackedAfterScript;
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
      statusMessageKey = StatusMessageKeyTypes.awinNoSalesTracked;
    }

    const elementValue: ElementValue = false;

    this.trafficSourceNumber = new TestResult({
      elementValue: window.AWIN?.Tracking?.Sovendus?.trafficSourceNumber,
      statusMessageKey: undefined,
      statusCode: StatusCodes.Success,
    });
    this.trafficMediumNumber = new TestResult({
      elementValue: window.AWIN?.Tracking?.Sovendus?.trafficMediumNumber,
      statusMessageKey: undefined,
      statusCode: StatusCodes.Success,
    });

    return new TestResult({
      elementValue,
      statusMessageKey,
      statusCode,
    });
  }
  getConsumerSalutationTestResult(
    consumer: SovApplicationConsumer
  ): TestResult {
    const valueTestResult: TestResult = this.validValueTestResult(
      consumer.salutation || window.sovConsumer?.consumerSalutation,
      StatusMessageKeyTypes.missingConsumerSalutation,
      StatusMessageKeyTypes.consumerSalutationSuccess
    );
    if (valueTestResult.statusCode === StatusCodes.SuccessButNeedsReview) {
      const validSalutations = ["Mr.", "Mrs."];
      let statusCode: StatusCodes = StatusCodes.SuccessButNeedsReview;
      let statusMessageKey: StatusMessageKeyTypes =
        StatusMessageKeyTypes.consumerSalutationSuccess;
      if (!validSalutations.includes(String(valueTestResult.elementValue))) {
        statusCode = StatusCodes.Error;
        statusMessageKey = StatusMessageKeyTypes.consumerSalutationNotValid;
      }
      return new TestResult({
        elementValue: valueTestResult.elementValue,
        statusMessageKey,
        statusCode,
      });
    }
    return valueTestResult;
  }

  getConsumerFirstNameTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.firstName,
      StatusMessageKeyTypes.missingConsumerFirstName,
      StatusMessageKeyTypes.consumerFirstNameSuccess
    );
  }

  getConsumerLastNameTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.lastName,
      StatusMessageKeyTypes.missingConsumerLastName,
      StatusMessageKeyTypes.consumerLastNameSuccess
    );
  }

  getConsumerYearOfBirthTestResult(
    consumer: SovApplicationConsumer
  ): TestResult {
    const yearOfBirthTestResult: TestResult = this.validValueTestResult(
      consumer.yearOfBirth || window.sovConsumer?.consumerYearOfBirth,
      StatusMessageKeyTypes.missingConsumerYearOfBirth,
      StatusMessageKeyTypes.consumerYearOfBirthSuccess
    );
    if (
      yearOfBirthTestResult.statusCode === StatusCodes.SuccessButNeedsReview
    ) {
      const validFromYear: number = 1890;
      const validToYear: number = 2024;
      let statusCode: StatusCodes = StatusCodes.SuccessButNeedsReview;
      const yearOfBirthNumber: number = Number(
        yearOfBirthTestResult.elementValue
      );
      let statusMessageKey: StatusMessageKeyTypes =
        yearOfBirthTestResult.statusMessageKey;
      if (
        !(yearOfBirthNumber < validToYear && yearOfBirthNumber > validFromYear)
      ) {
        statusCode = StatusCodes.Error;
        statusMessageKey = StatusMessageKeyTypes.consumerYearOfBirthNotValid;
      }
      return new TestResult({
        elementValue: isNaN(yearOfBirthNumber)
          ? yearOfBirthTestResult.elementValue
          : yearOfBirthNumber,
        statusMessageKey,
        statusCode,
      });
    }
    return yearOfBirthTestResult;
  }

  getConsumerEmailTestResult(consumer: SovApplicationConsumer): TestResult {
    const emailTestResult: TestResult = this.validValueTestResult(
      consumer.email,
      StatusMessageKeyTypes.missingConsumerEmail,
      StatusMessageKeyTypes.consumerEmailSuccess
    );
    if (emailTestResult.statusCode === StatusCodes.SuccessButNeedsReview) {
      function validateEmail(email: string) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      }
      const mailIsValid = validateEmail(String(emailTestResult.elementValue));
      let statusCode: StatusCodes = StatusCodes.SuccessButNeedsReview;
      let elementValue: ElementValue = emailTestResult.elementValue;
      let statusMessageKey: StatusMessageKeyTypes =
        StatusMessageKeyTypes.consumerEmailSuccess;
      if (!mailIsValid) {
        statusCode = StatusCodes.Error;
        statusMessageKey = StatusMessageKeyTypes.consumerEmailNotValid;
      }
      return new TestResult({
        elementValue,
        statusMessageKey,
        statusCode,
      });
    }
    return emailTestResult;
  }

  getConsumerEmailHashTestResult(
    consumer: SovApplicationConsumer,
    consumerEmail: TestResult
  ): TestResult {
    let statusCode: StatusCodes = StatusCodes.TestDidNotRun;
    let elementValue: ElementValue = undefined;
    let statusMessageKey: StatusMessageKeyTypes | undefined = undefined;
    if (!consumerEmail.elementValue) {
      const testResult = this.validValueTestResult(
        consumer.emailHash,
        StatusMessageKeyTypes.missingConsumerEmailHash,
        StatusMessageKeyTypes.consumerEmailHashSuccess
      );
      statusCode = testResult.statusCode;
      elementValue = testResult.elementValue;
      if (testResult.statusCode === StatusCodes.SuccessButNeedsReview) {
        const hashIsValid = this.checkIfValidMd5Hash(
          String(testResult.elementValue)
        );
        if (hashIsValid) {
          statusCode = StatusCodes.SuccessButNeedsReview;
          statusMessageKey = StatusMessageKeyTypes.consumerEmailHashSuccess;
        } else {
          statusCode = StatusCodes.Error;
          statusMessageKey = StatusMessageKeyTypes.consumerEmailNotMD5Hash;
        }
      } else if (testResult.statusCode === StatusCodes.Error) {
        statusCode = StatusCodes.Error;
        statusMessageKey = testResult.statusMessageKey;
      }
    }
    return new TestResult({
      elementValue,
      statusMessageKey,
      statusCode,
    });
  }

  checkIfValidMd5Hash(emailHash: string): boolean {
    const regexExp = /^[a-f0-9]{32}$/gi;
    return regexExp.test(emailHash);
  }

  getConsumerStreetTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.street,
      StatusMessageKeyTypes.missingConsumerStreet,
      StatusMessageKeyTypes.consumerStreetSuccess
    );
  }

  getConsumerStreetNumberTestResult(
    consumer: SovApplicationConsumer
  ): TestResult {
    return this.validValueTestResult(
      consumer.streetNumber,
      StatusMessageKeyTypes.missingConsumerStreetNumber,
      StatusMessageKeyTypes.consumerStreetNumberSuccess
    );
  }

  getConsumerZipCodeTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.zipCode,
      StatusMessageKeyTypes.missingConsumerZipCode,
      StatusMessageKeyTypes.consumerZipCodeSuccess
    );
  }

  getConsumerPhoneTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.phone,
      StatusMessageKeyTypes.missingConsumerPhone,
      StatusMessageKeyTypes.consumerPhoneSuccess
    );
  }

  getConsumerCityTestResult(consumer: SovApplicationConsumer): TestResult {
    return this.validValueTestResult(
      consumer.city,
      StatusMessageKeyTypes.missingConsumerCity,
      StatusMessageKeyTypes.consumerCitySuccess
    );
  }

  getConsumerCountryTestResult(): TestResult {
    const valueResult = this.validValueTestResult(
      window.sovConsumer?.consumerCountry ||
        window.sovApplication?.consumer?.country,
      StatusMessageKeyTypes.missingConsumerCountry,
      StatusMessageKeyTypes.consumerCountrySuccess
    );
    let statusCode = valueResult.statusCode;
    let statusMessageKey = valueResult.statusMessageKey;
    if (valueResult.elementValue) {
      const isValidCountry = validCountries.includes(
        String(valueResult.elementValue)
      );
      if (!isValidCountry) {
        statusCode = StatusCodes.Error;
        statusMessageKey = StatusMessageKeyTypes.consumerCountryInvalid;
      }
    }
    return new TestResult({
      elementValue: valueResult.elementValue,
      statusCode,
      statusMessageKey,
    });
  }

  getTrafficSourceNumberTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.trafficSourceNumber,
      StatusMessageKeyTypes.missingTrafficSourceNumber,
      StatusMessageKeyTypes.trafficSourceNumberSuccess
    );
  }

  getTrafficMediumNumberTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.trafficMediumNumber,
      StatusMessageKeyTypes.missingTrafficMediumNumber,
      StatusMessageKeyTypes.trafficMediumNumberSuccess
    );
  }

  getIframeContainerIdTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.iframeContainerId,
      StatusMessageKeyTypes.missingIframeContainerId,
      StatusMessageKeyTypes.iframeContainerIdSuccess
    );
  }

  executeSovendusJsFilesTests(
    wasExecuted: TestResult,
    trafficSourceNumber: TestResult,
    trafficMediumNumber: TestResult
  ) {
    const flexibleIframeJs: HTMLScriptElement | null = document.querySelector(
      '[src$="api.sovendus.com/sovabo/common/js/flexibleIframe.js"]'
    );
    this.flexibleIFrameOnDOM = this.getIsFlexibleIFrameOnDOM(
      wasExecuted,
      trafficSourceNumber,
      trafficMediumNumber,
      flexibleIframeJs
    );
    this.isFlexibleIframeExecutable = this.getIsFlexibleIframeExecutable(
      flexibleIframeJs,
      this.flexibleIFrameOnDOM
    );
    const sovendusJs: HTMLScriptElement | null = document.getElementById(
      "sovloader-script"
    ) as HTMLScriptElement | null;
    this.isSovendusJsOnDom = this.getIsSovendusJsOnDom(
      this.isFlexibleIframeExecutable,
      sovendusJs
    );
    this.isSovendusJsExecutable = this.getIsSovendusJsExecutable(
      this.isSovendusJsOnDom,
      sovendusJs
    );
  }

  getIsFlexibleIFrameOnDOM(
    wasExecuted: TestResult,
    trafficSourceNumber: TestResult,
    trafficMediumNumber: TestResult,
    flexibleIframeJs: HTMLScriptElement | null
  ) {
    let statusCode: StatusCodes;
    let isOnDom: boolean | undefined;
    let statusMessageKey: StatusMessageKeyTypes | undefined;
    if (
      wasExecuted.statusCode === StatusCodes.Error &&
      trafficSourceNumber.statusCode === StatusCodes.Success &&
      trafficMediumNumber.statusCode === StatusCodes.Success
    ) {
      isOnDom = !!flexibleIframeJs;
      if (isOnDom) {
        statusCode = StatusCodes.Success;
        statusMessageKey = undefined;
      } else {
        statusCode = StatusCodes.Error;
        statusMessageKey = StatusMessageKeyTypes.iFrameNotOnDOM;
      }
    } else {
      statusCode = StatusCodes.TestDidNotRun;
      statusMessageKey = undefined;
      isOnDom = undefined;
    }
    return new TestResult({
      elementValue: isOnDom,
      statusMessageKey,
      statusCode,
    });
  }

  getIsFlexibleIframeExecutable(
    flexibleIframeJs: HTMLScriptElement,
    flexibleIFrameOnDOM: TestResult
  ): TestResult {
    if (flexibleIFrameOnDOM.statusCode === StatusCodes.Success) {
      const isExecutable = flexibleIframeJs.type === "text/javascript";
      if (isExecutable) {
        return new TestResult({
          elementValue: isExecutable,
          statusCode: StatusCodes.Success,
          statusMessageKey: undefined,
        });
      }
      return new TestResult({
        elementValue: isExecutable,
        statusCode: StatusCodes.Error,
        statusMessageKey:
          StatusMessageKeyTypes.flexibleIframeJsBlockedByCookieConsent,
      });
    }
    return new TestResult({
      elementValue: undefined,
      statusCode: StatusCodes.TestDidNotRun,
      statusMessageKey: undefined,
    });
  }

  getIsSovendusJsOnDom(
    isFlexibleIframeExecutable: TestResult,
    sovendusJs: HTMLScriptElement | null
  ) {
    if (!isFlexibleIframeExecutable) {
      return new TestResult({
        elementValue: undefined,
        statusCode: StatusCodes.TestDidNotRun,
        statusMessageKey: undefined,
      });
    }
    if (sovendusJs) {
      return new TestResult({
        elementValue: true,
        statusCode: StatusCodes.Success,
        statusMessageKey: undefined,
      });
    }
    return new TestResult({
      statusMessageKey: StatusMessageKeyTypes.flexibleIframeJsExecutedTooEarly,
      statusCode: StatusCodes.Error,
      elementValue: false,
    });
  }

  getIsSovendusJsExecutable(
    isSovendusJsOnDom: TestResult,
    sovendusJs: HTMLScriptElement | null
  ) {
    if (isSovendusJsOnDom) {
      const isExecutable =
        sovendusJs.type === "text/javascript" || sovendusJs.type === null;
      if (isExecutable) {
        return new TestResult({
          elementValue: isExecutable,
          statusMessageKey:
            StatusMessageKeyTypes.unknownErrorIntegrationScriptFailed,
          statusCode: StatusCodes.Error,
        });
      } else {
        return new TestResult({
          elementValue: sovendusJs.type,
          statusCode: StatusCodes.Error,
          statusMessageKey:
            StatusMessageKeyTypes.sovendusJsBlockedByCookieConsent,
        });
      }
    } else {
      return new TestResult({
        elementValue: undefined,
        statusCode: StatusCodes.TestDidNotRun,
        statusMessageKey: undefined,
      });
    }
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
      statusMessageKey: undefined,
      statusCode: wasExecuted
        ? StatusCodes.SuccessButNeedsReview
        : StatusCodes.Error,
    });
  }

  getIsEnabledInBackendTestResult(wasExecuted: TestResult): TestResult {
    let statusCode: StatusCodes = StatusCodes.TestDidNotRun;
    let isEnabled: boolean | undefined = undefined;
    let statusMessageKey: StatusMessageKeyTypes;
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
        statusMessageKey = StatusMessageKeyTypes.sovendusBannerDisabled;
      }
    }
    return new TestResult({
      elementValue: isEnabled,
      statusMessageKey,
      statusCode,
    });
  }

  getSovDivIdInIFramesTestResult(sovIFramesAmount: TestResult): TestResult {
    const elementValue: boolean = Boolean(
      window.sovIframes?.[0]?.iframeContainerId
    );
    let statusCode: StatusCodes = StatusCodes.Success;
    let statusMessageKey: StatusMessageKeyTypes;
    if ((elementValue && sovIFramesAmount.elementValue) || 0 > 0) {
      statusCode = StatusCodes.Error;
      statusMessageKey = StatusMessageKeyTypes.noiframeContainerId;
    }
    return new TestResult({
      elementValue,
      statusMessageKey,
      statusCode,
    });
  }

  getSovendusDivFoundTestResult(
    sovDivIdInIframes: TestResult,
    iframeContainerId: TestResult
  ): TestResult {
    if (sovDivIdInIframes.elementValue) {
      const sovendusDivFound: boolean =
        sovDivIdInIframes.statusCode === StatusCodes.Success &&
        Boolean(
          typeof iframeContainerId.elementValue === "string" &&
            document.getElementById(iframeContainerId.elementValue)
        );
      if (sovendusDivFound) {
        return new TestResult({
          elementValue: sovendusDivFound,
          statusMessageKey: undefined,
          statusCode: StatusCodes.Success,
        });
      } else {
        return new TestResult({
          elementValue: iframeContainerId.elementValue,
          statusMessageKey: StatusMessageKeyTypes.containerDivNotFoundOnDOM,
          statusCode: StatusCodes.Error,
        });
      }
    } else {
      return new TestResult({
        elementValue: undefined,
        statusMessageKey: undefined,
        statusCode: StatusCodes.TestDidNotRun,
      });
    }
  }

  getMultipleSovIFramesDetectedTestResult(
    sovIframesAmount: TestResult
  ): TestResult {
    const multipleSovIframesDetected =
      Number(sovIframesAmount.elementValue) > 1;
    return new TestResult({
      elementValue: multipleSovIframesDetected,
      statusMessageKey: undefined,
      statusCode: multipleSovIframesDetected
        ? StatusCodes.Error
        : StatusCodes.Success,
    });
  }

  getSovIFramesAmountTestResult(): TestResult {
    const sovIframesAmount = window.sovIframes?.length;
    return new TestResult({
      elementValue: sovIframesAmount,
      statusMessageKey: undefined,
      statusCode:
        sovIframesAmount === 1 ? StatusCodes.Success : StatusCodes.Error,
    });
  }

  getMultipleIFramesAreSameTestResult(
    multipleSovIframesDetected: TestResult,
    sovIframesAmount: TestResult
  ): TestResult {
    let multipleIframesAreSame = true;
    if (multipleSovIframesDetected.statusCode === StatusCodes.Error) {
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

      return new TestResult({
        elementValue: sovIframesAmount.elementValue,
        statusMessageKey: multipleIframesAreSame
          ? StatusMessageKeyTypes.multipleSovIframesDetectedAndAreSame
          : StatusMessageKeyTypes.multipleSovIframesDetected,
        statusCode:
          multipleSovIframesDetected.elementValue && multipleIframesAreSame
            ? StatusCodes.Error
            : StatusCodes.Success,
      });
    } else {
      return new TestResult({
        elementValue: undefined,
        statusCode: StatusCodes.TestDidNotRun,
        statusMessageKey: undefined,
      });
    }
  }
  getOrderCurrencyTestResult(): TestResult {
    const valueTestResult: TestResult = this.validValueTestResult(
      window.sovIframes?.[0]?.orderCurrency,
      StatusMessageKeyTypes.currencyMissing,
      StatusMessageKeyTypes.currencySuccess
    );
    if (valueTestResult.statusCode === StatusCodes.Success) {
      const isValidCurrency = validCurrencies.includes(
        String(valueTestResult.elementValue)
      );
      let statusMessageKey: StatusMessageKeyTypes =
        StatusMessageKeyTypes.currencySuccess;
      let statusCode: StatusCodes = StatusCodes.Success;
      if (!isValidCurrency) {
        statusMessageKey = StatusMessageKeyTypes.currencyNotValid;
        statusCode = StatusCodes.Error;
      }
      return new TestResult({
        elementValue: valueTestResult.elementValue,
        statusMessageKey,
        statusCode,
      });
    }
    return valueTestResult;
  }

  getOrderIdTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.orderId,
      StatusMessageKeyTypes.missingOrderId,
      StatusMessageKeyTypes.orderIdSuccess
    );
  }

  getOrderValueTestResult(): TestResult {
    return this.validNumberTestResult(window.sovIframes?.[0]?.orderValue);
  }

  getSessionIdTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.sessionId,
      StatusMessageKeyTypes.missingSessionId,
      StatusMessageKeyTypes.sessionIdSuccess
    );
  }

  getTimestampTestResult(): TestResult {
    return this.validUnixTimeTestResult(window.sovIframes?.[0]?.timestamp);
  }

  getUsedCouponCodeTestResult(): TestResult {
    return this.validValueTestResult(
      window.sovIframes?.[0]?.usedCouponCode,
      StatusMessageKeyTypes.missingCouponCode,
      StatusMessageKeyTypes.couponCodeSuccess
    );
  }

  validValueTestResult(
    value: ElementValue,
    missingErrorMessageKey: StatusMessageKeyTypes,
    successMessageKey: StatusMessageKeyTypes
  ): TestResult {
    let elementValue: ElementValue = undefined;
    let statusCode: StatusCodes = StatusCodes.Error;
    let statusMessageKey: StatusMessageKeyTypes;
    if (value && value !== "undefined") {
      statusCode = StatusCodes.SuccessButNeedsReview;
      elementValue = decodeURIComponent(decodeURI(String(value)));
      statusMessageKey = successMessageKey;
    } else {
      statusMessageKey = missingErrorMessageKey;
    }
    return new TestResult({
      elementValue,
      statusMessageKey,
      statusCode,
    });
  }

  validNumberTestResult(value: ElementValue): TestResult {
    const decodedValue: TestResult = this.validValueTestResult(
      value,
      StatusMessageKeyTypes.orderValueMissing,
      StatusMessageKeyTypes.orderValueSuccess
    );
    let statusCode: StatusCodes = StatusCodes.Error;
    let statusMessageKey: StatusMessageKeyTypes;
    if (decodedValue.statusCode === StatusCodes.Success) {
      if (isNaN(Number(decodedValue.elementValue))) {
        statusMessageKey = StatusMessageKeyTypes.orderValueWrongFormat;
        statusCode = StatusCodes.Error;
      } else {
        statusCode = StatusCodes.Success;
        statusMessageKey = StatusMessageKeyTypes.orderValueSuccess;
      }
    } else {
      statusMessageKey = StatusMessageKeyTypes.orderValueWrongFormat;
      statusCode = StatusCodes.Error;
    }
    return new TestResult({
      elementValue: decodedValue.elementValue,
      statusMessageKey,
      statusCode,
    });
  }

  validUnixTimeTestResult(value: ElementValue): TestResult {
    const decodedValue: TestResult = this.validValueTestResult(
      value,
      StatusMessageKeyTypes.unixTimestampMissing,
      undefined
    );
    let statusCode: StatusCodes = StatusCodes.Error;
    let isUnixTime = false;
    let statusMessageKey: StatusMessageKeyTypes;
    if (decodedValue.statusCode === StatusCodes.Success) {
      const truncatedTime = Math.floor(Number(decodedValue.elementValue));
      isUnixTime =
        !isNaN(truncatedTime) &&
        [13, 10].includes(truncatedTime.toString().length);
      if (isUnixTime) {
        statusCode = StatusCodes.Success;
      } else {
        statusMessageKey = StatusMessageKeyTypes.notAUnixTimestamp;
        statusCode = StatusCodes.Error;
      }
    } else {
      statusMessageKey = StatusMessageKeyTypes.unixTimestampMissing;
      statusCode = StatusCodes.Error;
    }
    return new TestResult({
      elementValue: decodedValue.elementValue,
      statusMessageKey,
      statusCode,
    });
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

  getBrowserName(): TestResult {
    let browser: string;
    let statusCode: StatusCodes = StatusCodes.Success;
    if (navigator.userAgent.indexOf("iPhone") != -1) {
      browser = "iPhone";
    } else if (navigator.userAgent.indexOf("Android") != -1) {
      browser = "Android";
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      browser = "Firefox";
    } else if (navigator.userAgent.indexOf("Edg") != -1) {
      browser = "Edge";
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      browser = "Chrome";
    } else {
      browser = "Not detected";
      statusCode = StatusCodes.Error;
    }
    return new TestResult({
      elementValue: browser,
      statusCode,
      statusMessageKey: undefined,
    });
  }

  getWebsiteURL(): TestResult {
    return new TestResult({
      elementValue: window.location.href,
      statusCode: StatusCodes.Success,
      statusMessageKey: undefined,
    });
  }

  getTestResultResponseData(): TestResultResponseDataType {
    return {
      integrationType: this.integrationType,
      browserName: this.browserName,
      websiteURL: this.websiteURL,
      ...(this.consumerSalutation.statusCode !== StatusCodes.TestDidNotRun
        ? { consumerSalutation: this.consumerSalutation }
        : {}),
      ...(this.consumerFirstName.statusCode !== StatusCodes.TestDidNotRun
        ? { consumerFirstName: this.consumerFirstName }
        : {}),
      ...(this.consumerLastName.statusCode !== StatusCodes.TestDidNotRun
        ? { consumerLastName: this.consumerLastName }
        : {}),
      ...(this.consumerYearOfBirth.statusCode !== StatusCodes.TestDidNotRun
        ? { consumerYearOfBirth: this.consumerYearOfBirth }
        : {}),
      ...(this.consumerEmail.statusCode !== StatusCodes.TestDidNotRun
        ? { consumerEmail: this.consumerEmail }
        : {}),
      ...(this.consumerEmailHash.statusCode !== StatusCodes.TestDidNotRun
        ? { consumerEmailHash: this.consumerEmailHash }
        : {}),
      ...(this.consumerStreet.statusCode !== StatusCodes.TestDidNotRun
        ? { consumerStreet: this.consumerStreet }
        : {}),
      ...(this.consumerStreetNumber.statusCode !== StatusCodes.TestDidNotRun
        ? { consumerStreetNumber: this.consumerStreetNumber }
        : {}),
      ...(this.consumerZipCode.statusCode !== StatusCodes.TestDidNotRun
        ? { consumerZipCode: this.consumerZipCode }
        : {}),
      ...(this.consumerPhone.statusCode !== StatusCodes.TestDidNotRun
        ? { consumerPhone: this.consumerPhone }
        : {}),
      ...(this.consumerCity.statusCode !== StatusCodes.TestDidNotRun
        ? { consumerCity: this.consumerCity }
        : {}),
      ...(this.consumerCountry.statusCode !== StatusCodes.TestDidNotRun
        ? { consumerCountry: this.consumerCountry }
        : {}),
      ...(this.trafficSourceNumber.statusCode !== StatusCodes.TestDidNotRun
        ? { trafficSourceNumber: this.trafficSourceNumber }
        : {}),
      ...(this.trafficMediumNumber.statusCode !== StatusCodes.TestDidNotRun
        ? { trafficMediumNumber: this.trafficMediumNumber }
        : {}),
      ...(this.orderCurrency.statusCode !== StatusCodes.TestDidNotRun
        ? { orderCurrency: this.orderCurrency }
        : {}),
      ...(this.orderId.statusCode !== StatusCodes.TestDidNotRun
        ? { orderId: this.orderId }
        : {}),
      ...(this.orderValue.statusCode !== StatusCodes.TestDidNotRun
        ? { orderValue: this.orderValue }
        : {}),
      ...(this.sessionId.statusCode !== StatusCodes.TestDidNotRun
        ? { sessionId: this.sessionId }
        : {}),
      ...(this.timestamp.statusCode !== StatusCodes.TestDidNotRun
        ? { timestamp: this.timestamp }
        : {}),
      ...(this.usedCouponCode.statusCode !== StatusCodes.TestDidNotRun
        ? { usedCouponCode: this.usedCouponCode }
        : {}),
      ...(this.iframeContainerId.statusCode !== StatusCodes.TestDidNotRun
        ? { iframeContainerId: this.iframeContainerId }
        : {}),
      ...(this.isEnabledInBackend.statusCode !== StatusCodes.TestDidNotRun
        ? { isEnabledInBackend: this.isEnabledInBackend }
        : {}),
      ...(this.wasExecuted.statusCode !== StatusCodes.TestDidNotRun
        ? { wasExecuted: this.wasExecuted }
        : {}),
      ...(this.awinTest.statusCode !== StatusCodes.TestDidNotRun
        ? { awinTest: this.awinTest }
        : {}),
      ...(this.sovendusDivFound.statusCode !== StatusCodes.TestDidNotRun
        ? { sovendusDivFound: this.sovendusDivFound }
        : {}),
      ...(this.sovDivIdInIFrames.statusCode !== StatusCodes.TestDidNotRun
        ? { sovDivIdInIFrames: this.sovDivIdInIFrames }
        : {}),
      ...(this.multipleSovIFramesDetected.statusCode !==
      StatusCodes.TestDidNotRun
        ? { multipleSovIFramesDetected: this.multipleSovIFramesDetected }
        : {}),
      ...(this.sovIFramesAmount.statusCode !== StatusCodes.TestDidNotRun
        ? { sovIFramesAmount: this.sovIFramesAmount }
        : {}),
      ...(this.multipleIFramesAreSame.statusCode !== StatusCodes.TestDidNotRun
        ? { multipleIFramesAreSame: this.multipleIFramesAreSame }
        : {}),
      ...(this.flexibleIFrameOnDOM.statusCode !== StatusCodes.TestDidNotRun
        ? { flexibleIFrameOnDOM: this.flexibleIFrameOnDOM }
        : {}),
      ...(this.isFlexibleIframeExecutable.statusCode !==
      StatusCodes.TestDidNotRun
        ? { isFlexibleIframeExecutable: this.isFlexibleIframeExecutable }
        : {}),
      ...(this.isSovendusJsOnDom.statusCode !== StatusCodes.TestDidNotRun
        ? { isSovendusJsOnDom: this.isSovendusJsOnDom }
        : {}),
      ...(this.isSovendusJsExecutable.statusCode !== StatusCodes.TestDidNotRun
        ? { isSovendusJsExecutable: this.isSovendusJsExecutable }
        : {}),
    };
  }
}

class TestResult {
  elementValue: ElementValue;
  statusMessageKey: StatusMessageKeyTypes;
  statusCode: StatusCodes;

  constructor({
    elementValue,
    statusMessageKey,
    statusCode,
  }: {
    elementValue: ElementValue;
    statusMessageKey: StatusMessageKeyTypes;
    statusCode: StatusCodes;
  }) {
    this.elementValue = elementValue;
    this.statusMessageKey = statusMessageKey;
    this.statusCode = statusCode;
  }

  getFormattedStatusMessage(): string {
    try {
      if (this.statusCode === StatusCodes.Success) {
        return (
          String(this.elementValue ? this.elementValue : "") +
          this.getCheckMarkWithLabel()
        );
      }
      if (this.statusCode === StatusCodes.SuccessButNeedsReview) {
        return `${String(
          this.elementValue ? this.elementValue : ""
        )}${this.getInfoMarkWithLabel(
          this.replaceElementValueInMessage(
            statusMessages[this.statusMessageKey].infoText
          )
        )}`;
      }
      if (this.statusCode === StatusCodes.Error) {
        return `${String(
          this.elementValue ? this.elementValue : ""
        )}<span class='sovendus-overlay-error' >${
          statusMessages[this.statusMessageKey].errorText
        }</span>${this.getInfoMarkWithLabel(
          this.replaceElementValueInMessage(
            statusMessages[this.statusMessageKey].infoText
          )
        )}`;
      }
      return "";
    } catch (error) {
      throw new Error(
        "getFormattedStatusMessage() crashed: " +
          error +
          "\n\nElementValue: " +
          this.elementValue +
          "\nStatusCode: " +
          this.statusCode +
          "\nStatusMessageKey: " +
          this.statusMessageKey
      );
    }
  }

  getFormattedGeneralStatusMessage(): string {
    if (this.statusCode === StatusCodes.Error) {
      return `<li><h3 class='sovendus-overlay-error'>${this.replaceElementValueInMessage(
        statusMessages[this.statusMessageKey].errorText
      )}</h3></li>`;
    }
    return "";
  }

  private replaceElementValueInMessage(message: string) {
    return message.replace(/{elementValue}/g, String(this.elementValue));
  }

  private getCheckMarkWithLabel(): string {
    return `
      <span style="position:relative">
        <img style="height:18px;width:auto;margin-bottom: -4px" class="sovendus-check-mark"
         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAS5AAAEuQER4c0nAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAcZJREFUWIXtlT1Lw1AUht+bFOql+A8qCO4Blzalgwo6pLX+AWdxaC1UcHBzlULVdHDzF+jg1+RgoEJSSpfugiJdO2mr9OM6WEqa5japjRmk73jP4T4P54RcYJZZfEqsEKOyKmdxBMF8LvoBV1Ql2BSalwCyYRpeqEfrd9DAfBFQVCXYQOMKQLJ/tGyWID7DzbkoN8o7fyYQK8RoT+xdg2CD0/IodISkwClODw/0bsbAS1SkW/q+3vJ8AgM4sD4GntDS2jsAeCowKdxTgd/ARwTix/H5Nm2fM5EdVtKVNw/hWifYSVZ3q01rYfARSnkp1KbtWwKyLXSFknwiL3oEL1GRpuzgQH8CUl4KzQXn7gnIiqn2Srpk1cgZL1PCR8Y+JNC/5AFA3FpkYM9MZGt263Az9tZXa7N2UPvgwQFA0HP6J4CqrR3Ikt06XMCfqEhTTvAfBgAwkGgxegogy+kbrMMlXBk39lEBlxIAEgDOvIIPC/Ql5KKsMrAMp78DIMCpudq5NcNvAQEz9owsAJXTz4O73rk19n9C53VY4RON3VnAvcRU8PECzhJTw50F+BKewN0JjEp4Bp8sDCSiRjJSXgr5C57lv+cbJ0juWerPx1oAAAAASUVORK5CYII=" />
      </span>
    `;
  }

  private getInfoMarkWithLabel(
    labelText: string,
    isWarning: boolean = true
  ): string {
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
}

export interface SovConsumer {
  consumerSalutation?: "Mr." | "Mrs." | "";
  consumerFirstName?: string;
  consumerLastName?: string;
  consumerYearOfBirth?: number;
  consumerEmail?: string;
  consumerEmailHash?: string;
  consumerPhone?: string;
  consumerStreet?: string;
  consumerStreetNumber?: string;
  consumerZipcode?: string;
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
    zipCode: sovConsumer.consumerZipcode,
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

export interface SovIframes {
  trafficSourceNumber?: number | string;
  trafficMediumNumber?: number | string;
  sessionId?: string;
  timestamp?: number | string;
  orderId?: string;
  orderValue?: number | string;
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
