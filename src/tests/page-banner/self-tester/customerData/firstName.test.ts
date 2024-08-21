import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { executeOverlayTests } from "../../../testUtils/testUtils";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";

executeOverlayTests({
  testName: "firstName",
  tests: [
    ...generateTests({
      elementKey: "consumerFirstName",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "John",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerFirstNameSuccess,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerFirstName",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerFirstNameMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerFirstName,
    }),
  ],
});
