import { executeOverlayTests } from "../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../sovAppData";

executeOverlayTests({
  testName: "integrationTypeSet",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.integrationType).toBe("test-1.0.0");
  },
});

executeOverlayTests({
  testName: "integrationTypeNotSet",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.integrationType).toBe("unknown");
  },
});

// executeOverlayTests({
//   testName: "integrationTypeMalformed",
//   sovAppData: sovAppDataMalformedButIsOkay,
//   testFunction: async (driver, sovSelfTester) => {
//     expect(sovSelfTester.integrationType).toBe("unknown");
//   },
// });
