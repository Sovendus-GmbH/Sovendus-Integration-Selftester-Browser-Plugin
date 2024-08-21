import { BrowserTypes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "src/tests/testUtils/sovAppData";
import { Browsers, executeOverlayTests } from "src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "browserName",
  tests: [
    {
      testName: "Firefox",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: ({ sovSelfTester }): void => {
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
      testFunction: ({ sovSelfTester }): void => {
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
      testFunction: ({ sovSelfTester }): void => {
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
      testFunction: ({ sovSelfTester }): void => {
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
      testFunction: ({ sovSelfTester }): void => {
        expect(sovSelfTester.browserName.elementValue).toBe(
          BrowserTypes.Android,
        );
      },
    },
  ],
  browser: Browsers.Android,
});
