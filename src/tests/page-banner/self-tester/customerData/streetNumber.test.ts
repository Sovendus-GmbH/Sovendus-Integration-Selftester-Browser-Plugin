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
  testName: "streetNumber",
  tests: [
    {
      testName: "Success",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerStreetNumber.elementValue).toBe("1a");
        expect(sovSelfTester.consumerStreetNumber.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerStreetNumber.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerStreetNumberSuccess,
        );
      },
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerStreetNumber.elementValue).toBe(null);
        expect(sovSelfTester.consumerStreetNumber.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.consumerStreetNumber.statusMessageKey).toBe(
          StatusMessageKeyTypes.missingConsumerStreetNumber,
        );
      },
    },
    ...generateMalformedDataTests({
      elementKey: "consumerStreetNumber",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerStreetNumberMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerStreetNumber,
    }),
  ],
});
