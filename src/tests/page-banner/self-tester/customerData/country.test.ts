import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
} from "@src/tests/testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "consumerCountry",
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
