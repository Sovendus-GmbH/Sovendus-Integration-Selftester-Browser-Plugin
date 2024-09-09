import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/integration-tester-data-to-sync-with-dev-hub";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataNumberAsStringButIsOkay,
  sovAppIFramesAllValidData,
} from "@src/tests/testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

const tests = [
  ...generateTests({
    elementKey: "orderId",
    testsInfo: [
      {
        testName: "Success",
        sovAppData: sovAppDataEverythingIsOkay,
        expectedElementValue: "order-1234",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderIdSuccess,
      },
      {
        testName: "SuccessAsNumber",
        sovAppData: sovAppDataNumberAsStringButIsOkay,
        expectedElementValue: "1234",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderIdSuccess,
      },
      {
        testName: "Success_Alphanumeric",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderId: "order1234ABC", // Valid alphanumeric order ID
          },
        },
        expectedElementValue: "order1234ABC",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderIdSuccess,
      },
      {
        testName: "Success_WithSpecialCharacters",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderId: "order-1234_ABC", // Valid order ID with hyphen and underscore
          },
        },
        expectedElementValue: "order-1234_ABC",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderIdSuccess,
      },
      {
        testName: "MalformedOrderID_OnlyNumbers",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderId: "12345678", // Order ID with only numbers (valid but unusual)
          },
        },
        expectedElementValue: "12345678",
        expectedStatusCode: StatusCodes.SuccessButNeedsReview,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderIdSuccess,
      },
      {
        testName: "MalformedOrderID_SpecialCharactersOnly",
        sovAppData: {
          ...sovAppDataEverythingIsOkay,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            orderId: "@#$%^&*", // Invalid order ID with only special characters
          },
        },
        expectedElementValue: "@#$%^&*",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.orderIdMalformed,
      },
    ],
  }),
];

executeOverlayTests({
  testName: "orderId",
  tests: [
    ...tests,
    ...generateMalformedDataTests({
      elementKey: "orderId",
      expectedMalformedStatusMessageKey: StatusMessageKeyTypes.orderIdMalformed,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.missingOrderId,
      objectElementValueType: "objectObject",
      skipNumberCheck: true,
    }),
  ],
});

executeOverlayTests({
  testName: "orderIdAwin",
  tests: [
    ...tests,
    ...generateMalformedDataTests({
      elementKey: "orderId",
      expectedMalformedStatusMessageKey: StatusMessageKeyTypes.orderIdMalformed,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.missingOrderId,
      objectElementValueType: "objectObject",
      isAwinTest: true,
      skipNumberCheck: true,
    }),
  ],
  isAwinTest: true,
});
