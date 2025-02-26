import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "consumerFirstName",
  tests: [
    ...generateTests({
      elementKey: "consumerFirstName",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "John",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerFirstNameSuccess,
        },
        {
          testName: "SuccessWithHyphen",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerFirstName: "Jean-Luc",
            },
          },
          expectedElementValue: "Jean-Luc",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerFirstNameSuccess,
        },
        {
          testName: "SuccessWithApostrophe",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerFirstName: "O'Connor",
            },
          },
          expectedElementValue: "O'Connor",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerFirstNameSuccess,
        },
        {
          testName: "SuccessWithSpace",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerFirstName: "Mary Jane",
            },
          },
          expectedElementValue: "Mary Jane",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerFirstNameSuccess,
        },
        {
          testName: "MalformedWithNumbers",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerFirstName: "John123",
            },
          },
          expectedElementValue: "John123",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerFirstNameMalformed,
        },
        {
          testName: "MalformedWithSpecialChars",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerFirstName: "John!@#",
            },
          },
          expectedElementValue: "John!@#",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerFirstNameMalformed,
        },
        {
          testName: "WhitespaceOnly",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerFirstName: "   ",
            },
          },
          expectedElementValue: "   ",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerFirstNameMalformed,
        },
        {
          testName: "MalformedWithLeadingSpace",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerFirstName: " John",
            },
          },
          expectedElementValue: " John",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerFirstNameMalformed,
        },
        {
          testName: "MalformedWithTrailingSpace",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerFirstName: "John ",
            },
          },
          expectedElementValue: "John ",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerFirstNameMalformed,
        },
        {
          testName: "SuccessWithAccentedCharacters",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerFirstName: "Élodie",
            },
          },
          expectedElementValue: "Élodie",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerFirstNameSuccess,
        },
        {
          testName: "MalformedWithMultipleSpaces",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerFirstName: "John  Doe",
            },
          },
          expectedElementValue: "John  Doe",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerFirstNameMalformed,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerFirstName",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerFirstNameMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerFirstName,
    }),
  ],
});
