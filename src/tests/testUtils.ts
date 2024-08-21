import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome";
import { Options as EdgeOptions } from "selenium-webdriver/edge";
import { Options as FirefoxOptions } from "selenium-webdriver/firefox";

import {
  getSovAppData,
  malformedArrayData,
  malformedObjectData,
  sovAppDataFalseButIsOkay,
  sovAppDataFloatNumberButIsOkay,
  sovAppDataMalformedArrayButIsOkay,
  sovAppDataMalformedObjectsButIsOkay,
  sovAppDataNullButIsOkay,
  sovAppDataNumberButIsOkay,
  sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
  sovAppDataTrueButIsOkay,
  sovAppDataUndefinedButIsOkay,
  SovDataType,
  SovFinalDataType,
} from "./page-banner/sovAppData";
import SelfTester from "@src/page-banner/self-tester";
import { resolve } from "path";
import { pathToFileURL } from "url";
import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { platform } from "os";

export enum Browsers {
  Chrome = "chrome",
  Edge = "MicrosoftEdge",
  Firefox = "firefox",
  // Safari = "safari",
  iPhone = "iphone",
  Android = "android",
}

const browserOptions = {
  [Browsers.Chrome]: ChromeOptions,
  [Browsers.Edge]: EdgeOptions,
  [Browsers.Firefox]: FirefoxOptions,
  // [Browsers.Safari]: SafariOptions,
  [Browsers.iPhone]: ChromeOptions,
  [Browsers.Android]: ChromeOptions,
};

export async function executeOverlayTests({
  testName,
  tests,
  browser,
}: {
  testName: string;
  tests: TestsType;
  browser?: Browsers;
}) {
  const buildMode = process.env.npm_config_buildmode === "true";
  for (const _browser of browser
    ? [browser]
    : buildMode
      ? [
          Browsers.Firefox,
          Browsers.Chrome,
          Browsers.Edge,
          Browsers.Android,
          Browsers.iPhone,
        ]
      : [Browsers.Chrome]) {
    describe(`${_browser}_${testName}`, () => {
      let driver: WebDriver;
      let fileUrl: string;

      beforeAll(() => {
        const driverData = initializeWebDriver(_browser);
        driver = driverData.driver;
        fileUrl = driverData.fileUrl;
      });

      for (const testData of tests) {
        test(`${_browser}_${testName}_${testData.testName}`, async () => {
          const sovAppData =
            typeof testData.sovAppData === "function"
              ? testData.sovAppData()
              : testData.sovAppData;
          const _sovAppData = getSovAppData(sovAppData);
          await prepareTestPageAndRetry(
            _sovAppData,
            driver,
            fileUrl,
            1,
            testData.disableFlexibleIframeJs,
            testData.disableSovendusDiv,
          );
          const sovSelfTester = await getIntegrationTesterData(driver);
          await testData.testFunction({ driver, sovSelfTester, sovAppData });
        }, 300_000);
      }

      afterAll(async () => {
        await driver.quit();
      }, 300_000);
    });
  }
}

function initializeWebDriver(browser: Browsers) {
  let driver: WebDriver;
  const extensionPath =
    browser === "firefox"
      ? resolve(
          __dirname,
          "../../release_zips/firefox-test-sovendus-integration_TESTING.xpi",
        )
      : resolve(
          __dirname,
          "../../release_zips/chrome-test-sovendus-integration_TESTING.crx",
        );

  if (
    browser === Browsers.Chrome ||
    browser === Browsers.Android ||
    browser === Browsers.iPhone
  ) {
    const options = new browserOptions[browser]();
    if (browser === Browsers.Android || browser === Browsers.iPhone) {
      const mobileEmulation = {
        deviceName: browser === Browsers.Android ? "Pixel 7" : "iPhone 12 Pro",
      };
      options.setMobileEmulation(mobileEmulation);
    }
    options.addArguments("--disable-search-engine-choice-screen");
    // options.addArguments("--auto-open-devtools-for-tabs");
    options.addExtensions(extensionPath);
    driver = new Builder()
      .forBrowser(Browsers.Chrome)
      .setChromeOptions(options)
      .build();
  } else if (browser === Browsers.Edge) {
    const options = new browserOptions[browser]();
    options.addArguments("--disable-search-engine-choice-screen");
    // options.addArguments("--auto-open-devtools-for-tabs");
    options.addExtensions(extensionPath);
    driver = new Builder().forBrowser(browser).setEdgeOptions(options).build();
  } else {
    const options = new browserOptions[browser]();
    options.addArguments("--disable-search-engine-choice-screen");
    options.addExtensions(extensionPath);

    let firefoxDevPath: string;
    switch (platform()) {
      case "win32":
        firefoxDevPath =
          "C:\\Program Files\\Firefox Developer Edition\\firefox.exe";
        break;
      case "darwin":
        firefoxDevPath =
          "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox";
        break;
      case "linux":
        firefoxDevPath = "/usr/bin/firefox-developer-edition";
        break;
      default:
        throw new Error("Unsupported OS: " + platform());
    }
    options.setBinary(firefoxDevPath);
    options.setPreference("xpinstall.signatures.required", false);
    options.setPreference("extensions.experiments.enabled", true);
    driver = new Builder()
      .forBrowser(browser)
      .setFirefoxOptions(options)
      .build();
  }
  const localFilePath = resolve(
    __dirname,
    "page-banner/testHtmlFiles/empty.html",
  );
  const fileUrl = pathToFileURL(localFilePath).toString();
  return {
    driver,
    fileUrl,
  };
}

