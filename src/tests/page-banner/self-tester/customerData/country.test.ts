import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";

import {
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
} from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "country",
  tests: [
    ...generateTests({
      elementKey: "consumerCountry",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "DE",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerCountrySuccess,
        },
        {
          testName: "Malformed",
          sovAppData: sovAppDataMalformedButIsOkay,
          expectedElementValue: "Space",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerCountryInvalid,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerCountry",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerCountryInvalid,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerCountry,
    }),
  ],
});
