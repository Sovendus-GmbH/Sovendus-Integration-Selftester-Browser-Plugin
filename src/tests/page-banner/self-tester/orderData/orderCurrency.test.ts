import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppIFramesAllValidData,
} from "src/tests/testUtils/sovAppData";
import { executeOverlayTests } from "src/tests/testUtils/testUtils";

const tests = [
  ...generateTests({
    elementKey: "orderCurrency",
    testsInfo: [
      {
        testName: "Success",
        sovAppData: sovAppDataEverythingIsOkay,
        expectedElementValue: "EUR",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencySuccess,
      },
      {
        testName: "MalformedCurrencyName",
        sovAppData: {
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "EURO",
          },
        },
        expectedElementValue: "EURO",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencyNotValid,
      },
      {
        testName: "MalformedCurrencyName_WhenScriptDoesNotRun",
        sovAppData: {
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderCurrency: "EURO",
          },
        },
        expectedElementValue: "EURO",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.currencyNotValid,
        disableFlexibleIFrameJs: true,
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
