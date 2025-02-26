import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppIFramesAllValidData,
} from "../../../testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

const tests = [
  ...generateTests({
    elementKey: "orderCurrency",
    testsInfo: [
      {
        testName: "Success_EUR",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "EUR", // Valid currency code for Euro
          },
        },
        expectedElementValue: "EUR",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencySuccess,
      },
      {
        testName: "Success_GBP",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "GBP", // Valid currency code for British Pound
          },
        },
        expectedElementValue: "GBP",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencySuccess,
      },
      {
        testName: "Success_CHF",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "CHF", // Valid currency code for Swiss Franc
          },
        },
        expectedElementValue: "CHF",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencySuccess,
      },
      {
        testName: "Success_PLN",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "PLN", // Valid currency code for Polish Zloty
          },
        },
        expectedElementValue: "PLN",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencySuccess,
      },
      {
        testName: "Success_SEK",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "SEK", // Valid currency code for Swedish Krona
          },
        },
        expectedElementValue: "SEK",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencySuccess,
      },
      {
        testName: "Success_DKK",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "DKK", // Valid currency code for Danish Krone
          },
        },
        expectedElementValue: "DKK",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencySuccess,
      },
      {
        testName: "Success_NOK",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "NOK", // Valid currency code for Norwegian Krone
          },
        },
        expectedElementValue: "NOK",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencySuccess,
      },
      {
        testName: "MalformedCurrency_Lowercase",
        sovAppData: {
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "eur", // Lowercase currency code
          },
        },
        expectedElementValue: "eur",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencyNotValid,
      },
      {
        testName: "MalformedCurrency_SpecialCharacters",
        sovAppData: {
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "E@R", // Currency code with special character
          },
        },
        expectedElementValue: "E@R",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencyNotValid,
      },
      {
        testName: "MalformedCurrency_Numeric",
        sovAppData: {
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "123", // Numeric value as currency code
          },
        },
        expectedElementValue: "123",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencyNotValid,
      },
      {
        testName: "MalformedCurrency_NotValid",
        sovAppData: {
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "EUROPE", // Currency code not valid
          },
        },
        expectedElementValue: "EUROPE",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencyNotValid,
      },
      {
        testName: "MalformedCurrency_SingleCharacter",
        sovAppData: {
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "E", // Currency code with only one character
          },
        },
        expectedElementValue: "E",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencyNotValid,
      },
      {
        testName: "MalformedCurrency_AlphaNumeric",
        sovAppData: {
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "EU1", // Alpha-numeric currency code
          },
        },
        expectedElementValue: "EU1",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencyNotValid,
      },
    ],
  }),
];

executeOverlayTests({
  testName: "orderCurrency",
  tests: [
    ...tests,
    ...generateMalformedDataTests({
      elementKey: "orderCurrency",
      expectedMalformedStatusMessageKey: StatusMessageKeyTypes.currencyNotValid,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.currencyMissing,
      objectElementValueType: "objectObject",
    }),
  ],
});

executeOverlayTests({
  testName: "orderCurrencyAwin",
  tests: [
    ...tests,
    ...generateMalformedDataTests({
      elementKey: "orderCurrency",
      expectedMalformedStatusMessageKey: StatusMessageKeyTypes.currencyNotValid,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.currencyMissing,
      objectElementValueType: "objectObject",
      isAwinTest: true,
    }),
  ],
  isAwinTest: true,
});
