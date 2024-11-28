import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/integration-tester/integration-tester-data-to-sync-with-dev-hub";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppIFramesAllValidData,
} from "@src/tests/testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "consumerDateOfBirth",
  tests: [
    ...generateTests({
      elementKey: "consumerDateOfBirth",
      testsInfo: [
        {
          testName: "ValidDate_de_DE",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "01.01.1991", // German format
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthSuccess,
        },
        {
          testName: "ValidDate_en_GB",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerDateOfBirth: "01/01/1991", // British format
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "01/01/1991",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthSuccess,
        },
        {
          testName: "ValidDate_iso",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerDateOfBirth: "1991-01-01", // ISO format
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "1991-01-01",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthSuccess,
        },
        {
          testName: "LeapYearDate",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerDateOfBirth: "29.02.2000", // Valid leap year date
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "29.02.2000",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthSuccess,
        },
        {
          testName: "InvalidDay",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerDateOfBirth: "32.01.1991", // Invalid day
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "32.01.1991",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthNotValid,
        },
        {
          testName: "InvalidMonth",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerDateOfBirth: "01.13.1991", // Invalid month
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "01.13.1991",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthNotValid,
        },
        {
          testName: "InvalidDateFormat_iso",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerDateOfBirth: "1991-13-12",
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "1991-13-12", // Invalid month (13 is out of range for months)
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthNotValid,
        },
        {
          testName: "InvalidDateFormat_en_GB",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerDateOfBirth: "32/06/1991", // Invalid day (32 is out of range for days)
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "32/06/1991", // Day out of range for en_GB
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthNotValid,
        },
        {
          testName: "DateWithSpecialCharacters",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerDateOfBirth: "01.@1.1991", // Special character in date
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "01.@1.1991",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthNotValid,
        },
        {
          testName: "DateWithInvalidCharacters",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerDateOfBirth: "0A.01.1991", // Invalid characters in day
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "0A.01.1991",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthNotValid,
        },
        {
          testName: "ValidLeapYear_iso",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerDateOfBirth: "2000-02-29", // Valid ISO leap year date
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "2000-02-29",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthSuccess,
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
