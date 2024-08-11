import { BrowserTypes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { Browsers, executeOverlayTests } from "../../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../../sovAppData";

executeOverlayTests({
  testName: "browserName",
  tests: [
    {
      testName: "Firefox",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.browserName.elementValue).toBe(
          BrowserTypes.Firefox,
        );
      },
    },
  ],
  browser: Browsers.Firefox,
});
executeOverlayTests({
  testName: "browserName",
  tests: [
    {
      testName: "Edge",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.browserName.elementValue).toBe(BrowserTypes.Edge);
      },
    },
  ],
  browser: Browsers.Edge,
});

executeOverlayTests({
  testName: "browserName",
  tests: [
    {
      testName: "Chrome",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.browserName.elementValue).toBe(
          BrowserTypes.Chrome,
        );
      },
    },
  ],
  browser: Browsers.Chrome,
});

executeOverlayTests({
  testName: "browserName",
  tests: [
    {
      testName: "iPhone",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.browserName.elementValue).toBe(
          BrowserTypes.iPhone,
        );
      },
    },
  ],
  browser: Browsers.iPhone,
});

executeOverlayTests({
  testName: "browserName",
  tests: [
    {
      testName: "Android",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.browserName.elementValue).toBe(
          BrowserTypes.Android,
        );
      },
    },
  ],
  browser: Browsers.Android,
});