export function generateTests({
  elementKey,
  testsInfo,
}: {
  elementKey: string;
  testsInfo: TestsInfoType;
}): TestsType {
  return testsInfo.map((testInfo) => ({
    testName: testInfo.testName,
    sovAppData: testInfo.sovAppData,
    testFunction: async ({ sovSelfTester }) => {
      expect((sovSelfTester as any)[elementKey].elementValue).toBe(
        testInfo.expectedElementValue,
      );
      expect((sovSelfTester as any)[elementKey].statusMessageKey).toBe(
        testInfo.expectedStatusMessageKey,
      );
      expect((sovSelfTester as any)[elementKey].statusCode).toBe(
        testInfo.expectedStatusCode,
      );
    },
    disableFlexibleIframeJs: testInfo.disableFlexibleIframeJs,
  }));
}

export function generateMalformedDataTests({
  elementKey,
  expectedMalformedStatusMessageKey,
  expectedMissingStatusMessageKey,
  canBeANumber,
  skipNumberCheck,
  objectElementValueType = "stringified",
}: {
  elementKey: string;
  expectedMalformedStatusMessageKey: StatusMessageKeyTypes;
  expectedMissingStatusMessageKey: StatusMessageKeyTypes;
  canBeANumber?: boolean;
  skipNumberCheck?: boolean;
  objectElementValueType?: "stringified" | "objectObject";
}): TestsType {
  const testCasesWhenScriptRuns = [
    {
      testName: "MalformedTrue",
      sovAppData: sovAppDataTrueButIsOkay,
      expectedElementValue: "true",
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMalformedStatusMessageKey,
    },
    {
      testName: "MalformedFalse",
      sovAppData: sovAppDataFalseButIsOkay,
      expectedElementValue: "false",
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMalformedStatusMessageKey,
    },
    ...(skipNumberCheck
      ? []
      : canBeANumber
        ? [
            {
              testName: "MalformedNumberWithCommaInsteadOfDot",
              sovAppData: sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
              expectedElementValue: "1234,56",
              expectedStatusCode: StatusCodes.Error,
              expectedStatusMessageKey: expectedMalformedStatusMessageKey,
            },
          ]
        : [
            {
              testName: "MalformedNumber",
              sovAppData: sovAppDataNumberButIsOkay,
              expectedElementValue: "1234",
              expectedStatusCode: StatusCodes.Error,
              expectedStatusMessageKey: expectedMalformedStatusMessageKey,
            },
            {
              testName: "MalformedFloatNumber",
              sovAppData: sovAppDataFloatNumberButIsOkay,
              expectedElementValue: "1234.56",
              expectedStatusCode: StatusCodes.Error,
              expectedStatusMessageKey: expectedMalformedStatusMessageKey,
            },
          ]),
    {
      testName: "Missing",
      sovAppData: sovAppDataNullButIsOkay,
      expectedElementValue: null,
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMissingStatusMessageKey,
    },
    {
      testName: "MalformedNull",
      sovAppData: sovAppDataNullButIsOkay,
      expectedElementValue: null,
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMissingStatusMessageKey,
    },
    {
      testName: "MalformedUndefined",
      sovAppData: sovAppDataUndefinedButIsOkay,
      expectedElementValue: null,
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMissingStatusMessageKey,
    },
  ];

  const testCasesWhenScriptDoesNotRun = testCasesWhenScriptRuns.map(
    (testInfo) => ({
      ...testInfo,
      testName: `${testInfo.testName}_WhenScriptDoesNotRun`,
      disableFlexibleIframeJs: true,
    }),
  );
  return generateTests({
    elementKey,
    testsInfo: [
      ...testCasesWhenScriptRuns,
      ...testCasesWhenScriptDoesNotRun,
      {
        testName: "MalformedObject",
        sovAppData: sovAppDataMalformedObjectsButIsOkay,
        expectedElementValue:
          objectElementValueType === "stringified"
            ? JSON.stringify(malformedObjectData)
            : "[object Object]",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: expectedMalformedStatusMessageKey,
      },
      {
        testName: "MalformedArray",
        sovAppData: sovAppDataMalformedArrayButIsOkay,
        expectedElementValue:
          objectElementValueType === "stringified"
            ? JSON.stringify(malformedArrayData)
            : "[object Object]",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: expectedMalformedStatusMessageKey,
      },
      {
        testName: "MalformedObject_WhenScriptDoesNotRun",
        sovAppData: sovAppDataMalformedObjectsButIsOkay,
        expectedElementValue: JSON.stringify(malformedObjectData),
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: expectedMalformedStatusMessageKey,
        disableFlexibleIframeJs: true,
      },
      {
        testName: "MalformedArray_WhenScriptDoesNotRun",
        sovAppData: sovAppDataMalformedArrayButIsOkay,
        expectedElementValue: JSON.stringify(malformedArrayData),
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: expectedMalformedStatusMessageKey,
        disableFlexibleIframeJs: true,
      },
    ],
  });
}

