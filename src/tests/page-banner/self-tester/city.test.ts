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
  testName: "citySuccess",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerCity.elementValue).toBe("Karlsruhe");
    expect(sovSelfTester.consumerCity.statusCode).toBe(StatusCodes.Warning);
    expect(sovSelfTester.consumerCity.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerCitySuccess
    );
  },
});

executeOverlayTests({
  testName: "cityMissing",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerCity.elementValue).toBe(null);
    expect(sovSelfTester.consumerCity.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerCity.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerCity
    );
  },
});
