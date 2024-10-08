import {
  sovendusOverlayErrorClass,
  tooltipButtonClass,
  tooltipClass,
} from "./self-test-overlay-css-vars.js";
import type {
  ElementValue,
  TestResultResponseDataType,
} from "./self-tester-data-to-sync-with-dev-hub.js";
import {
  BrowserTypes,
  StatusCodes,
  StatusMessageKeyTypes,
  statusMessages,
  validCountries,
  validCurrencies,
} from "./self-tester-data-to-sync-with-dev-hub.js";

export default class SelfTester {
  integrationType: TestResultType<string>;
  browserName: TestResultType<BrowserTypes>;
  websiteURL: TestResultType<string>;
  consumerSalutation: TestResultType<string | undefined>;
  consumerFirstName: TestResultType<string | undefined>;
  consumerLastName: TestResultType<string | undefined>;
  consumerYearOfBirth: TestResultType<string | undefined>;
  consumerEmail: TestResultType<string | undefined>;
  consumerEmailHash: TestResultType<string | undefined>;
  consumerStreet: TestResultType<string | undefined>;
  consumerStreetNumber: TestResultType<string | undefined>;
  consumerZipCode: TestResultType<string | undefined>;
  consumerPhone: TestResultType<string | undefined>;
  consumerCity: TestResultType<string | undefined>;
  consumerCountry: TestResultType<string | undefined>;
  trafficSourceNumber: TestResultType<string | undefined>;
  trafficMediumNumber: TestResultType<string | undefined>;
  orderCurrency: TestResultType<string | undefined>;
  orderId: TestResultType<string | undefined>;
  orderValue: TestResultType<string | undefined>;
  sessionId: TestResultType<string | undefined>;
  timestamp: TestResultType<string | undefined>;
  usedCouponCode: TestResultType<string | undefined>;
  iFrameContainerId: TestResultType<string | undefined>;
  isEnabledInBackend: TestResultType<boolean | undefined>;
  wasExecuted: TestResultType<boolean>;
  sovendusDivFound: TestResultType<boolean | string | undefined>;
  multipleSovIFramesDetected: TestResultType<boolean | undefined>;
  sovIFramesAmount: TestResultType<number | undefined>;
  multipleIFramesAreSame: TestResultType<number | undefined>;
  flexibleIFrameOnDOM: TestResultType<boolean | undefined>;
  isFlexibleIFrameExecutable: TestResultType<boolean | string | undefined>;
  isSovendusJsOnDom: TestResultType<boolean | undefined>;
  isSovendusJsExecutable: TestResultType<boolean | string | undefined>;
  isUnknownSovendusJsError: TestResultType<boolean | undefined>;

  awinIntegrationDetectedTestResult: TestResultType<boolean>;
  awinSaleTrackedTestResult: TestResultType<boolean>;
  awinExecutedTestResult: TestResultType<boolean | undefined>;

  sovConsumer?: SovApplicationConsumer;

  selfTestIntegration(): void {
    const awinIntegrationDetectedTestResult =
      this.executeIntegrationTypeTestResults();
    this.browserName = this.getBrowserName();
    this.websiteURL = this.getWebsiteURL();

    const trafficSourceNumber = (this.trafficSourceNumber =
      this.getTrafficSourceNumberTestResult());
    const trafficMediumNumber = (this.trafficMediumNumber =
      this.getTrafficMediumNumberTestResult());

    const wasExecuted = (this.wasExecuted = this.getWasExecutedTestResult(
      trafficSourceNumber,
      trafficMediumNumber,
    ));

    const sovConsumer = (this.sovConsumer = this.getSovConsumerData());

    if (awinIntegrationDetectedTestResult.elementValue) {
      this.executeAwinTests(
        wasExecuted,
        trafficSourceNumber,
        trafficMediumNumber,
      );
    } else {
      this.executeConsumerDataTests(sovConsumer);
      this.executeOrderDataTests();
      this.executeGeneralTests(
        wasExecuted,
        trafficSourceNumber,
        trafficMediumNumber,
      );
    }
    // if (window.transmitTestResult !== false) {
    //   void this.transmitTestResult();
    // }
  }

  getSovConsumerData(): MergedSovConsumer {
    return {
      salutation:
        window.sovApplication?.consumer?.salutation ||
        window.sovConsumer?.consumerSalutation,
      firstName:
        window.sovConsumer?.consumerFirstName === undefined
          ? window.sovApplication?.consumer?.firstName || undefined
          : window.sovConsumer.consumerFirstName,
      lastName:
        window.sovConsumer?.consumerLastName === undefined
          ? window.sovApplication?.consumer?.lastName || undefined
          : window.sovConsumer.consumerLastName,
      yearOfBirth:
        window.sovConsumer?.consumerYearOfBirth === undefined
          ? window.sovApplication?.consumer?.yearOfBirth || undefined
          : window.sovConsumer.consumerYearOfBirth,
      email:
        window.sovConsumer?.consumerEmail === undefined
          ? window.sovApplication?.consumer?.email || undefined
          : window.sovConsumer.consumerEmail,
      emailHash:
        window.sovConsumer?.consumerEmailHash === undefined
          ? window.sovApplication?.consumer?.emailHash || undefined
          : window.sovConsumer.consumerEmailHash,
      street:
        window.sovConsumer?.consumerStreet === undefined
          ? window.sovApplication?.consumer?.street || undefined
          : window.sovConsumer.consumerStreet,
      streetNumber:
        window.sovConsumer?.consumerStreetNumber === undefined
          ? window.sovApplication?.consumer?.streetNumber || undefined
          : window.sovConsumer.consumerStreetNumber,
      zipCode:
        window.sovConsumer?.consumerZipcode === undefined
          ? window.sovApplication?.consumer?.zipCode || undefined
          : window.sovConsumer.consumerZipcode,
      city:
        window.sovConsumer?.consumerCity === undefined
          ? window.sovApplication?.consumer?.city || undefined
          : window.sovConsumer.consumerCity,
      country: window.sovConsumer?.consumerCountry,
      phone:
        window.sovConsumer?.consumerPhone === undefined
          ? window.sovApplication?.consumer?.phone || undefined
          : window.sovConsumer.consumerPhone,
    };
  }

  executeConsumerDataTests(sovConsumer: MergedSovConsumer): void {
    this.consumerSalutation = this.getConsumerSalutationTestResult(sovConsumer);
    this.consumerFirstName = this.getConsumerFirstNameTestResult(sovConsumer);
    this.consumerLastName = this.getConsumerLastNameTestResult(sovConsumer);
    this.consumerYearOfBirth =
      this.getConsumerYearOfBirthTestResult(sovConsumer);
    const consumerEmail = (this.consumerEmail =
      this.getConsumerEmailTestResult(sovConsumer));
    this.consumerEmailHash = this.getConsumerEmailHashTestResult(
      sovConsumer,
      consumerEmail,
    );
    this.consumerStreet = this.getConsumerStreetTestResult(sovConsumer);
    this.consumerStreetNumber =
      this.getConsumerStreetNumberTestResult(sovConsumer);
    this.consumerZipCode = this.getConsumerZipCodeTestResult(sovConsumer);
    this.consumerPhone = this.getConsumerPhoneTestResult(sovConsumer);
    this.consumerCity = this.getConsumerCityTestResult(sovConsumer);
    this.consumerCountry = this.getConsumerCountryTestResult(sovConsumer);
  }

  executeOrderDataTests(withSessionIdAndTimestamp: boolean = true): void {
    this.orderCurrency = this.getOrderCurrencyTestResult();
    this.orderId = this.getOrderIdTestResult();
    this.orderValue = this.getOrderValueTestResult();
    if (withSessionIdAndTimestamp) {
      this.sessionId = this.getSessionIdTestResult();
      this.timestamp = this.getTimestampTestResult();
    }
    this.usedCouponCode = this.getUsedCouponCodeTestResult();
  }

  executeGeneralTests(
    wasExecuted: TestResultType<boolean>,
    trafficSourceNumber: TestResultType<string | undefined>,
    trafficMediumNumber: TestResultType<string | undefined>,
  ): void {
    this.isEnabledInBackend = this.getIsEnabledInBackendTestResult(wasExecuted);
    const sovIFramesAmount = (this.sovIFramesAmount =
      this.getSovIFramesAmountTestResult());
    const iFrameContainerId = (this.iFrameContainerId =
      this.getIframeContainerIdTestResult(sovIFramesAmount));
    this.sovendusDivFound =
      this.getSovendusDivFoundTestResult(iFrameContainerId);
    const multipleSovIFramesDetected = (this.multipleSovIFramesDetected =
      this.getMultipleSovIFramesDetectedTestResult(sovIFramesAmount));
    this.multipleIFramesAreSame = this.getMultipleIFramesAreSameTestResult(
      multipleSovIFramesDetected,
      sovIFramesAmount,
    );
    this.executeSovendusJsFilesTests(
      wasExecuted,
      trafficSourceNumber,
      trafficMediumNumber,
    );
  }

