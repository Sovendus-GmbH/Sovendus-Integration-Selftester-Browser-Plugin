import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { executeOverlayTests } from "../../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../../sovAppData";

executeOverlayTests({
  testName: "streetNumberSuccess",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerStreetNumber.elementValue).toBe("1a");
    expect(sovSelfTester.consumerStreetNumber.statusCode).toBe(
      StatusCodes.SuccessButNeedsReview
    );
    expect(sovSelfTester.consumerStreetNumber.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerStreetNumberSuccess
    );
  },
});

executeOverlayTests({
  testName: "streetNumberMissing",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerStreetNumber.elementValue).toBe(null);
    expect(sovSelfTester.consumerStreetNumber.statusCode).toBe(
      StatusCodes.Error
    );
    expect(sovSelfTester.consumerStreetNumber.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerStreetNumber
    );
  },
});
