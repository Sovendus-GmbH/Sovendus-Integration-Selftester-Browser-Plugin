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
  sovAppDataNoParameterButIsOkay,
} from "../../sovAppData";

executeOverlayTests({
  testName: "city",
  tests: [
    {
      testName: "Success",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerCity.elementValue).toBe("Karlsruhe");
        expect(sovSelfTester.consumerCity.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerCity.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerCitySuccess,
        );
      },
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerCity.elementValue).toBe(null);
        expect(sovSelfTester.consumerCity.statusCode).toBe(StatusCodes.Error);
        expect(sovSelfTester.consumerCity.statusMessageKey).toBe(
          StatusMessageKeyTypes.missingConsumerCity,
        );
      },
    },
    ...generateMalformedDataTests({
      elementKey: "consumerCity",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerCityMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerCity,
    }),
  ],
});