  executeIntegrationTypeTestResults(): TestResultType<boolean> {
    const valueTestResult = this.validValueTestResult({
      value: window.sovIframes?.[0]?.integrationType,
      malformedMessageKey: StatusMessageKeyTypes.integrationTypeMalformed,
      missingErrorMessageKey: StatusMessageKeyTypes.integrationTypeMissing,
      successMessageKey: StatusMessageKeyTypes.empty,
    });

    this.awinIntegrationDetectedTestResult =
      this.getAwinIntegrationDetectedTestResult(valueTestResult);
    if (this.awinIntegrationDetected() && !valueTestResult.elementValue) {
      this.integrationType = new SuccessTestResult<string>({
        elementValue: `Awin (Merchant ID: ${this.getAwinMerchantId()})`,
      });
      return this.awinIntegrationDetectedTestResult;
    }
    if (valueTestResult.statusCode === StatusCodes.SuccessButNeedsReview) {
      this.integrationType = new SuccessTestResult<string>({
        elementValue: valueTestResult.elementValue as string,
      });
      return this.awinIntegrationDetectedTestResult;
    }
    this.integrationType = new WarningOrFailTestResult<string>({
      elementValue: valueTestResult.elementValue || "unknown",
      statusCode: valueTestResult.statusCode,
      statusMessageKey: valueTestResult.statusMessageKey,
    });
    return this.awinIntegrationDetectedTestResult;
  }

  executeAwinTests(
    wasExecuted: TestResultType<boolean>,
    trafficSourceNumber: TestResultType<string | undefined>,
    trafficMediumNumber: TestResultType<string | undefined>,
  ): void {
    const awinSaleTrackedTestResult = (this.awinSaleTrackedTestResult =
      this.getAwinSaleTrackedTestResult());

    if (awinSaleTrackedTestResult.elementValue) {
      const awinExecutedTestResult = (this.awinExecutedTestResult =
        this.getAwinExecutedTestResult(awinSaleTrackedTestResult));
      if (awinExecutedTestResult.elementValue) {
        this.executeOrderDataTests(false);
        this.executeGeneralTests(
          wasExecuted,
          trafficSourceNumber,
          trafficMediumNumber,
        );
      }
    }
  }

  getAwinIntegrationDetectedTestResult(
    integrationTypeTestResult: TestResultType<string | undefined>,
  ): TestResultType<boolean> {
    return new SuccessTestResult({
      elementValue:
        this.awinIntegrationDetected() &&
        !integrationTypeTestResult.elementValue,
    });
  }

  getAwinSaleTrackedTestResult(): TestResultType<boolean> {
    const saleTracked = !!window.AWIN?.Tracking?.Sale;
    if (saleTracked) {
      return new SuccessTestResult({
        elementValue: true,
      });
    }
    return new WarningOrFailTestResult({
      elementValue: false,
      statusCode: StatusCodes.Error,
      statusMessageKey: StatusMessageKeyTypes.awinNoSalesTracked,
    });
  }

  getAwinExecutedTestResult(
    awinSaleTrackedTestResult: TestResultType<boolean>,
  ): TestResultType<boolean | undefined> {
    const sovIframesExists = !!window.sovIframes;
    if (awinSaleTrackedTestResult.elementValue) {
      if (sovIframesExists) {
        return new SuccessTestResult({
          elementValue: true,
        });
      }
      return new WarningOrFailTestResult({
        elementValue: false,
        statusCode: StatusCodes.Error,
        statusMessageKey: StatusMessageKeyTypes.awinSaleTrackedAfterScript,
      });
    }
    return new DidNotRunTestResult();
  }

  getConsumerSalutationTestResult(
    consumer: MergedSovConsumer,
  ): TestResultType<string | undefined> {
    const valueTestResult = this.validValueTestResult({
      value: consumer.salutation,
      missingErrorMessageKey: StatusMessageKeyTypes.missingConsumerSalutation,
      successMessageKey: StatusMessageKeyTypes.consumerSalutationSuccess,
      malformedMessageKey: StatusMessageKeyTypes.consumerSalutationNotValid,
    });
    if (valueTestResult.statusCode === StatusCodes.SuccessButNeedsReview) {
      const validSalutations = ["Mr.", "Mrs."];
      let statusCode: StatusCodes = StatusCodes.SuccessButNeedsReview;
      let statusMessageKey: StatusMessageKeyTypes =
        StatusMessageKeyTypes.consumerSalutationSuccess;
      if (!validSalutations.includes(String(valueTestResult.elementValue))) {
        statusCode = StatusCodes.Error;
        statusMessageKey = StatusMessageKeyTypes.consumerSalutationNotValid;
      }
      return new WarningOrFailTestResult<string | undefined>({
        elementValue: valueTestResult.elementValue,
        statusMessageKey,
        statusCode,
      });
    }
    return valueTestResult;
  }

  getConsumerFirstNameTestResult(
    consumer: SovApplicationConsumer,
  ): TestResultType<string | undefined> {
    return this.validValueTestResult({
      value: consumer.firstName,
      missingErrorMessageKey: StatusMessageKeyTypes.missingConsumerFirstName,
      successMessageKey: StatusMessageKeyTypes.consumerFirstNameSuccess,
      malformedMessageKey: StatusMessageKeyTypes.consumerFirstNameMalformed,
    });
  }

  getConsumerLastNameTestResult(
    consumer: SovApplicationConsumer,
  ): TestResultType<string | undefined> {
    return this.validValueTestResult({
      value: consumer.lastName,
      missingErrorMessageKey: StatusMessageKeyTypes.missingConsumerLastName,
      successMessageKey: StatusMessageKeyTypes.consumerLastNameSuccess,
      malformedMessageKey: StatusMessageKeyTypes.consumerLastNameMalformed,
    });
  }

  getConsumerYearOfBirthTestResult(
    consumer: SovApplicationConsumer,
  ): TestResultType<string | undefined> {
    const valueTestResult = this.validValueTestResult({
      value: consumer.yearOfBirth || window.sovConsumer?.consumerYearOfBirth,
      missingErrorMessageKey: StatusMessageKeyTypes.missingConsumerYearOfBirth,
      successMessageKey: StatusMessageKeyTypes.consumerYearOfBirthSuccess,
      malformedMessageKey: StatusMessageKeyTypes.consumerYearOfBirthNotValid,
      numberCheckType: {
        floatNumbersAllowed: false,
        numbersInStringsAllowed: true,
        numberTypeAllowed: true,
      },
    });
    if (valueTestResult.statusCode === StatusCodes.SuccessButNeedsReview) {
      const validFromYear: number = 1890;
      const validToYear: number = 2024;
      let statusCode: StatusCodes = StatusCodes.SuccessButNeedsReview;
      const yearOfBirthNumber: number = Number(valueTestResult.elementValue);
      let statusMessageKey: StatusMessageKeyTypes =
        valueTestResult.statusMessageKey;
      if (
        !(yearOfBirthNumber < validToYear && yearOfBirthNumber > validFromYear)
      ) {
        statusCode = StatusCodes.Error;
        statusMessageKey = StatusMessageKeyTypes.consumerYearOfBirthNotValid;
      }
      return new WarningOrFailTestResult<string | undefined>({
        elementValue: valueTestResult.elementValue,
        statusMessageKey,
        statusCode,
      });
    }
    return valueTestResult;
  }

  getConsumerEmailTestResult(
    consumer: SovApplicationConsumer,
  ): TestResultType<string | undefined> {
    const emailTestResult = this.validValueTestResult({
      value: consumer.email,
      missingErrorMessageKey: StatusMessageKeyTypes.missingConsumerEmail,
      successMessageKey: StatusMessageKeyTypes.consumerEmailSuccess,
      malformedMessageKey: StatusMessageKeyTypes.consumerEmailNotValid,
    });
    if (emailTestResult.statusCode === StatusCodes.SuccessButNeedsReview) {
      const mailIsValid = validateEmail(String(emailTestResult.elementValue));
      let statusCode: StatusCodes = StatusCodes.SuccessButNeedsReview;
      const elementValue: ElementValue = emailTestResult.elementValue;
      let statusMessageKey: StatusMessageKeyTypes =
        StatusMessageKeyTypes.consumerEmailSuccess;
      if (!mailIsValid) {
        statusCode = StatusCodes.Error;
        statusMessageKey = StatusMessageKeyTypes.consumerEmailNotValid;
      }
      return new WarningOrFailTestResult<string | undefined>({
        elementValue,
        statusMessageKey,
        statusCode,
      });
    }
    return emailTestResult;
  }

