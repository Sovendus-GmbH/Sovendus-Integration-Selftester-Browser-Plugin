import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { sovAppDataEverythingIsOkay } from "src/tests/testUtils/sovAppData";
import { executeOverlayTests } from "src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "city",
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
