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

executeOverlayTests({
  testName: "consumerStreetNumber",
  tests: [
    ...generateTests({
      elementKey: "consumerStreetNumber",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "1a",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetNumberSuccess,
        },
        {
          testName: "SuccessAsStringNumber",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerStreetNumber: "11",
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "11",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetNumberSuccess,
        },
        {
          testName: "MalformedWithLeadingSpaces",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerStreetNumber: "  12  ",
            },
          },
          expectedElementValue: "  12  ",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetNumberMalformed,
        },
        {
          testName: "MalformedWithTrailingSpaces",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerStreetNumber: "12  ",
            },
          },
          expectedElementValue: "12  ",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetNumberMalformed,
        },
        {
          testName: "MalformedWithOnlySpecialChars",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerStreetNumber: "#$%",
            },
          },
          expectedElementValue: "#$%",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetNumberMalformed,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerStreetNumber",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerStreetNumberMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerStreetNumber,
      skipNumberCheck: true,
    }),
  ],
});