  getConsumerEmailHashTestResult(
    consumer: SovApplicationConsumer,
    consumerEmail: TestResultType<string | undefined>,
  ): TestResultType<string | undefined> {
    let statusMessageKey: StatusMessageKeyTypes;
    if (consumerEmail.elementValue) {
      return new DidNotRunTestResult<string | undefined>();
    }
    const testResult = this.validValueTestResult({
      value: consumer.emailHash,
      missingErrorMessageKey: StatusMessageKeyTypes.missingConsumerEmailHash,
      successMessageKey: StatusMessageKeyTypes.consumerEmailHashSuccess,
      malformedMessageKey: StatusMessageKeyTypes.consumerEmailNotMD5Hash,
    });
    let statusCode = testResult.statusCode;
    const elementValue = testResult.elementValue;
    statusMessageKey = testResult.statusMessageKey;
    if (testResult.statusCode === StatusCodes.SuccessButNeedsReview) {
      const hashIsValid = this.checkIfValidMd5Hash(
        String(testResult.elementValue),
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
    return new WarningOrFailTestResult<string | undefined>({
      elementValue,
      statusMessageKey,
      statusCode,
    });
  }

  checkIfValidMd5Hash(emailHash: string): boolean {
    const regexExp = /^[a-f0-9]{32}$/gi;
    return regexExp.test(emailHash);
  }

  getConsumerStreetTestResult(
    consumer: SovApplicationConsumer,
  ): TestResultType<string | undefined> {
    return this.validValueTestResult({
      value: consumer.street,
      missingErrorMessageKey: StatusMessageKeyTypes.missingConsumerStreet,
      successMessageKey: StatusMessageKeyTypes.consumerStreetSuccess,
      malformedMessageKey: StatusMessageKeyTypes.consumerStreetMalformed,
    });
  }

  getConsumerStreetNumberTestResult(
    consumer: SovApplicationConsumer,
  ): TestResultType<string | undefined> {
    return this.validValueTestResult({
      value: consumer.streetNumber,
      missingErrorMessageKey: StatusMessageKeyTypes.missingConsumerStreetNumber,
      successMessageKey: StatusMessageKeyTypes.consumerStreetNumberSuccess,
      malformedMessageKey: StatusMessageKeyTypes.consumerStreetNumberMalformed,
      numberCheckType: {
        numbersInStringsAllowed: true,
      },
    });
  }

  getConsumerZipCodeTestResult(
    consumer: SovApplicationConsumer,
  ): TestResultType<string | undefined> {
    return this.validValueTestResult({
      value: consumer.zipCode,
      missingErrorMessageKey: StatusMessageKeyTypes.missingConsumerZipCode,
      successMessageKey: StatusMessageKeyTypes.consumerZipCodeSuccess,
      malformedMessageKey: StatusMessageKeyTypes.consumerZipCodeMalformed,
      numberCheckType: {
        floatNumbersAllowed: false,
        numbersInStringsAllowed: true,
        numberTypeAllowed: true,
      },
    });
  }

  getConsumerPhoneTestResult(
    consumer: SovApplicationConsumer,
  ): TestResultType<string | undefined> {
    return this.validValueTestResult({
      value: consumer.phone,
      missingErrorMessageKey: StatusMessageKeyTypes.missingConsumerPhone,
      successMessageKey: StatusMessageKeyTypes.consumerPhoneSuccess,
      malformedMessageKey: StatusMessageKeyTypes.consumerPhoneMalformed,
      numberCheckType: {
        floatNumbersAllowed: false,
        numbersInStringsAllowed: true,
        numberTypeAllowed: false,
      },
    });
  }

  getConsumerCityTestResult(
    consumer: SovApplicationConsumer,
  ): TestResultType<string | undefined> {
    return this.validValueTestResult({
      value: consumer.city,
      missingErrorMessageKey: StatusMessageKeyTypes.missingConsumerCity,
      successMessageKey: StatusMessageKeyTypes.consumerCitySuccess,
      malformedMessageKey: StatusMessageKeyTypes.consumerCityMalformed,
    });
  }

  getConsumerCountryTestResult(
    consumer: SovApplicationConsumer,
  ): TestResultType<string | undefined> {
    const valueResult = this.validValueTestResult({
      value: consumer.country,
      missingErrorMessageKey: StatusMessageKeyTypes.missingConsumerCountry,
      successMessageKey: StatusMessageKeyTypes.consumerCountrySuccess,
      malformedMessageKey: StatusMessageKeyTypes.consumerCountryInvalid,
    });
    let statusCode = valueResult.statusCode;
    let statusMessageKey = valueResult.statusMessageKey;
    if (valueResult.elementValue) {
      const isValidCountry = validCountries.includes(
        String(valueResult.elementValue),
      );
      if (!isValidCountry) {
        statusCode = StatusCodes.Error;
        statusMessageKey = StatusMessageKeyTypes.consumerCountryInvalid;
      }
    }
    return new WarningOrFailTestResult({
      elementValue: valueResult.elementValue,
      statusCode,
      statusMessageKey,
    });
  }

  getTrafficSourceNumberTestResult(): TestResultType<string | undefined> {
    return this.validValueTestResult({
      value:
        window.sovIframes?.[0]?.trafficSourceNumber !== undefined
          ? window.sovIframes[0].trafficSourceNumber
          : window.AWIN?.Tracking?.Sovendus?.trafficSourceNumber,
      missingErrorMessageKey: StatusMessageKeyTypes.missingTrafficSourceNumber,
      successMessageKey: StatusMessageKeyTypes.trafficSourceNumberSuccess,
      malformedMessageKey: StatusMessageKeyTypes.trafficSourceNumberMalformed,
      numberCheckType: {
        floatNumbersAllowed: false,
        numbersInStringsAllowed: true,
        numberTypeAllowed: true,
      },
    });
  }

  getTrafficMediumNumberTestResult(): TestResultType<string | undefined> {
    return this.validValueTestResult({
      value:
        window.sovIframes?.[0]?.trafficMediumNumber !== undefined
          ? window.sovIframes[0].trafficMediumNumber
          : window.AWIN?.Tracking?.Sovendus?.trafficMediumNumber,
      missingErrorMessageKey: StatusMessageKeyTypes.missingTrafficMediumNumber,
      successMessageKey: StatusMessageKeyTypes.trafficMediumNumberSuccess,
      malformedMessageKey: StatusMessageKeyTypes.trafficMediumNumberMalformed,
      numberCheckType: {
        floatNumbersAllowed: false,
        numbersInStringsAllowed: true,
        numberTypeAllowed: true,
      },
    });
  }

  getIframeContainerIdTestResult(
    sovIFramesAmount: TestResultType<number | undefined>,
  ): TestResultType<string | undefined> {
    if (sovIFramesAmount.statusCode === StatusCodes.TestDidNotRun) {
      return new DidNotRunTestResult<string | undefined>();
    }
    const valueTestResult = this.validValueTestResult({
      value: window.sovIframes?.[0]?.iframeContainerId,
      missingErrorMessageKey: StatusMessageKeyTypes.missingIframeContainerId,
      malformedMessageKey: StatusMessageKeyTypes.iFrameContainerIdMalformed,
      successMessageKey: StatusMessageKeyTypes.empty,
    });
    const decodedValue =
      valueTestResult.elementValue &&
      decodeURIComponent(decodeURI(valueTestResult.elementValue));
    if (decodedValue?.includes(" ")) {
      return new WarningOrFailTestResult<string | undefined>({
        elementValue: decodedValue,
        statusCode: StatusCodes.Error,
        statusMessageKey: StatusMessageKeyTypes.iFrameContainerIdHasSpaces,
      });
    }
    if (valueTestResult.statusCode === StatusCodes.SuccessButNeedsReview) {
      return new SuccessTestResult({
        elementValue: valueTestResult.elementValue,
      });
    }
    return valueTestResult;
  }

  executeSovendusJsFilesTests(
    wasExecuted: TestResultType<boolean>,
    trafficSourceNumber: TestResultType<string | undefined>,
    trafficMediumNumber: TestResultType<string | undefined>,
  ): void {
    if (
      wasExecuted.statusCode === StatusCodes.Error &&
      trafficSourceNumber.statusCode === StatusCodes.SuccessButNeedsReview &&
      trafficMediumNumber.statusCode === StatusCodes.SuccessButNeedsReview
    ) {
      const flexibleIFrameJs: HTMLScriptElement | null =
        document.querySelector(
          '[src$="api.sovendus.com/sovabo/common/js/flexibleIframe.js"]',
        ) ||
        document.querySelector(
          '[src$="testing4.sovendus.com/sovabo/common/js/flexibleIframe.js"]',
        );
      const flexibleIFrameOnDOM = (this.flexibleIFrameOnDOM =
        this.getIsFlexibleIFrameOnDOMTestResult(flexibleIFrameJs));
      const isFlexibleIFrameExecutable = (this.isFlexibleIFrameExecutable =
        this.getIsFlexibleIFrameExecutable(
          flexibleIFrameJs,
          flexibleIFrameOnDOM,
        ));
      const sovendusJs: HTMLScriptElement | null = document.getElementById(
        "sovloader-script",
      ) as HTMLScriptElement | null;
      const isSovendusJsOnDom = (this.isSovendusJsOnDom =
        this.getIsSovendusJsOnDom(
          isFlexibleIFrameExecutable,
          flexibleIFrameOnDOM,
          sovendusJs,
        ));
      const isSovendusJsExecutable = (this.isSovendusJsExecutable =
        this.getIsSovendusJsExecutable(isSovendusJsOnDom, sovendusJs));
      this.isUnknownSovendusJsError =
        this.getIsUnknownSovendusJsErrorTestResult({
          wasExecuted,
          flexibleIFrameOnDOM,
          isFlexibleIFrameExecutable,
          isSovendusJsOnDom,
          isSovendusJsExecutable,
        });
    }
  }

  getIsUnknownSovendusJsErrorTestResult({
    wasExecuted,
    flexibleIFrameOnDOM,
    isFlexibleIFrameExecutable,
    isSovendusJsOnDom,
    isSovendusJsExecutable,
  }: {
    wasExecuted: TestResultType<boolean>;
    flexibleIFrameOnDOM: TestResultType<boolean | undefined>;
    isFlexibleIFrameExecutable: TestResultType<boolean | string | undefined>;
    isSovendusJsOnDom: TestResultType<boolean | undefined>;
    isSovendusJsExecutable: TestResultType<boolean | string | undefined>;
  }): TestResultType<boolean | undefined> {
    if (
      wasExecuted.statusCode === StatusCodes.Error &&
      flexibleIFrameOnDOM.statusCode === StatusCodes.Success &&
      isFlexibleIFrameExecutable.statusCode === StatusCodes.Success &&
      isSovendusJsOnDom.statusCode === StatusCodes.Success &&
      isSovendusJsExecutable.statusCode === StatusCodes.Success
    ) {
      return new WarningOrFailTestResult<boolean | undefined>({
        elementValue: false,
        statusMessageKey:
          StatusMessageKeyTypes.unknownErrorIntegrationScriptFailed,
        statusCode: StatusCodes.Error,
      });
    }
    return new DidNotRunTestResult<boolean | undefined>();
  }

  getIsFlexibleIFrameOnDOMTestResult(
    flexibleIFrameJs: HTMLScriptElement | null,
  ): TestResultType<boolean | undefined> {
    const isOnDom: boolean = !!flexibleIFrameJs;
    if (isOnDom) {
      return new SuccessTestResult<boolean | undefined>({
        elementValue: isOnDom,
      });
    }
    return new WarningOrFailTestResult<boolean | undefined>({
      elementValue: isOnDom,
      statusMessageKey: StatusMessageKeyTypes.iFrameNotOnDOM,
      statusCode: StatusCodes.Error,
    });
  }

  getIsFlexibleIFrameExecutable(
    flexibleIFrameJs: HTMLScriptElement | null,
    flexibleIFrameOnDOM: TestResultType<boolean | undefined>,
  ): TestResultType<boolean | string | undefined> {
    if (
      flexibleIFrameOnDOM.statusCode === StatusCodes.Success &&
      flexibleIFrameJs
    ) {
      const isExecutable =
        flexibleIFrameJs.type === "text/javascript" ||
        flexibleIFrameJs.type === "";
      if (isExecutable) {
        return new SuccessTestResult<boolean | undefined>({
          elementValue: isExecutable,
        });
      }
      return new WarningOrFailTestResult<boolean | string | undefined>({
        elementValue: flexibleIFrameJs.type,
        statusCode: StatusCodes.Error,
        statusMessageKey:
          StatusMessageKeyTypes.flexibleIFrameJsBlockedByCookieConsent,
      });
    }
    return new DidNotRunTestResult<boolean | undefined>();
  }

  getIsSovendusJsOnDom(
    isFlexibleIFrameExecutable: TestResultType<boolean | string | undefined>,
    flexibleIFrameOnDOM: TestResultType<boolean | undefined>,
    sovendusJs: HTMLScriptElement | null,
  ): TestResultType<boolean | undefined> {
    if (
      flexibleIFrameOnDOM.statusCode === StatusCodes.Error ||
      isFlexibleIFrameExecutable.statusCode === StatusCodes.Error
    ) {
      return new DidNotRunTestResult<boolean | undefined>();
    }
    if (sovendusJs) {
      return new SuccessTestResult({
        elementValue: true,
      });
    }
    return new WarningOrFailTestResult({
      statusMessageKey: StatusMessageKeyTypes.sovendusJsMissing,
      statusCode: StatusCodes.Error,
      elementValue: false,
    });
  }

  getIsSovendusJsExecutable(
    isSovendusJsOnDom: TestResultType<boolean | undefined>,
    sovendusJs: HTMLScriptElement | null,
  ): TestResultType<boolean | string | undefined> {
    if (isSovendusJsOnDom.statusCode === StatusCodes.Success && sovendusJs) {
      const isExecutable =
        sovendusJs.type === "text/javascript" ||
        sovendusJs.type === null ||
        sovendusJs.type === "";
      if (isExecutable) {
        return new SuccessTestResult<boolean | undefined>({
          elementValue: isExecutable,
        });
      }
      return new WarningOrFailTestResult<string | undefined>({
        elementValue: sovendusJs.type,
        statusCode: StatusCodes.Error,
        statusMessageKey:
          StatusMessageKeyTypes.sovendusJsBlockedByCookieConsent,
      });
    }
    return new DidNotRunTestResult<boolean | string | undefined>();
  }

  getWasExecutedTestResult(
    trafficSourceNumber: TestResultType<string | undefined>,
    trafficMediumNumber: TestResultType<string | undefined>,
  ): TestResultType<boolean> {
    const wasExecuted =
      (trafficSourceNumber.statusCode === StatusCodes.SuccessButNeedsReview &&
        trafficMediumNumber.statusCode === StatusCodes.SuccessButNeedsReview &&
        window.sovApplication &&
        !!window.sovApplication?.instances?.length) ||
      false;
    if (wasExecuted) {
      // eslint-disable-next-line no-console
      console.log("Sovendus was executed");
      return new SuccessTestResult<boolean>({
        elementValue: true,
      });
    }
    // eslint-disable-next-line no-console
    console.log("Sovendus was detected but not executed");
    return new WarningOrFailTestResultWithoutStatusMessageKey<boolean>({
      elementValue: wasExecuted,
      statusCode: StatusCodes.Error,
    });
  }

  getIsEnabledInBackendTestResult(
    wasExecuted: TestResultType<boolean>,
  ): TestResultType<boolean | undefined> {
    if (wasExecuted.statusCode === StatusCodes.Success) {
      const isEnabled = window.sovApplication?.instances?.some(
        (instance) =>
          Object.keys(instance.config?.overlay || {}).length > 0 ||
          Object.keys(instance.config?.stickyBanner || {}).length > 0 ||
          instance?.banner?.bannerExists,
      );
      if (isEnabled) {
        return new SuccessTestResult({
          elementValue: true,
        });
      }
      return new WarningOrFailTestResult({
        elementValue: isEnabled,
        statusMessageKey: StatusMessageKeyTypes.sovendusBannerDisabled,
        statusCode: StatusCodes.Error,
      });
    }
    return new DidNotRunTestResult<boolean | undefined>();
  }

  getSovendusDivFoundTestResult(
    iFrameContainerId: TestResultType<string | undefined>,
  ): TestResultType<boolean | string | undefined> {
    if (
      iFrameContainerId.statusCode === StatusCodes.Success &&
      iFrameContainerId.elementValue
    ) {
      const sovendusDivFound: boolean = Boolean(
        document.getElementById(iFrameContainerId.elementValue),
      );
      if (sovendusDivFound) {
        return new SuccessTestResult({
          elementValue: sovendusDivFound,
        });
      }
      return new WarningOrFailTestResult({
        elementValue: iFrameContainerId.elementValue,
        statusMessageKey: StatusMessageKeyTypes.containerDivNotFoundOnDOM,
        statusCode: StatusCodes.Error,
      });
    }
    return new DidNotRunTestResult<boolean | string | undefined>();
  }

  getMultipleSovIFramesDetectedTestResult(
    sovIframesAmount: TestResultType<number | undefined>,
  ): TestResultType<boolean | undefined> {
    if (
      sovIframesAmount.statusCode === StatusCodes.TestDidNotRun ||
      !sovIframesAmount.elementValue
    ) {
      return new DidNotRunTestResult<boolean | undefined>();
    }
    const multipleSovIframesDetected = sovIframesAmount.elementValue > 1;
    if (multipleSovIframesDetected) {
      return new WarningOrFailTestResultWithoutStatusMessageKey({
        elementValue: multipleSovIframesDetected,
        statusCode: StatusCodes.Error,
      });
    }
    return new SuccessTestResult({
      elementValue: multipleSovIframesDetected,
    });
  }

  getSovIFramesAmountTestResult(): TestResultType<number | undefined> {
    const sovIframesAmount = window.sovIframes?.length
      ? window.sovIframes.length
      : 0;
    if (sovIframesAmount === 1) {
      return new SuccessTestResult({
        elementValue: sovIframesAmount,
      });
    }
    return new WarningOrFailTestResultWithoutStatusMessageKey({
      elementValue: sovIframesAmount,
      statusCode: StatusCodes.Error,
    });
  }

  getMultipleIFramesAreSameTestResult(
    multipleSovIframesDetected: TestResultType<boolean | undefined>,
    sovIframesAmount: TestResultType<number | undefined>,
  ): TestResultType<number | undefined> {
    if (multipleSovIframesDetected.statusCode === StatusCodes.Error) {
      let prevSovIframe: SovIframes | undefined = undefined;
      const multipleIFramesAreSame = window.sovIframes?.every((sovIframe) => {
        const isTheSame = prevSovIframe
          ? sovIframe.trafficSourceNumber ===
              prevSovIframe.trafficSourceNumber &&
            sovIframe.trafficMediumNumber ===
              prevSovIframe.trafficMediumNumber &&
            sovIframe.sessionId === prevSovIframe.sessionId &&
            sovIframe.orderId === prevSovIframe.orderId &&
            sovIframe.orderValue === prevSovIframe.orderValue &&
            sovIframe.orderCurrency === prevSovIframe.orderCurrency &&
            sovIframe.usedCouponCode === prevSovIframe.usedCouponCode &&
            sovIframe.iframeContainerId === prevSovIframe.iframeContainerId
          : true;
        prevSovIframe = sovIframe;
        return isTheSame;
      });
      return new WarningOrFailTestResult({
        elementValue: sovIframesAmount.elementValue,
        statusMessageKey: multipleIFramesAreSame
          ? StatusMessageKeyTypes.multipleSovIframesDetectedAndAreSame
          : StatusMessageKeyTypes.multipleSovIframesDetected,
        statusCode: StatusCodes.Error,
      });
    }
    return new DidNotRunTestResult<number | undefined>();
  }
  getOrderCurrencyTestResult(): TestResultType<string | undefined> {
    const valueTestResult = this.validValueTestResult({
      value: window.sovIframes?.[0]?.orderCurrency,
      missingErrorMessageKey: StatusMessageKeyTypes.currencyMissing,
      successMessageKey: StatusMessageKeyTypes.currencySuccess,
      malformedMessageKey: StatusMessageKeyTypes.currencyNotValid,
    });
    if (valueTestResult.statusCode === StatusCodes.SuccessButNeedsReview) {
      const isValidCurrency = validCurrencies.includes(
        String(valueTestResult.elementValue),
      );
      let statusMessageKey: StatusMessageKeyTypes;
      let statusCode: StatusCodes;
      if (isValidCurrency) {
        statusMessageKey = StatusMessageKeyTypes.currencySuccess;
        statusCode = StatusCodes.SuccessButNeedsReview;
      } else {
        statusMessageKey = StatusMessageKeyTypes.currencyNotValid;
        statusCode = StatusCodes.Error;
      }
      return new WarningOrFailTestResult<string | undefined>({
        elementValue: valueTestResult.elementValue,
        statusMessageKey,
        statusCode,
      });
    }
    return valueTestResult;
  }

  getOrderIdTestResult(): TestResultType<string | undefined> {
    return this.validValueTestResult({
      value: window.sovIframes?.[0]?.orderId,
      missingErrorMessageKey: StatusMessageKeyTypes.missingOrderId,
      successMessageKey: StatusMessageKeyTypes.orderIdSuccess,
      malformedMessageKey: StatusMessageKeyTypes.orderIdMalformed,
      numberCheckType: {
        numbersInStringsAllowed: true,
      },
    });
  }

  getOrderValueTestResult(): TestResultType<string | undefined> {
    const decodedValue = this.validValueTestResult({
      value: window.sovIframes?.[0]?.orderValue,
      missingErrorMessageKey: StatusMessageKeyTypes.orderValueMissing,
      successMessageKey: StatusMessageKeyTypes.orderValueSuccess,
      malformedMessageKey: StatusMessageKeyTypes.orderValueWrongFormat,
      numberCheckType: {
        floatNumbersAllowed: true,
        numbersInStringsAllowed: true,
        numberTypeAllowed: true,
      },
    });
    let statusCode: StatusCodes = decodedValue.statusCode;
    let statusMessageKey: StatusMessageKeyTypes = decodedValue.statusMessageKey;
    if (decodedValue.statusCode === StatusCodes.SuccessButNeedsReview) {
      if (isNaN(Number(decodedValue.elementValue))) {
        statusMessageKey = StatusMessageKeyTypes.orderValueWrongFormat;
        statusCode = StatusCodes.Error;
      } else {
        statusCode = StatusCodes.SuccessButNeedsReview;
        statusMessageKey = StatusMessageKeyTypes.orderValueSuccess;
      }
    }
    return new WarningOrFailTestResult({
      elementValue: decodedValue.elementValue,
      statusMessageKey,
      statusCode,
    });
  }

  getSessionIdTestResult(): TestResultType<string | undefined> {
    return this.validValueTestResult({
      value: window.sovIframes?.[0]?.sessionId,
      missingErrorMessageKey: StatusMessageKeyTypes.missingSessionId,
      successMessageKey: StatusMessageKeyTypes.sessionIdSuccess,
      malformedMessageKey: StatusMessageKeyTypes.sessionIdMalformed,
    });
  }

  getTimestampTestResult(): TestResultType<string | undefined> {
    const valueTestResult = this.validValueTestResult({
      value: window.sovIframes?.[0]?.timestamp,
      missingErrorMessageKey: StatusMessageKeyTypes.unixTimestampMissing,
      malformedMessageKey: StatusMessageKeyTypes.notAUnixTimestamp,
      successMessageKey: StatusMessageKeyTypes.empty,
      numberCheckType: {
        floatNumbersAllowed: true,
        numbersInStringsAllowed: true,
        numberTypeAllowed: true,
      },
    });
    let statusMessageKey: StatusMessageKeyTypes =
      valueTestResult.statusMessageKey;
    let statusCode: StatusCodes = valueTestResult.statusCode;
    if (valueTestResult.statusCode === StatusCodes.SuccessButNeedsReview) {
      const truncatedTime = Math.floor(Number(valueTestResult.elementValue));
      let isUnixTime = false;
      let timestampInMilliSeconds = truncatedTime;

      // Check if the timestamp is in seconds (10 digits) or milliseconds (13 digits)
      if (!isNaN(truncatedTime)) {
        if (truncatedTime.toString().length === 10) {
          timestampInMilliSeconds = truncatedTime * 1000;
          isUnixTime = true;
        } else if (truncatedTime.toString().length === 13) {
          isUnixTime = true;
        }
      }
      if (isUnixTime) {
        // Check if the timestamp is older than 1 minute
        const currentTime = Date.now();
        const timeDifference = currentTime - timestampInMilliSeconds;
        const oneMinutesInMilliSeconds = 2 * 60 * 1000;

        if (timeDifference > oneMinutesInMilliSeconds) {
          statusMessageKey =
            StatusMessageKeyTypes.unixTimestampOlderThan2Minutes;
          return new WarningOrFailTestResult({
            elementValue: valueTestResult.elementValue,
            statusMessageKey,
            statusCode: StatusCodes.Error,
          });
        }
        return new SuccessTestResult({
          elementValue: valueTestResult.elementValue,
        });
      }
      statusCode = StatusCodes.Error;
      statusMessageKey = StatusMessageKeyTypes.notAUnixTimestamp;
    }
    return new WarningOrFailTestResult({
      elementValue: valueTestResult.elementValue,
      statusMessageKey,
      statusCode: statusCode,
    });
  }

  getUsedCouponCodeTestResult(): TestResultType<string | undefined> {
    return this.validValueTestResult({
      value: window.sovIframes?.[0]?.usedCouponCode,
      missingErrorMessageKey: StatusMessageKeyTypes.missingCouponCode,
      successMessageKey: StatusMessageKeyTypes.couponCodeSuccess,
      malformedMessageKey: StatusMessageKeyTypes.couponCodeMalformed,
      numberCheckType: {
        numbersInStringsAllowed: true,
      },
    });
  }

  validValueTestResult({
    value,
    missingErrorMessageKey,
    successMessageKey,
    malformedMessageKey,
    numberCheckType,
  }: {
    value: ExplicitAnyType;
    missingErrorMessageKey: StatusMessageKeyTypes;
    successMessageKey: StatusMessageKeyTypes;
    malformedMessageKey: StatusMessageKeyTypes;
    numberCheckType?: {
      numberTypeAllowed?: boolean;
      numbersInStringsAllowed?: boolean;
      floatNumbersAllowed?: boolean;
    };
  }): WarningOrFailTestResult<string | undefined> {
    let elementValue: string | undefined;
    let statusCode: StatusCodes;
    let statusMessageKey: StatusMessageKeyTypes | undefined;
    if (
      value !== undefined &&
      value !== "undefined" &&
      value !== null &&
      value !== "null" &&
      value !== ""
    ) {
      if (typeof value === "object") {
        statusCode = StatusCodes.Error;
        statusMessageKey = malformedMessageKey;
        elementValue = JSON.stringify(value);
      } else if (typeof value === "boolean") {
        statusCode = StatusCodes.Error;
        statusMessageKey = malformedMessageKey;
        elementValue = value ? "true" : "false";
      } else if (typeof value === "number") {
        if (numberCheckType?.numberTypeAllowed) {
          if (Number.isInteger(value)) {
            statusCode = StatusCodes.SuccessButNeedsReview;
            statusMessageKey = successMessageKey;
          } else if (numberCheckType?.floatNumbersAllowed) {
            statusCode = StatusCodes.SuccessButNeedsReview;
            statusMessageKey = successMessageKey;
          } else {
            statusCode = StatusCodes.Error;
            statusMessageKey = malformedMessageKey;
          }
        } else {
          statusCode = StatusCodes.Error;
          statusMessageKey = malformedMessageKey;
        }
        elementValue = `${value}`;
      } else if (!isNaN(Number(value))) {
        if (numberCheckType?.numbersInStringsAllowed) {
          if (Number.isInteger(Number(value))) {
            statusCode = StatusCodes.SuccessButNeedsReview;
            statusMessageKey = successMessageKey;
          } else if (numberCheckType?.floatNumbersAllowed) {
            statusCode = StatusCodes.SuccessButNeedsReview;
            statusMessageKey = successMessageKey;
          } else {
            statusCode = StatusCodes.Error;
            statusMessageKey = malformedMessageKey;
          }
        } else {
          statusCode = StatusCodes.Error;
          statusMessageKey = malformedMessageKey;
        }
        elementValue = `${value}`;
      } else if (typeof value === "string") {
        if (
          encodeURI(encodeURIComponent("[object Object]")) === value ||
          encodeURI("[object Object]") === value
        ) {
          statusCode = StatusCodes.Error;
          statusMessageKey = malformedMessageKey;
          elementValue = "[object-Object]";
        } else if (value === "true" || value === "false") {
          statusCode = StatusCodes.Error;
          statusMessageKey = malformedMessageKey;
          elementValue = value === "true" ? "true" : "false";
        } else if (
          numberCheckType?.numbersInStringsAllowed &&
          !isNaN(Number(value.replace(",", ".")))
        ) {
          statusCode = StatusCodes.Error;
          statusMessageKey = malformedMessageKey;
          elementValue = value;
        } else if (
          numberCheckType?.numbersInStringsAllowed &&
          !isNaN(Number(decodeURIComponent(decodeURI(value)).replace(",", ".")))
        ) {
          statusCode = StatusCodes.Error;
          statusMessageKey = malformedMessageKey;
          elementValue = decodeURIComponent(decodeURI(value));
        } else {
          statusCode = StatusCodes.SuccessButNeedsReview;
          elementValue = value;
          statusMessageKey = successMessageKey;
        }
      } else {
        statusCode = StatusCodes.Error;
        statusMessageKey = malformedMessageKey;
        elementValue = `${value}`;
      }
    } else {
      statusMessageKey = missingErrorMessageKey;
      elementValue = undefined;
      statusCode = StatusCodes.Error;
    }
    return new WarningOrFailTestResult<string | undefined>({
      elementValue,
      statusMessageKey,
      statusCode,
    });
  }

  sovIframesOrConsumerExists(): boolean {
    return Boolean(window.sovIframes || window.sovConsumer);
  }

  sovApplicationExists(): boolean {
    return !!window.sovApplication?.consumer;
  }

  getAwinMerchantId(): number | string {
    return window.AWIN?.Tracking?.iMerchantId || "not available";
  }

  sovInstancesLoaded(): boolean {
    return !!window.sovApplication?.instances?.find(
      (instance) =>
        instance.banner?.bannerExists ||
        instance.collapsableOverlayClosingType ||
        instance.stickyBanner?.bannerExists,
    );
  }

  awinIntegrationDetected(): boolean {
    return Boolean(window.AWIN?.Tracking?.Sovendus?.trafficMediumNumber);
  }

  async waitForSovendusIntegrationDetected(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log("No Sovendus integration detected yet");
    while (
      !(this.sovIframesOrConsumerExists() || this.awinIntegrationDetected())
    ) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    // eslint-disable-next-line no-console
    console.log("Sovendus has been detected");
  }

  async waitForSovendusIntegrationToBeLoaded(): Promise<void> {
    // let waitedSeconds = 0;
    // while (!this.sovIframesOrConsumerExists()) {
    //   if (waitedSeconds > 5 && this.awinIntegrationDetected()) {
    //     return; // continue with awin diagnostics
    //   }
    //   waitedSeconds += 0.5;
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    // }
    await this.waitForSovApplicationObject();
  }

  async waitForSovApplicationObject(): Promise<void> {
    let waitedSeconds = 0;
    while (!this.sovApplicationExists() && waitedSeconds < 5) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      waitedSeconds += 0.5;
    }
    if (this.sovApplicationExists()) {
      await this.waitForBannerToBeLoaded();
    }
  }

  async waitForBannerToBeLoaded(): Promise<void> {
    let waitedSeconds = 0;
    while (!this.sovInstancesLoaded() && waitedSeconds < 4) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      waitedSeconds += 0.5;
    }
    // wait a bit longer, just in case multiple integrations fire later
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // eslint-disable-next-line no-console
    console.log("Sovendus banner loaded");
  }

