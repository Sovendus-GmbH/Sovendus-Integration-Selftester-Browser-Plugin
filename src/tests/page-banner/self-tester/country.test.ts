import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../sovAppData";

executeOverlayTests({
  testName: "countrySuccess",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerCountry.elementValue).toBe("DE");
    expect(sovSelfTester.consumerCountry.statusCode).toBe(StatusCodes.Warning);
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
    expect(sovSelfTester.consumerCountry.statusCode).toBe(StatusCodes.Warning);
    expect(sovSelfTester.consumerCountry.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerCountrySuccess
    );
  },
});
