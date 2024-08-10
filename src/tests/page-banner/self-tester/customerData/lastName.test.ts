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
  testName: "lastName",
  tests: [
    {
      testName: "Success",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerLastName.elementValue).toBe("Smith");
        expect(sovSelfTester.consumerLastName.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerLastName.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerLastNameSuccess,
        );
      },
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerLastName.elementValue).toBe(null);
        expect(sovSelfTester.consumerLastName.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.consumerLastName.statusMessageKey).toBe(
          StatusMessageKeyTypes.missingConsumerLastName,
        );
      },
    },
    ...generateMalformedDataTests({
      elementKey: "consumerLastName",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerLastNameMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerLastName,
    }),
  ],
});
