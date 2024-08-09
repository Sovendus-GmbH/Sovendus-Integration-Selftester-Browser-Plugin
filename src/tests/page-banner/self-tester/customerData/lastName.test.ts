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
  testName: "lastNameSuccess",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerLastName.elementValue).toBe("Smith");
    expect(sovSelfTester.consumerLastName.statusCode).toBe(
      StatusCodes.SuccessButNeedsReview
    );
    expect(sovSelfTester.consumerLastName.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerLastNameSuccess
    );
  },
});

executeOverlayTests({
  testName: "lastNameMissing",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerLastName.elementValue).toBe(null);
    expect(sovSelfTester.consumerLastName.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerLastName.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerLastName
    );
  },
});
