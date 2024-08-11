import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  executeOverlayTests,
  generateMalformedDataTests,
  generateTests,
} from "../../../testUtils";
import { sovAppDataEverythingIsOkay } from "../../sovAppData";

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
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "sessionId",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.sessionIdMalformed,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.missingSessionId,
      objectElementValueType: "objectObject",
    }),
  ],
});
