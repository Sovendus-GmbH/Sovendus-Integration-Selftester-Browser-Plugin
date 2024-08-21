import { Builder, Browser, By, until, WebDriver } from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome";
import { Options as EdgeOptions } from "selenium-webdriver/edge";
import { Options as FirefoxOptions } from "selenium-webdriver/firefox";

import {
  getSovAppData,
  malformedArrayData,
  malformedObjectData,
  sovAppDataEverythingIsOkay,
  sovAppDataFalseButIsOkay,
  sovAppDataMalformedArrayButIsOkay,
  sovAppDataMalformedObjectsButIsOkay,
  sovAppDataNoParameterButIsOkay,
  sovAppDataNullButIsOkay,
  sovAppDataNumberButIsOkay,
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

const browserOptions = {
  chrome: ChromeOptions,
  MicrosoftEdge: EdgeOptions,
  firefox: FirefoxOptions,
};

export async function executeOverlayTests({
  testName,
  tests,
  browser = Browser.CHROME,
}: {
  testName: string;
  tests: TestsType;
  browser?: "chrome" | "MicrosoftEdge" | "firefox" | "safari";
}) {
  describe(testName, () => {
    let driver: WebDriver;
    let fileUrl: string;
    beforeAll(() => {
      const extensionPath = resolve(
        __dirname,
        "../../release_zips/chrome-test-sovendus-integration_TESTING.crx",
      );

      const options = new browserOptions[browser]();
      options.addArguments("--disable-search-engine-choice-screen");
      // options.addArguments("--auto-open-devtools-for-tabs");
      options.addExtensions(extensionPath);
      if (browser === Browser.CHROME) {
        driver = new Builder()
          .forBrowser(browser)
          .setChromeOptions(options)
          .build();
      } else if (browser === Browser.EDGE) {
        driver = new Builder()
          .forBrowser(browser)
          .setEdgeOptions(options)
          .build();
      } else {
        driver = new Builder()
          .forBrowser(browser)
          .setFirefoxOptions(options)
          .build();
      }
      const localFilePath = resolve(
        __dirname,
        "page-banner/testHtmlFiles/empty.html",
      );
      fileUrl = pathToFileURL(localFilePath).toString();
    });

    for (const testData of tests) {
      test(`${testName}_${testData.testName}`, async () => {
        const _sovAppData = getSovAppData(testData.sovAppData);
        await prepareTestPageAndRetryForever(
          _sovAppData,
          driver,
          fileUrl,
          1,
          testData.disableFlexibleIframeJs,
          testData.disableSovendusDiv,
        );
        const sovSelfTester = await getIntegrationTesterData(driver);
        await testData.testFunction({ driver, sovSelfTester });
      }, 300_000);
    }

    afterAll(async () => {
      await driver.quit();
    }, 300_000);
  });
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
      expect(sovSelfTester[elementKey].elementValue).toBe(
        testInfo.expectedElementValue,
      );
      expect(sovSelfTester[elementKey].statusCode).toBe(
        testInfo.expectedStatusCode,
      );
      expect(sovSelfTester[elementKey].statusMessageKey).toBe(
        testInfo.expectedStatusMessageKey,
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
}: {
  elementKey: string;
  expectedMalformedStatusMessageKey: StatusMessageKeyTypes;
  expectedMissingStatusMessageKey: StatusMessageKeyTypes;
  canBeANumber?: boolean;
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
    ...(canBeANumber
      ? []
      : [
          {
            testName: "MalformedNumber",
            sovAppData: sovAppDataNumberButIsOkay,
            expectedElementValue: "1234",
            expectedStatusCode: StatusCodes.Error,
            expectedStatusMessageKey: expectedMalformedStatusMessageKey,
          },
        ]),
    {
      testName: "MalformedObject",
      sovAppData: sovAppDataMalformedObjectsButIsOkay,
      expectedElementValue: JSON.stringify(malformedObjectData),
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMalformedStatusMessageKey,
    },
    {
      testName: "MalformedArray",
      sovAppData: sovAppDataMalformedArrayButIsOkay,
      expectedElementValue: JSON.stringify(malformedArrayData),
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMalformedStatusMessageKey,
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
    testsInfo: [...testCasesWhenScriptRuns, ...testCasesWhenScriptDoesNotRun],
  });
}

export type TestsInfoType = {
  testName: string;
  sovAppData: SovDataType;
  expectedElementValue: any;
  expectedStatusCode: StatusCodes;
  expectedStatusMessageKey: StatusMessageKeyTypes;
  disableFlexibleIframeJs?: boolean;
  disableSovendusDiv?: boolean;
}[];

export type TestsType = {
  testName: string;
  sovAppData: SovDataType;
  testFunction: ({
    driver,
    sovSelfTester,
  }: {
    driver: WebDriver;
    sovSelfTester: SelfTester;
  }) => Promise<void>;
  disableFlexibleIframeJs?: boolean | undefined;
  disableSovendusDiv?: boolean | undefined;
}[];

async function prepareTestPageAndRetryForever(
  sovAppData: SovFinalDataType,
  driver: WebDriver,
  fileUrl: string,
  retryCounter: number = 1,
  disableFlexibleIframeJs: boolean | undefined,
  disableSovendusDiv: boolean | undefined,
) {
  try {
    await driver.get(fileUrl);
    await new Promise((r) => setTimeout(r, 2000));
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
    console.log(
      `Banner didn't load, trying again - tried already ${retryCounter} times - error: ${e}`,
    );
    retryCounter += 1;
    await prepareTestPageAndRetryForever(
      sovAppData,
      driver,
      fileUrl,
      retryCounter,
      disableFlexibleIframeJs,
      disableSovendusDiv,
    );
  }
}

async function waitForTestOverlay(driver: WebDriver) {
  await driver.wait(
    until.elementLocated(By.css("#outerSovendusOverlay")),
    10000,
  );
}

async function getIntegrationTesterData(
  driver: WebDriver,
): Promise<SelfTester> {
  const script = "return window.sovSelfTester;";
  const sovSelfTester = await driver.executeScript(script);
  return sovSelfTester as SelfTester;
}
