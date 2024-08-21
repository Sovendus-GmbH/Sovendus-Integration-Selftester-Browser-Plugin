import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { executeOverlayTests } from "../../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../../sovAppData";

executeOverlayTests({
  testName: "countrySuccess",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerCountry.elementValue).toBe("DE");
    expect(sovSelfTester.consumerCountry.statusCode).toBe(
      StatusCodes.SuccessButNeedsReview
    );
    expect(sovSelfTester.consumerCountry.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerCountrySuccess
    );
  },
});

executeOverlayTests({
  testName: "countryMissing",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    // TODO Should we changes this behavior?
    expect(sovSelfTester.consumerCountry.elementValue).toBe("DE");
    expect(sovSelfTester.consumerCountry.statusCode).toBe(
      StatusCodes.SuccessButNeedsReview
    );
    expect(sovSelfTester.consumerCountry.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerCountrySuccess
    );
  },
});

executeOverlayTests({
  testName: "countryMalformed",
  sovAppData: sovAppDataMalformedButIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerCountry.elementValue).toBe("Space");
    expect(sovSelfTester.consumerCountry.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerCountry.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerCountryInvalid
    );
  },
});
