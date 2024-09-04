import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
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
        // {
        //   testName: "MalformedInvalidSalutation",
        //   sovAppData: {
        //     ...sovAppDataEverythingIsOkay,
        //     sovConsumer: {
        //       ...sovAppConsumerAllValidData,
        //       consumerSalutation: "Dr.",
        //     },
        //   },
        //   expectedElementValue: "Dr.",
        //   expectedStatusCode: StatusCodes.Error,
        //   expectedStatusMessageKey:
        //     StatusMessageKeyTypes.consumerSalutationNotValid,
        // },
        {
          testName: "MalformedWithNumbers",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerSalutation: "Mr.123",
            },
          },
          expectedElementValue: "Mr.123",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerSalutationNotValid,
        },
        {
          testName: "MalformedWithSpecialChars",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerSalutation: "Mr.#$%",
            },
          },
          expectedElementValue: "Mr.#$%",
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
