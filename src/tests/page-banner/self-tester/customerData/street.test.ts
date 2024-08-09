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
  testName: "streetSuccess",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerStreet.elementValue).toBe("test street");
    expect(sovSelfTester.consumerStreet.statusCode).toBe(
      StatusCodes.SuccessButNeedsReview
    );
    expect(sovSelfTester.consumerStreet.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerStreetSuccess
    );
  },
});

executeOverlayTests({
  testName: "streetMissing",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerStreet.elementValue).toBe(null);
    expect(sovSelfTester.consumerStreet.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerStreet.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerStreet
    );
  },
});
