import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";
import { sovAppDataEverythingIsOkay, sovAppDataNoParameterButIsOkay } from "../sovAppData";

executeOverlayTests({
  testName: "lastNameSuccess",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerLastName.elementValue).toBe("Smith");
    expect(sovSelfTester.consumerLastName.statusCode).toBe(StatusCodes.Warning);
    expect(sovSelfTester.consumerLastName.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerLastNameSuccess
    );
  },
});

executeOverlayTests({
  testName: "lastNameMissing",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerLastName.elementValue).toBe(null);
    expect(sovSelfTester.consumerLastName.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerLastName.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerLastName
    );
  },
});
