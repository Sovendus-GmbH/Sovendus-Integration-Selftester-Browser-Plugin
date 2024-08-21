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
  sovAppDataNoParameterButIsOkay,
  sovAppIframesAllValidData,
} from "../../sovAppData";

executeOverlayTests({
  testName: "ZipCode",
  tests: [
    {
      testName: "SuccessAsString",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerZipCode.elementValue).toBe("76135");
        expect(sovSelfTester.consumerZipCode.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerZipCode.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerZipCodeSuccess,
        );
      },
    },
    {
      testName: "SuccessAsNumber",
      sovAppData: {
        sovConsumer: {
          ...sovAppConsumerAllValidData,
          consumerZipcode: 1234,
        },
        sovIframes1: sovAppIframesAllValidData,
      },
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerZipCode.elementValue).toBe("1234");
        expect(sovSelfTester.consumerZipCode.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerZipCode.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerZipCodeSuccess,
        );
      },
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerZipCode.elementValue).toBe(null);
        expect(sovSelfTester.consumerZipCode.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.consumerZipCode.statusMessageKey).toBe(
          StatusMessageKeyTypes.missingConsumerZipCode,
        );
      },
    },
    ...generateMalformedDataTests({
      elementKey: "consumerZipCode",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerZipCodeMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerZipCode,
      canBeANumber: true,
    }),
  ],
});
