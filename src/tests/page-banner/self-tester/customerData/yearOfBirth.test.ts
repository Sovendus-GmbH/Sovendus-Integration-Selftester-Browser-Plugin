import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/integration-tester-data-to-sync-with-dev-hub";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppIFramesAllValidData,
} from "@src/tests/testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "consumerYearOfBirth",
  tests: [
    ...generateTests({
      elementKey: "consumerYearOfBirth",
      testsInfo: [
        {
          testName: "SuccessAsString",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "1991",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerYearOfBirthSuccess,
        },
        {
          testName: "SuccessAsNumber",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerYearOfBirth: 1969,
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "1969",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerYearOfBirthSuccess,
        },
        {
          testName: "InvalidNumber",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerYearOfBirth: 1969.13,
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "1969.13",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerYearOfBirthNotValid,
        },
        {
          testName: "Malformed",
          sovAppData: sovAppDataMalformedButIsOkay,
          expectedElementValue: "12.06.1991",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerYearOfBirthNotValid,
        },
        {
          testName: "YearTooOld",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerYearOfBirth: "1890",
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "1890",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerYearOfBirthNotValid,
        },
        {
          testName: "YearInFuture",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerYearOfBirth: "2100",
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "2100",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerYearOfBirthNotValid,
        },
        {
          testName: "InvalidYearString",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerYearOfBirth: "19A1",
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "19A1",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerYearOfBirthNotValid,
        },
        {
          testName: "YearWithSpecialCharacters",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerYearOfBirth: "199@",
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "199@",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerYearOfBirthNotValid,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerYearOfBirth",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerYearOfBirthNotValid,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerYearOfBirth,
      canBeANumber: true,
    }),
  ],
});
