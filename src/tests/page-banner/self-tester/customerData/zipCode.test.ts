import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/integration-tester-data-to-sync-with-dev-hub";
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
              consumerZipcode: "76135", // Gültige 5-stellige PLZ
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
              consumerZipcode: "EC1A 1BB", // Gültige UK-PLZ
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
              consumerZipcode: "1012 AB", // Gültige NL-PLZ
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
              consumerZipcode: "8000", // Gültige CH-PLZ
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
              consumerZipcode: "1000", // Gültige BE-PLZ
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
              consumerZipcode: "1000", // Gültige DK-PLZ
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
              consumerZipcode: "00-001", // Gültige PLZ in Polen
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
              consumerZipcode: "111 22", // Gültige SE-PLZ
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
              consumerZipcode: "75001", // Gültige FR-PLZ
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
              consumerZipcode: "00100", // Gültige IT-PLZ
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
              consumerZipcode: "1010", // Gültige AT-PLZ
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
              consumerZipcode: "28001", // Gültige ES-PLZ
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "28001",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeSuccess,
        },
        {
          testName: "FailOnlyLetters",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "ABCDE", // Ungültige PLZ (nur Buchstaben)
            },
            sovIframes1: sovAppIFramesAllValidData,
          },
          expectedElementValue: "ABCDE",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerZipCodeMalformed,
        },
        {
          testName: "FailWithSpecialCharacters",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerZipcode: "123@5", // Ungültige PLZ (enthält spezielle Zeichen)
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
              consumerZipcode: " 12345", // Ungültige PLZ (Leerzeichen am Anfang)
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
              consumerZipcode: "12345 ", // Ungültige PLZ (Leerzeichen am Ende)
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
