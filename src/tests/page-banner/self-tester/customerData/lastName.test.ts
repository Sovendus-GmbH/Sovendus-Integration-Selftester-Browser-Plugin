import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/integration-tester/integration-tester-data-to-sync-with-dev-hub";
import { sovAppDataEverythingIsOkay } from "@src/tests/testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "consumerLastName",
  tests: [
    ...generateTests({
      elementKey: "consumerLastName",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "Smith",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameSuccess,
        },
        {
          testName: "SuccessWithHyphen",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerLastName: "Jean-Luc",
            },
          },
          expectedElementValue: "Jean-Luc",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameSuccess,
        },
        {
          testName: "SuccessWithApostrophe",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerLastName: "O'Connor",
            },
          },
          expectedElementValue: "O'Connor",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameSuccess,
        },
        {
          testName: "SuccessWithSpace",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerLastName: "Mary Jane",
            },
          },
          expectedElementValue: "Mary Jane",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameSuccess,
        },
        {
          testName: "MalformedWithNumbers",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerLastName: "John123",
            },
          },
          expectedElementValue: "John123",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameMalformed,
        },
        {
          testName: "MalformedWithSpecialChars",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerLastName: "John!@#",
            },
          },
          expectedElementValue: "John!@#",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameMalformed,
        },
        {
          testName: "WhitespaceOnly",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerLastName: "   ",
            },
          },
          expectedElementValue: "   ",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameMalformed,
        },
        {
          testName: "MalformedWithLeadingSpace",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerLastName: " John",
            },
          },
          expectedElementValue: " John",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameMalformed,
        },
        {
          testName: "MalformedWithTrailingSpace",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerLastName: "John ",
            },
          },
          expectedElementValue: "John ",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameMalformed,
        },
        {
          testName: "SuccessWithAccentedCharacters",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerLastName: "Élodie",
            },
          },
          expectedElementValue: "Élodie",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameSuccess,
        },
        {
          testName: "MalformedWithMultipleSpaces",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerLastName: "John  Doe",
            },
          },
          expectedElementValue: "John  Doe",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameMalformed,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerLastName",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerLastNameMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerLastName,
    }),
  ],
});
