import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { sovAppDataEverythingIsOkay } from "@src/tests/testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "consumerFirstName",
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
