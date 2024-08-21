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
  testName: "lastName",
  tests: [
    ...generateTests({
      elementKey: "consumerLastName",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "Smith",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameSuccess,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerLastName",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerLastNameMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerLastName,
    }),
  ],
});
