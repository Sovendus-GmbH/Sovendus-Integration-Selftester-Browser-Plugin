import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
} from "@src/tests/testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "consumerSalutation",
  tests: [
    ...generateTests({
      elementKey: "consumerSalutation",
      testsInfo: [
        {
          testName: "SuccessMr",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "Mr.",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerSalutationSuccess,
        },
        {
          testName: "SuccessMrs",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerSalutation: "Mrs.",
            },
          },
          expectedElementValue: "Mrs.",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerSalutationSuccess,
        },
        {
          testName: "Malformed",
          sovAppData: sovAppDataMalformedButIsOkay,
          expectedElementValue: "Mensch.",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerSalutationNotValid,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerSalutation",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerSalutationNotValid,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerSalutation,
    }),
  ],
});
