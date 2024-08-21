import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  executeOverlayTests,
  generateMalformedDataTests,
} from "../../../testUtils";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../../sovAppData";

executeOverlayTests({
  testName: "salutation",
  tests: [
    {
      testName: "SuccessMr",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerSalutation.elementValue).toBe("Mr.");
        expect(sovSelfTester.consumerSalutation.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerSalutationSuccess,
        );
      },
    },
    {
      testName: "SuccessMrs",
      sovAppData: {
        ...sovAppDataEverythingIsOkay,
        sovConsumer: {
          ...sovAppConsumerAllValidData,
          consumerSalutation: "Mrs.",
        },
      },
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerSalutation.elementValue).toBe("Mrs.");
        expect(sovSelfTester.consumerSalutation.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerSalutationSuccess,
        );
      },
    },
    {
      testName: "Malformed",
      sovAppData: sovAppDataMalformedButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerSalutation.elementValue).toBe("Mensch.");
        expect(sovSelfTester.consumerSalutation.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerSalutationNotValid,
        );
      },
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerSalutation.elementValue).toBe(null);
        expect(sovSelfTester.consumerSalutation.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
          StatusMessageKeyTypes.missingConsumerSalutation,
        );
      },
    },
    ...generateMalformedDataTests({
      elementKey: "consumerSalutation",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerSalutationNotValid,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerSalutation,
    }),
  ],
});