export type TestsInfoType = {
  testName: string;
  sovAppData: SovDataType;
  expectedElementValue: any;
  expectedStatusCode: StatusCodes;
  expectedStatusMessageKey: StatusMessageKeyTypes | null;
  disableFlexibleIframeJs?: boolean;
  disableSovendusDiv?: boolean;
}[];

export type TestsType = {
  testName: string;
  sovAppData: SovDataType | (() => SovDataType);
  testFunction: ({
    driver,
    sovSelfTester,
    sovAppData,
  }: {
    driver: WebDriver;
    sovSelfTester: SelfTester;
    sovAppData: SovDataType;
  }) => Promise<void>;
  disableFlexibleIframeJs?: boolean | undefined;
  disableSovendusDiv?: boolean | undefined;
}[];

async function prepareTestPageAndRetry(
  sovAppData: SovFinalDataType,
  driver: WebDriver,
  fileUrl: string,
  retryCounter: number = 1,
  disableFlexibleIframeJs: boolean | undefined,
  disableSovendusDiv: boolean | undefined,
): Promise<WebDriver> {
  try {
    await driver.get(fileUrl);
    const integrationScript = `
      const consumer = ${JSON.stringify(sovAppData.sovConsumer)};
      if (consumer){
        window.sovConsumer = consumer;
      }
      window.sovIframes =  ${JSON.stringify(sovAppData.sovIframes)};

      ${
        disableSovendusDiv
          ? ""
          : `
            var sovDiv = document.createElement("div");
            sovDiv.id = "sovendus-integration-container"
            document.body.appendChild(sovDiv);
          `
      }

      ${
        disableFlexibleIframeJs
          ? ""
          : `
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src =
              "https://api.sovendus.com/sovabo/common/js/flexibleIframe.js";
            document.body.appendChild(script);
          `
      }
    `;
    await driver.executeScript(integrationScript);
    await waitForTestOverlay(driver);
  } catch (e) {
    if (retryCounter === 3) {
      throw new Error("Failed to wait for the overlay, aborting now");
    }
    console.log(
      `Banner didn't load, trying again - tried already ${retryCounter} times - error: ${e}`,
    );
    retryCounter++;
    await prepareTestPageAndRetry(
      sovAppData,
      driver,
      fileUrl,
      retryCounter,
      disableFlexibleIframeJs,
      disableSovendusDiv,
    );
  }
  return driver;
}

async function waitForTestOverlay(driver: WebDriver) {
  await driver.wait(
    until.elementLocated(By.css("#outerSovendusOverlay")),
    15000,
  );
}

async function getIntegrationTesterData(
  driver: WebDriver,
): Promise<SelfTester> {
  const script = "return window.sovSelfTester;";
  const sovSelfTester = await driver.executeScript(script);
  return sovSelfTester as SelfTester;
}
