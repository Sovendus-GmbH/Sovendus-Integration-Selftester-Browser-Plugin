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
  testName: "consumerDateOfBirth",
  tests: [
    ...generateTests({
      elementKey: "consumerDateOfBirth",
      testsInfo: [
        {
          testName: "ValidDate",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "01.01.1991",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthSuccess,
        },
        {
          testName: "ValidDateTwo",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerDateOfBirth: "29.02.2000",
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
              consumerDateOfBirth: "32.01.1991",
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
              consumerDateOfBirth: "01.13.1991",
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "01.13.1991",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthNotValid,
        },
        {
          testName: "InvalidDateFormat",
          sovAppData: sovAppDataMalformedButIsOkay,
          expectedElementValue: "1991-06-12",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthNotValid,
        },
        {
          testName: "DateWithSpecialCharacters",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerDateOfBirth: "01.@1.1991",
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
              consumerDateOfBirth: "0A.01.1991",
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "0A.01.1991",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerDateOfBirthNotValid,
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
