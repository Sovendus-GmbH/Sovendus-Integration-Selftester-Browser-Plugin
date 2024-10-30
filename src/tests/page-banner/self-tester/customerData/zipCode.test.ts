import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/integration-tester/integration-tester-data-to-sync-with-dev-hub";
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
          testName: "SuccessGermany",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "76135", // Valid 5-digit German ZIP code
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "76135",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "SuccessUnitedKingdom",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "EC1A 1BB", // Valid UK ZIP code
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "EC1A 1BB",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "SuccessNetherlands",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "1012 AB", // Valid Dutch ZIP code
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "1012 AB",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "SuccessSwitzerland",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "8000", // Valid Swiss ZIP code
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "8000",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "SuccessBelgium",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "1000", // Valid Belgian ZIP code
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "1000",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "SuccessDenmark",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "1000", // Valid Danish ZIP code
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "1000",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "SuccessPoland",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "00-001", // Valid Polish ZIP code
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "00-001",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "SuccessSweden",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "111 22", // Valid Swedish ZIP code
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "111 22",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "SuccessFrance",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "75001", // Valid French ZIP code
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "75001",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "SuccessItaly",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "00100", // Valid Italian ZIP code
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "00100",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "SuccessAustria",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "1010", // Valid Austrian ZIP code
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "1010",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "SuccessSpain",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "28001", // Valid Spanish ZIP code
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "28001",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "FailWithSpecialCharacters",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "123@5", // Invalid ZIP code (contains special characters)
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "123@5",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeMalformed,
        },
        {
          testName: "FailWithSpacesAtStart",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: " 12345", // Invalid ZIP code (leading space)
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: " 12345",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeMalformed,
        },
        {
          testName: "FailWithSpacesAtEnd",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "12345 ", // Invalid ZIP code (trailing space)
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "12345 ",
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