  getBrowserName(): TestResultType<BrowserTypes> {
    let browser: BrowserTypes;
    if (navigator.userAgent.includes("iPhone")) {
      browser = BrowserTypes.iPhone;
    } else if (navigator.userAgent.includes("Android")) {
      browser = BrowserTypes.Android;
    } else if (navigator.userAgent.includes("Firefox")) {
      browser = BrowserTypes.Firefox;
    } else if (navigator.userAgent.includes("Edg")) {
      browser = BrowserTypes.Edge;
    } else if (navigator.userAgent.includes("Chrome")) {
      browser = BrowserTypes.Chrome;
    } else {
      return new WarningOrFailTestResult<BrowserTypes>({
        elementValue: BrowserTypes.NotDetected,
        statusCode: StatusCodes.Error,
        statusMessageKey: StatusMessageKeyTypes.failedToDetectBrowserType,
      });
    }
    return new SuccessTestResult<BrowserTypes>({
      elementValue: browser,
    });
  }

  getWebsiteURL(): TestResultType<string> {
    return new SuccessTestResult({
      elementValue: window.location.href,
    });
  }

  // async transmitTestResult(): Promise<void> {
  //   try {
  //     await fetch("http://localhost:3000/api/testing-plugin", {
  //       method: "POST",
  //       mode: "no-cors",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(this.getTestResultResponseData()),
  //     });
  //   } catch (e) {
  //     // eslint-disable-next-line no-console
  //     console.error("Failed to transmit sovendus test result - error:", e);
  //   }
  // }

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
      ...(this.iFrameContainerId.statusCode !== StatusCodes.TestDidNotRun
        ? { iFrameContainerId: this.iFrameContainerId }
        : {}),
      ...(this.isEnabledInBackend.statusCode !== StatusCodes.TestDidNotRun
        ? { isEnabledInBackend: this.isEnabledInBackend }
        : {}),
      ...(this.wasExecuted.statusCode !== StatusCodes.TestDidNotRun
        ? { wasExecuted: this.wasExecuted }
        : {}),
      ...(this.isUnknownSovendusJsError.statusCode !== StatusCodes.TestDidNotRun
        ? { isUnknownSovendusJsError: this.isUnknownSovendusJsError }
        : {}),
      ...(this.sovendusDivFound.statusCode !== StatusCodes.TestDidNotRun
        ? { sovendusDivFound: this.sovendusDivFound }
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
      ...(this.isFlexibleIFrameExecutable.statusCode !==
      StatusCodes.TestDidNotRun
        ? { isFlexibleIFrameExecutable: this.isFlexibleIFrameExecutable }
        : {}),
      ...(this.isSovendusJsOnDom.statusCode !== StatusCodes.TestDidNotRun
        ? { isSovendusJsOnDom: this.isSovendusJsOnDom }
        : {}),
      ...(this.isSovendusJsExecutable.statusCode !== StatusCodes.TestDidNotRun
        ? { isSovendusJsExecutable: this.isSovendusJsExecutable }
        : {}),
    };
  }

  constructor() {
    const emptyStringUndefinedTestResult = new DidNotRunTestResult<
      string | undefined
    >();
    const emptyStringTestResult = new DidNotRunTestResult<string>();
    const emptyBooleanUndefinedTestResult = new DidNotRunTestResult<
      boolean | undefined
    >();
    const emptyBooleanStringUndefinedTestResult = new DidNotRunTestResult<
      boolean | string | undefined
    >();
    const emptyBooleanTestResult = new DidNotRunTestResult<boolean>();
    const emptyNumberTestResult = new DidNotRunTestResult<number | undefined>();
    this.integrationType = emptyStringTestResult;
    this.browserName = new DidNotRunTestResult<BrowserTypes>();
    this.websiteURL = emptyStringTestResult;
    this.consumerSalutation = emptyStringUndefinedTestResult;
    this.consumerFirstName = emptyStringUndefinedTestResult;
    this.consumerLastName = emptyStringUndefinedTestResult;
    this.consumerYearOfBirth = emptyStringUndefinedTestResult;
    this.consumerEmail = emptyStringUndefinedTestResult;
    this.consumerEmailHash = emptyStringUndefinedTestResult;
    this.consumerStreet = emptyStringUndefinedTestResult;
    this.consumerStreetNumber = emptyStringUndefinedTestResult;
    this.consumerZipCode = emptyStringUndefinedTestResult;
    this.consumerPhone = emptyStringUndefinedTestResult;
    this.consumerCity = emptyStringUndefinedTestResult;
    this.consumerCountry = emptyStringUndefinedTestResult;
    this.trafficSourceNumber = emptyStringUndefinedTestResult;
    this.trafficMediumNumber = emptyStringUndefinedTestResult;
    this.orderCurrency = emptyStringUndefinedTestResult;
    this.orderId = emptyStringUndefinedTestResult;
    this.orderValue = emptyStringUndefinedTestResult;
    this.sessionId = emptyStringUndefinedTestResult;
    this.timestamp = emptyStringUndefinedTestResult;
    this.usedCouponCode = emptyStringUndefinedTestResult;
    this.iFrameContainerId = emptyStringUndefinedTestResult;
    this.isEnabledInBackend = emptyBooleanUndefinedTestResult;
    this.wasExecuted = emptyBooleanTestResult;
    this.sovendusDivFound = emptyBooleanStringUndefinedTestResult;
    this.multipleSovIFramesDetected = emptyBooleanUndefinedTestResult;
    this.sovIFramesAmount = emptyNumberTestResult;
    this.multipleIFramesAreSame = emptyNumberTestResult;
    this.flexibleIFrameOnDOM = emptyBooleanUndefinedTestResult;
    this.isFlexibleIFrameExecutable = emptyBooleanUndefinedTestResult;
    this.isSovendusJsOnDom = emptyBooleanUndefinedTestResult;
    this.isSovendusJsExecutable = emptyBooleanStringUndefinedTestResult;
    this.isUnknownSovendusJsError = emptyBooleanUndefinedTestResult;

    this.awinIntegrationDetectedTestResult = emptyBooleanTestResult;
    this.awinSaleTrackedTestResult = emptyBooleanTestResult;
    this.awinExecutedTestResult = emptyBooleanTestResult;
  }
}

