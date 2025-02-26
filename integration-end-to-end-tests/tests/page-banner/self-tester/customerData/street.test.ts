import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
} from "../../../testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "consumerStreet",
  tests: [
    ...generateTests({
      elementKey: "consumerStreet",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "test street",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerStreetSuccess,
        },
        {
          testName: "ErrorWithStreetNumber",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerStreet: "test street #1",
            },
          },
          expectedElementValue: "test street #1",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetMalformed,
        },
        {
          testName: "SuccessWithLeadingSpaces",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerStreet: "   test street   ",
            },
          },
          expectedElementValue: "   test street   ",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetMalformed,
        },
        {
          testName: "MalformedWithNumber",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerStreet: "test street 123",
            },
          },
          expectedElementValue: "test street 123",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetMalformed,
        },
        {
          testName: "MalformedWithOnlyNumber",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerStreet: "123",
            },
          },
          expectedElementValue: "123",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetMalformed,
        },
        {
          testName: "MalformedWithLeadingNumber",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerStreet: "123 test street",
            },
          },
          expectedElementValue: "123 test street",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetMalformed,
        },
        {
          testName: "MalformedWithMultipleSpaces",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerStreet: "test   street",
            },
          },
          expectedElementValue: "test   street",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetMalformed,
        },
        {
          testName: "MalformedWithSpecialCharsAtEnd",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerStreet: "test street@",
            },
          },
          expectedElementValue: "test street@",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetMalformed,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerStreet",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerStreetMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerStreet,
    }),
  ],
});
