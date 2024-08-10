import { Browser } from "selenium-webdriver";
import { executeOverlayTests } from "../../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../../sovAppData";

// TODO fix firefox
// executeOverlayTests({
//   testName: "browserNameFirefox",
//   sovAppData: sovAppDataNoParameterButIsOkay,
//   testFunction: async ({ sovSelfTester }) => {
//     expect(sovSelfTester.browserName).toBe("Firefox");
//   },
//   browser: Browser.FIREFOX,
// });

executeOverlayTests({
  testName: "browserName",
  tests: [
    {
      testName: "Edge",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.browserName.elementValue).toBe("Edge");
      },
    },
  ],
  browser: Browser.EDGE,
});

executeOverlayTests({
  testName: "browserName",
  tests: [
    {
      testName: "Chrome",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.browserName.elementValue).toBe("Chrome");
      },
    },
  ],
  browser: Browser.CHROME,
});
