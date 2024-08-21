import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataFloatNumberButIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppDataNumberButIsOkay,
  sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
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
        disableFlexibleIFrameJs: true,
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
