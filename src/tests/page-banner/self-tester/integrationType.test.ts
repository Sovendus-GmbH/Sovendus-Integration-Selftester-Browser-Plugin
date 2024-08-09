import { executeOverlayTests } from "../../testUtils";

executeOverlayTests(
  "integrationTypeSet",
  "everythingIsOkay.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.integrationType).toBe("test-1.0.0");
  }
);

executeOverlayTests(
  "integrationTypeNotSet",
  "noParameterButOkay.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.integrationType).toBe("unknown");
  }
);

executeOverlayTests(
  "integrationTypeNotSet",
  "noParameterButOkay.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.integrationType).toBe("unknown");
  }
);

// executeOverlayTests(
//   "integrationTypeMalformed",
//   "okayButMalformedData.html",
//   async (driver, sovSelfTester) => {
//     expect(sovSelfTester.integrationType).toBe("unknown");
//   }
// );
