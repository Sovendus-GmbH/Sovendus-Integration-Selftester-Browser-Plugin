import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  executeOverlayTests,
  generateMalformedDataTests,
} from "../../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../../sovAppData";

executeOverlayTests({
  testName: "country",
  tests: [
    {
      testName: "Success",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerCountry.elementValue).toBe("DE");
        expect(sovSelfTester.consumerCountry.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerCountry.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerCountrySuccess,
        );
      },
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerCountry.elementValue).toBe(null);
        expect(sovSelfTester.consumerCountry.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.consumerCountry.statusMessageKey).toBe(
          StatusMessageKeyTypes.missingConsumerCountry,
        );
      },
    },
    {
      testName: "Malformed",
      sovAppData: sovAppDataMalformedButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerCountry.elementValue).toBe("Space");
        expect(sovSelfTester.consumerCountry.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.consumerCountry.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerCountryInvalid,
        );
      },
    },
    ...generateMalformedDataTests({
      elementKey: "consumerCountry",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerCountryInvalid,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerCountry,
    }),
  ],
});
