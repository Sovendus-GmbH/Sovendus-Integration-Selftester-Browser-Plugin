import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
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
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "session-1234",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.sessionIdSuccess,
        },
        {
          testName: "SuccessNumbersInString",
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
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "sessionId",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.sessionIdMalformed,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.missingSessionId,
      objectElementValueType: "objectObject",
      canBeANumber: true,
    }),
  ],
});
