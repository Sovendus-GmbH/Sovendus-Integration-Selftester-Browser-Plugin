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
  testName: "ZipCodeSuccess",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerZipCode.elementValue).toBe("76135");
    expect(sovSelfTester.consumerZipCode.statusCode).toBe(
      StatusCodes.SuccessButNeedsReview
    );
    expect(sovSelfTester.consumerZipCode.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerZipCodeSuccess
    );
  },
});

executeOverlayTests({
  testName: "ZipCodeMissing",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerZipCode.elementValue).toBe(null);
    expect(sovSelfTester.consumerZipCode.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerZipCode.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerZipCode
    );
  },
});
