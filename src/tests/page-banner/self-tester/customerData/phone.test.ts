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
  testName: "phone",
  tests: [
    {
      testName: "SuccessAsString",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerPhone.elementValue).toBe("+4915512005211");
        expect(sovSelfTester.consumerPhone.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerPhone.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerPhoneSuccess,
        );
      },
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerPhone.elementValue).toBe(null);
        expect(sovSelfTester.consumerPhone.statusCode).toBe(StatusCodes.Error);
        expect(sovSelfTester.consumerPhone.statusMessageKey).toBe(
          StatusMessageKeyTypes.missingConsumerPhone,
        );
      },
    },
    ...generateMalformedDataTests({
      elementKey: "consumerPhone",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerPhoneMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerPhone,
    }),
  ],
});
