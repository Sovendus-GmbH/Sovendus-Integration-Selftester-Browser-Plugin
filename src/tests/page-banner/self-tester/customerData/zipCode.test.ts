import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppIFramesAllValidData as sovAppIFramesAllValidData,
} from "@src/tests/testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "consumerZipCode",
  tests: [
    ...generateTests({
      elementKey: "consumerZipCode",
      testsInfo: [
        {
          testName: "SuccessAsString",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "76135",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "SuccessAsNumber",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: 1234,
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "1234",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "InvalidNumber",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: 1234.14,
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "1234.14",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeMalformed,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerZipCode",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerZipCodeMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerZipCode,
      canBeANumber: true,
    }),
  ],
});
