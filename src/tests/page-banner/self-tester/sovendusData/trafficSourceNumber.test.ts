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
  testName: "trafficSourceNumber",
  tests: [
    {
      testName: "SuccessAsString",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.trafficSourceNumber.elementValue).toBe("4704");
        expect(sovSelfTester.trafficSourceNumber.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.trafficSourceNumber.statusMessageKey).toBe(
          StatusMessageKeyTypes.trafficSourceNumberSuccess,
        );
      },
    },
    {
      testName: "SuccessAsNumber",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIframesAllValidData,
          trafficSourceNumber: 4704,
        },
      },
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.trafficSourceNumber.elementValue).toBe("4704");
        expect(sovSelfTester.trafficSourceNumber.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.trafficSourceNumber.statusMessageKey).toBe(
          StatusMessageKeyTypes.trafficSourceNumberSuccess,
        );
      },
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.trafficSourceNumber.elementValue).toBe(null);
        expect(sovSelfTester.trafficSourceNumber.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.trafficSourceNumber.statusMessageKey).toBe(
          StatusMessageKeyTypes.missingTrafficSourceNumber,
        );
      },
    },
    ...generateMalformedDataTests({
      elementKey: "trafficSourceNumber",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.trafficSourceNumberMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingTrafficSourceNumber,
      canBeANumber: true,
    }),
  ],
});
