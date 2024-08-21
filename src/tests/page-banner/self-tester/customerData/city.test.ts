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
  testName: "consumerCity",
  tests: [
    ...generateTests({
      elementKey: "consumerCity",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "Karlsruhe",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerCitySuccess,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerCity",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerCityMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerCity,
    }),
  ],
});
