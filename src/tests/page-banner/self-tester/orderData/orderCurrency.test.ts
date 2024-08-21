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
} from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "orderCurrency",
  tests: [
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
          disableFlexibleIframeJs: true,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "orderCurrency",
      expectedMalformedStatusMessageKey: StatusMessageKeyTypes.currencyNotValid,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.currencyMissing,
      objectElementValueType: "objectObject",
    }),
  ],
});