function validateEmail(email: string): boolean {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

class TestResultType<TElementValueType> {
  elementValue: TElementValueType;
  statusMessageKey: undefined | StatusMessageKeyTypes;
  statusCode: StatusCodes;
  constructor({
    elementValue,
    statusMessageKey,
    statusCode,
  }: {
    elementValue: TElementValueType;
    statusMessageKey: undefined | StatusMessageKeyTypes;
    statusCode: StatusCodes;
  }) {
    this.elementValue = elementValue;
    this.statusMessageKey = statusMessageKey;
    this.statusCode = statusCode;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFormattedStatusMessage(_showSuccessCheckMark: boolean = true): string {
    return "";
  }

  getFormattedGeneralStatusMessage(): string {
    return "";
  }

  getCheckMarkWithLabel(): string {
    return `
      <span style="position:relative">
        <img style="height:18px;width:auto;margin-bottom: -4px" class="sovendus-check-mark"
         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAS5AAAEuQER4c0nAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAcZJREFUWIXtlT1Lw1AUht+bFOql+A8qCO4Blzalgwo6pLX+AWdxaC1UcHBzlULVdHDzF+jg1+RgoEJSSpfugiJdO2mr9OM6WEqa5japjRmk73jP4T4P54RcYJZZfEqsEKOyKmdxBMF8LvoBV1Ql2BSalwCyYRpeqEfrd9DAfBFQVCXYQOMKQLJ/tGyWID7DzbkoN8o7fyYQK8RoT+xdg2CD0/IodISkwClODw/0bsbAS1SkW/q+3vJ8AgM4sD4GntDS2jsAeCowKdxTgd/ARwTix/H5Nm2fM5EdVtKVNw/hWifYSVZ3q01rYfARSnkp1KbtWwKyLXSFknwiL3oEL1GRpuzgQH8CUl4KzQXn7gnIiqn2Srpk1cgZL1PCR8Y+JNC/5AFA3FpkYM9MZGt263Az9tZXa7N2UPvgwQFA0HP6J4CqrR3Ikt06XMCfqEhTTvAfBgAwkGgxegogy+kbrMMlXBk39lEBlxIAEgDOvIIPC/Ql5KKsMrAMp78DIMCpudq5NcNvAQEz9owsAJXTz4O73rk19n9C53VY4RON3VnAvcRU8PECzhJTw50F+BKewN0JjEp4Bp8sDCSiRjJSXgr5C57lv+cbJ0juWerPx1oAAAAASUVORK5CYII=" />
      </span>
    `;
  }
}
class SuccessTestResult<
  TElementValueType,
> extends TestResultType<TElementValueType> {
  declare elementValue: TElementValueType;
  declare statusMessageKey: undefined;
  declare statusCode: StatusCodes.Success;

  constructor({ elementValue }: { elementValue: TElementValueType }) {
    super({
      elementValue,
      statusMessageKey: undefined,
      statusCode: StatusCodes.Success,
    });
    this.elementValue = elementValue;
    this.statusMessageKey = undefined;
    this.statusCode = StatusCodes.Success;
  }

  override getFormattedStatusMessage(
    showSuccessCheckMark: boolean = true,
  ): string {
    return (
      String(this.elementValue ? this.elementValue : "") +
      (showSuccessCheckMark ? this.getCheckMarkWithLabel() : "")
    );
  }
}

class DidNotRunTestResult<
  TElementValueType,
> extends TestResultType<TElementValueType> {
  declare elementValue: TElementValueType;
  declare statusMessageKey: undefined;
  declare statusCode: StatusCodes.TestDidNotRun;

  constructor() {
    super({
      // TODO remove ExplicitAnyType
      elementValue: undefined as ExplicitAnyType,
      statusMessageKey: undefined,
      statusCode: StatusCodes.TestDidNotRun,
    });
    // TODO remove ExplicitAnyType
    this.elementValue = undefined as ExplicitAnyType;
    this.statusMessageKey = undefined;
    this.statusCode = StatusCodes.TestDidNotRun;
  }
}

class WarningOrFailTestResultWithoutStatusMessageKey<
  TElementValueType,
> extends TestResultType<TElementValueType> {
  declare elementValue: TElementValueType;
  declare statusMessageKey: undefined;
  declare statusCode: StatusCodes.Error | StatusCodes.SuccessButNeedsReview;

  constructor({
    elementValue,
    statusCode,
  }: {
    elementValue: TElementValueType;
    statusCode: StatusCodes.Error | StatusCodes.SuccessButNeedsReview;
  }) {
    super({
      elementValue,
      statusMessageKey: undefined,
      statusCode,
    });
    this.elementValue = elementValue;
    this.statusMessageKey = undefined;
    this.statusCode = statusCode;
  }
}

class WarningOrFailTestResult<
  TElementValueType,
> extends TestResultType<TElementValueType> {
  declare elementValue: TElementValueType;
  declare statusMessageKey: StatusMessageKeyTypes;
  declare statusCode: StatusCodes.Error | StatusCodes.SuccessButNeedsReview;

  constructor({
    elementValue,
    statusMessageKey,
    statusCode,
  }: {
    elementValue: TElementValueType;
    statusMessageKey: StatusMessageKeyTypes;
    statusCode: StatusCodes.Error | StatusCodes.SuccessButNeedsReview;
  }) {
    super({
      elementValue,
      statusMessageKey,
      statusCode,
    });
    this.elementValue = elementValue;
    this.statusMessageKey = statusMessageKey;
    this.statusCode = statusCode;
  }

  override getFormattedStatusMessage(): string {
    try {
      if (this.statusCode === StatusCodes.SuccessButNeedsReview) {
        if (!this.statusMessageKey) {
          // eslint-disable-next-line no-console
          console.error(
            `No statusMessageKey set for the value: ${this.elementValue} - with the status ${this.statusCode}`,
          );
          return "";
        }
        return `${String(
          this.elementValue ? this.elementValue : "",
        )}${this.getInfoMarkWithLabel(
          this.replaceElementValueInMessage(
            statusMessages[this.statusMessageKey].infoText,
          ),
        )}`;
      }
      if (this.statusCode === StatusCodes.Error) {
        if (!this.statusMessageKey) {
          // eslint-disable-next-line no-console
          console.error(
            `No statusMessageKey set for the value: ${this.elementValue} - with the status ${this.statusCode}`,
          );
          return "";
        }
        return `${String(
          this.elementValue ? this.elementValue : "",
        )}<span class='${sovendusOverlayErrorClass}' style="padding-left: 5px;">${
          statusMessages[this.statusMessageKey].errorText
        }</span>${this.getInfoMarkWithLabel(
          this.replaceElementValueInMessage(
            statusMessages[this.statusMessageKey].infoText,
          ),
        )}`;
      }
      return "";
    } catch (error: ExplicitAnyType) {
      // eslint-disable-next-line no-console
      console.error(
        `getFormattedStatusMessage() crashed: ${error}\n
        \n
        ElementValue: ${this.elementValue}\n
        StatusCode: ${this.statusCode}\n
        StatusMessageKey: ${this.statusMessageKey}`,
      );
      return "";
    }
  }

  override getFormattedGeneralStatusMessage(): string {
    if (this.statusCode === StatusCodes.Error) {
      if (!this.statusMessageKey) {
        // eslint-disable-next-line no-console
        console.error(
          `No statusMessageKey set for the value: ${this.elementValue} - with the status ${this.statusCode}`,
        );
        return "";
      }
      return `<li><h3 class='${sovendusOverlayErrorClass}'>${this.replaceElementValueInMessage(
        statusMessages[this.statusMessageKey].errorText,
      )}</h3></li>`;
    }
    return "";
  }

  private replaceElementValueInMessage(message: string): string {
    return message.replace(/{elementValue}/g, String(this.elementValue));
  }

  private getInfoMarkWithLabel(labelText: string): string {
    const infoIcon =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAOVJREFUWEftl10OhDAIhNtz7vn2nG58cFMrMMPYpGr01QKfw0+xlslPnRy/3BNg+ZbFUq5+8h9EK+AF9VLIwkCAbOAeCIGEAGeDbzARhAug5jlrZwJknfSyZ+xpAEvGNhB6v0JaZw4AFj3j3AvQ++t9QQCvgFTQFABqIZSCrTYiFXYKILnaYht1VgLIVPkKPVyB6QBMbtl0SSl4LgAqGDRy2ZnRnpMHEQuL2hUCeCOWAWCm5fUuI+vLmMUiarvI/poLidfn6j+EtJKNgkA3KtyKVRAU+F8XiqzZyyiKQSuggDI2L8APUoSuITyX8cMAAAAASUVORK5CYII=";
    const whiteInfoIcon =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAONJREFUWEftl9sOhDAIROX/P7obHzS1C8wwNqm70VcLHIdL0bbFjy2Ov/0mQGutecqZWfmDaIMoaJRCFgYCVAOPQAgkBbgb/IDJIEIANc9VOxeg6mSUvWJPA3gy9oHQ+x3SO/MF4NEzzqMAo7/RFwSICkgFLQGgFkIpOGojU+GiAJKrL7ZZZyWASpXv0NMVWA7A5JZNl5SC/wVABYNGLjsz+nPyIGJhUbtCgGjEMgDMtHzeZeR9GbNYZG2X2T9zIYn6XP2HkFayWRDoRoVbsQqCAp91ochavYyyGLQCCihj8wJ8AKPZ6CHFW/ndAAAAAElFTkSuQmCC";
    return `
      <img style="height:20px;width:auto;margin-bottom: -4px;" class="${tooltipButtonClass}"
      src=${infoIcon} />
      <div class="${tooltipClass}" role="tooltip">
        <img style="height:20px;width:auto;margin-bottom: -4px;"
          src="${whiteInfoIcon}"
          />
        ${labelText}
      </div>
    `;
  }
}

interface MergedSovConsumer {
  salutation: ExplicitAnyType;
  firstName: ExplicitAnyType;
  lastName: ExplicitAnyType;
  yearOfBirth: ExplicitAnyType;
  email: ExplicitAnyType;
  emailHash: ExplicitAnyType;
  phone: ExplicitAnyType;
  street: ExplicitAnyType;
  streetNumber: ExplicitAnyType;
  zipCode: ExplicitAnyType;
  city: ExplicitAnyType;
  country: ExplicitAnyType;
}

export interface SovConsumer {
  consumerSalutation?: ExplicitAnyType;
  consumerFirstName?: ExplicitAnyType;
  consumerLastName?: ExplicitAnyType;
  consumerYearOfBirth?: ExplicitAnyType;
  consumerEmail?: ExplicitAnyType;
  consumerEmailHash?: ExplicitAnyType;
  consumerPhone?: ExplicitAnyType;
  consumerStreet?: ExplicitAnyType;
  consumerStreetNumber?: ExplicitAnyType;
  consumerZipcode?: ExplicitAnyType;
  consumerCity?: ExplicitAnyType;
  consumerCountry?: ExplicitAnyType;
}

interface SovApplicationConsumer {
  salutation: "Mr." | "Mrs." | null;
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  email?: string | undefined;
  emailHash: string;
  phone: string;
  street: string;
  streetNumber: string;
  zipCode: string;
  city: string;
  country: string;
}

interface SovApplication {
  consumer?: SovApplicationConsumer;
  instances?: Instance[];
}

export interface SovIframes {
  trafficSourceNumber?: ExplicitAnyType;
  trafficMediumNumber?: ExplicitAnyType;
  sessionId?: ExplicitAnyType;
  timestamp?: ExplicitAnyType;
  orderId?: ExplicitAnyType;
  orderValue?: ExplicitAnyType;
  orderCurrency?: ExplicitAnyType;
  usedCouponCode?: ExplicitAnyType;
  iframeContainerId?: ExplicitAnyType;
  integrationType?: ExplicitAnyType;
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
    Sale: object;
    iMerchantId: number;
  };
}

export interface SovWindow extends Window {
  sovIframes?: SovIframes[];
  sovConsumer?: SovConsumer;
  sovApplication?: SovApplication;
  AWIN?: Awin;
  // only used by tests
  transmitTestResult?: false;
}

declare let window: SovWindow;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExplicitAnyType = any;
