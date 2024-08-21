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
  testName: "trafficMediumNumber",
  tests: [
    {
      testName: "SuccessAsString",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.trafficMediumNumber.elementValue).toBe("5");
        expect(sovSelfTester.trafficMediumNumber.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.trafficMediumNumber.statusMessageKey).toBe(
          StatusMessageKeyTypes.trafficMediumNumberSuccess,
        );
      },
    },
    {
      testName: "SuccessAsNumber",
      sovAppData: {
        sovConsumer: sovAppConsumerAllValidData,
        sovIframes1: {
          ...sovAppIframesAllValidData,
          trafficMediumNumber: 5,
        },
      },
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.trafficMediumNumber.elementValue).toBe("5");
        expect(sovSelfTester.trafficMediumNumber.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.trafficMediumNumber.statusMessageKey).toBe(
          StatusMessageKeyTypes.trafficMediumNumberSuccess,
        );
      },
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.trafficMediumNumber.elementValue).toBe(null);
        expect(sovSelfTester.trafficMediumNumber.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.trafficMediumNumber.statusMessageKey).toBe(
          StatusMessageKeyTypes.missingTrafficMediumNumber,
        );
      },
    },
    ...generateMalformedDataTests({
      elementKey: "trafficMediumNumber",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.trafficMediumNumberMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingTrafficMediumNumber,
      canBeANumber: true,
    }),
  ],
});
