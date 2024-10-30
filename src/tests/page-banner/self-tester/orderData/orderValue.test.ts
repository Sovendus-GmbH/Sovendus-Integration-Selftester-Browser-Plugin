import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/integration-tester/integration-tester-data-to-sync-with-dev-hub";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataFloatNumberButIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppDataNumberButIsOkay,
  sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
  sovAppIFramesAllValidData,
} from "@src/tests/testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

const tests = [
  ...generateTests({
    elementKey: "orderValue",
    testsInfo: [
      {
        testName: "SuccessAsString",
        sovAppData: sovAppDataEverythingIsOkay,
        expectedElementValue: "12.5",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueSuccess,
      },
      {
        testName: "SuccessAsNumber",
        sovAppData: sovAppDataNumberButIsOkay,
        expectedElementValue: "1234",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueSuccess,
      },
      {
        testName: "SuccessAsNumber",
        sovAppData: sovAppDataFloatNumberButIsOkay,
        expectedElementValue: "1234.56",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueSuccess,
      },
      {
        testName: "Malformed",
        sovAppData: sovAppDataMalformedButIsOkay,
        expectedElementValue: "dreitausend",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueWrongFormat,
      },
      {
        testName: "MalformedNumberWithCommaInsteadOfDot",
        sovAppData: sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
        expectedElementValue: "1234,56",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueWrongFormat,
      },
      {
        testName: "MalformedNumberWithCommaInsteadOfDot_WhenScriptDoesNotRun",
        sovAppData: sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
        expectedElementValue: "1234,56",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueWrongFormat,
        testOptions: {
          regular: {
            disableFlexibleIFrameJs: true,
          },
        },
      },
      {
        testName: "SuccessAsLargeNumber",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderValue: 1000000000, // Large valid number
          },
        },
        expectedElementValue: "1000000000",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueSuccess,
      },
      {
        testName: "SuccessAsSmallDecimal",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderValue: 0.01, // Small valid decimal
          },
        },
        expectedElementValue: "0.01",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueSuccess,
      },
      {
        testName: "MalformedNumberWithMultipleDots",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderValue: "12.34.56", // Invalid format with multiple dots
          },
        },
        expectedElementValue: "12.34.56",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueWrongFormat,
      },
      {
        testName: "MalformedNegativeNumber",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderValue: "-1234.56", // Invalid negative number
          },
        },
        expectedElementValue: "-1234.56",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueWrongFormat,
      },
      {
        testName: "MalformedOrderValueWithSpaces",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderValue: " 1234.56 ", // Invalid format with spaces
          },
        },
        expectedElementValue: " 1234.56 ",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueWrongFormat,
      },
      {
        testName: "MalformedOrderValueWithLetters",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderValue: "1234abc", // Invalid format with letters
          },
        },
        expectedElementValue: "1234abc",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueWrongFormat,
      },
      {
        testName: "MalformedOrderValueWithSpecialCharacters",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderValue: "$1234.56", // Invalid format with special characters
          },
        },
        expectedElementValue: "$1234.56",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderValueWrongFormat,
      },
    ],
  }),
];

executeOverlayTests({
  testName: "orderValue",
  tests: [
    ...tests,
    ...generateMalformedDataTests({
      elementKey: "orderValue",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.orderValueWrongFormat,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.orderValueMissing,
      skipNumberCheck: true,
      objectElementValueType: "objectObject",
    }),
  ],
});

executeOverlayTests({
  testName: "orderValueAwin",
  tests: [
    ...tests,
    ...generateMalformedDataTests({
      elementKey: "orderValue",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.orderValueWrongFormat,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.orderValueMissing,
      skipNumberCheck: true,
      objectElementValueType: "objectObject",
      isAwinTest: true,
    }),
  ],
  isAwinTest: true,
});
