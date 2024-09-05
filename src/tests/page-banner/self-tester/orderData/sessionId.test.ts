import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/integration-tester-data-to-sync-with-dev-hub";
import {
  sovAppDataEverythingIsOkay,
  sovAppIFramesAllValidData,
} from "@src/tests/testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "sessionId",
  tests: [
    ...generateTests({
      elementKey: "sessionId",
      testsInfo: [
        {
          testName: "Success_WithHyphenAndNumbers",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "session-1234",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.sessionIdSuccess,
        },
        {
          testName: "Success_NumbersOnly",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              sessionId: "123456",
            },
          },
          expectedElementValue: "123456",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.sessionIdSuccess,
        },
        {
          testName: "Success_Alphanumeric",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              sessionId: "sess1234abc",
            },
          },
          expectedElementValue: "sess1234abc",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.sessionIdSuccess,
        },
        {
          testName: "Success_UnderscoreInID",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              sessionId: "session_1234",
            },
          },
          expectedElementValue: "session_1234",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.sessionIdSuccess,
        },
        {
          testName: "Success_CapitalLetters",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              sessionId: "SESSIONID123",
            },
          },
          expectedElementValue: "SESSIONID123",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.sessionIdSuccess,
        },
        {
          testName: "Success_MixedCase",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              sessionId: "SessionId-2024",
            },
          },
          expectedElementValue: "SessionId-2024",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.sessionIdSuccess,
        },
        {
          testName: "Malformed_SpecialCharacters",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              sessionId: "session@123",
            },
          },
          expectedElementValue: "session@123",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.sessionIdMalformed,
        },
        {
          testName: "Malformed_Whitespace",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              sessionId: "   ",
            },
          },
          expectedElementValue: "   ",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.sessionIdMalformed,
        },
        {
          testName: "Malformed_OnlySpecialCharacters",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              sessionId: "$%^&*",
            },
          },
          expectedElementValue: "$%^&*",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.sessionIdMalformed,
        },
        {
          testName: "Malformed_SessionIDWithSpace",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              sessionId: "session 1234",
            },
          },
          expectedElementValue: "session 1234",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.sessionIdMalformed,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "sessionId",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.sessionIdMalformed,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.missingSessionId,
      objectElementValueType: "objectObject",
      skipNumberCheck: true,
    }),
  ],
});
