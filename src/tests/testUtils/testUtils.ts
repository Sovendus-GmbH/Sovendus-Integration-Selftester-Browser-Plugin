import { testLoadedIFrameId } from "@src/page-banner/self-test-overlay-css-vars";
import type SelfTester from "@src/page-banner/self-tester";
import type { ExplicitAnyType } from "@src/page-banner/self-tester";
import { platform } from "os";
import { resolve } from "path";
import type { WebDriver } from "selenium-webdriver";
import { Builder, By, until } from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome";
import { Options as EdgeOptions } from "selenium-webdriver/edge";
import { Options as FirefoxOptions } from "selenium-webdriver/firefox";
import { InvalidArgumentError } from "selenium-webdriver/lib/error"; // Import the specific error class
import { Preferences } from "selenium-webdriver/lib/logging";
import { pathToFileURL } from "url";

import type { SovFinalDataType } from "./sovAppData";
import { getSovAppData, sovAwinID } from "./sovAppData";
import type { TestOptionsType, TestsType } from "./testCaseGenerator";

export function executeOverlayTests({
  testName,
  tests,
  browser: _browser,
  isAwinTest = false,
}: {
  testName: string;
  tests: TestsType;
  browser?: Browsers;
  isAwinTest?: boolean;
}): void {
  for (const browser of getBrowsersToTest(_browser)) {
    describe(`${browser}_${testName}`, () => {
      let driver: WebDriver;
      let fileUrl: string;

      beforeAll(() => {
        const driverData = initializeWebDriver(browser);
        driver = driverData.driver;
        fileUrl = driverData.fileUrl;
      });
      for (const testData of tests) {
        test(`${testName}_${testData.testName}`, async () => {
          if (!driver) {
            throw new Error(
              "Failed to start tests, webDriver is not initialized",
            );
          }
          const { sovFinalData, sovAppData } = getSovAppData(testData);
          const sovSelfTester = await prepareTestPageAndRetry({
            sovAppData: sovFinalData,
            driver,
            fileUrl,
            browser,
            retryCounter: 1,
            isAwinTest,
            testOptions: testData.testOptions,
          });
          testData.testFunction({ sovSelfTester, sovAppData });
        }, 300_000);
      }

      afterAll(async () => {
        await driver.quit();
      }, 300_000);
    });
  }
}

async function prepareTestPageAndRetry({
  sovAppData,
  driver,
  fileUrl,
  browser,
  retryCounter,
  testOptions,
  isAwinTest,
}: {
  sovAppData: SovFinalDataType;
  driver: WebDriver;
  fileUrl: string;
  browser: Browsers;
  retryCounter: number;
  testOptions: TestOptionsType | undefined;
  isAwinTest: boolean | undefined;
}): Promise<SelfTester> {
  try {
    return executeWithTimeout(async () => {
      await driver.get(fileUrl);
      const integrationScript = getIntegrationScript({
        sovAppData,
        testOptions,
        isAwinTest,
      });
      await driver.executeScript(integrationScript);
      await waitForTestOverlay(driver);
      const sovSelfTester = await getIntegrationTesterData(driver);
      return sovSelfTester;
    });
  } catch (error) {
    if (retryCounter === 4) {
      throw new Error("Failed to wait for the overlay, aborting now");
    }
    if (
      error instanceof InvalidArgumentError &&
      error.message.includes("binary is not a Firefox executable")
    ) {
      throw new Error(
        "failed to find firefox developer edition binary, make sure it is installed",
      );
    }
    // eslint-disable-next-line no-console
    console.log(
      `Banner didn't load, trying again - tried already ${retryCounter} times - error: ${error as ExplicitAnyType}`,
    );
    retryCounter++;
    // let _driver;
    // if (retryCounter === 2) {
    //   try {
    //     await driver.quit();
    //   } catch (error) {
    //     throw new Error("Failed to close browser before the retry");
    //   }
    //   const { driver: newDriver } = initializeWebDriver(browser);
    //   _driver = newDriver;
    // }
    return prepareTestPageAndRetry({
      sovAppData,
      driver,
      fileUrl,
      browser,
      retryCounter,
      isAwinTest,
      testOptions,
    });
  }
}

const testTimeout =
  (process.env["TEST_TIMEOUT"]
    ? parseInt(process.env["TEST_TIMEOUT"], 30)
    : 30) * 1000;

async function waitForTestOverlay(driver: WebDriver): Promise<void> {
  await driver.wait(
    // TODO fix to find the iframe to be loaded (give Iframe ID when loaded and detect it here)

    until.elementLocated(By.css(`#${testLoadedIFrameId}`)),
    testTimeout,
  );
}

function getIntegrationScript({
  sovAppData,
  testOptions,
  isAwinTest,
}: {
  sovAppData: SovFinalDataType;
  testOptions: TestOptionsType | undefined;
  isAwinTest: boolean | undefined;
}): string {
  if (isAwinTest) {
    return getAwinIntegrationScript({
      sovAppData,
      testOptions,
    });
  }
  return getSovendusIntegrationScript({
    sovAppData,
    testOptions,
  });
}

function getAwinIntegrationScript({
  sovAppData,
  testOptions,
}: {
  sovAppData: SovFinalDataType;
  testOptions: TestOptionsType | undefined;
}): string {
  let salesTrackingScript: string;
  if (testOptions?.awin?.disableAwinSalesTracking) {
    salesTrackingScript = "";
  } else {
    if (!sovAppData.sovIframes?.[0]) {
      throw new Error(
        "You need to pass on sovAppData.sovIframes when using awin sales tracking",
      );
    }
    salesTrackingScript = `
        /*** Do not change ***/
        window.AWIN = window.AWIN || {};
        window.AWIN.Tracking = window.AWIN.Tracking || {};
        window.AWIN.Tracking.Sale = {};

        /*** Set your transaction parameters ***/
        window.AWIN.Tracking.Sale.amount = "${sovAppData.sovIframes[0].orderValue}";
        window.AWIN.Tracking.Sale.channel = "aw";
        window.AWIN.Tracking.Sale.orderRef = "${sovAppData.sovIframes[0].orderId}";
        window.AWIN.Tracking.Sale.parts = "DEFAULT:" + "${sovAppData.sovIframes[0].orderValue}";
        window.AWIN.Tracking.Sale.currency = "${sovAppData.sovIframes[0].orderCurrency}";
        window.AWIN.Tracking.Sale.voucher = "${sovAppData.sovIframes[0].usedCouponCode}";
        window.AWIN.Tracking.Sale.test = "0";
        
        
        var img = document.createElement("img");
        img.border = "0";
        img.height = "0";
        img.width = "0";
        img.style = "display: none;";
        img.src = "https://www.awin1.com/sread.img?tt=ns&tv=2&merchant=${sovAwinID}&amount=${sovAppData.sovIframes[0].orderValue}&ch=aw&parts=DEFAULT:${sovAppData.sovIframes[0].orderValue}&ref=${sovAppData.sovIframes[0].orderId}&cr=${sovAppData.sovIframes[0].orderCurrency}&vc=${sovAppData.sovIframes[0].usedCouponCode}&testmode=0";
        document.body.appendChild(img);
    `;
    if (testOptions?.awin?.addSaleTrackingDelay) {
      salesTrackingScript = `(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        ${salesTrackingScript}
      })();`;
    }
  }
  const integrationScript = `
        ${salesTrackingScript}
        ${awinMasterTagScript}
        ${getChangeSovendusJsScriptTypeScript(
          testOptions?.awin?.sovendusJsScriptType,
          testOptions?.awin?.removeSovendusJs,
          testOptions?.awin?.flexibleIFrameJsScriptType,
        )}
    `;
  return integrationScript;
}

const awinMasterTagScript = `
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.defer = "defer";
        script.src =
          "https://www.dwin1.com/${sovAwinID}.js";
        document.body.appendChild(script);
        `;

function getConsumerAndIframeDataAndAddTimeoutIfEnabled({
  sovAppData,
  testOptions,
}: {
  sovAppData: SovFinalDataType;
  testOptions: TestOptionsType | undefined;
}): string {
  const consumerIntegration = `
    const consumer = ${JSON.stringify(sovAppData.sovConsumer)};
    if (consumer){
      window.sovConsumer = consumer;
    }
    ${
      testOptions?.regular?.removeSovIFrame
        ? ""
        : `
    window.sovIframes =  ${JSON.stringify(sovAppData.sovIframes)};
    `
    }
  `;
  if (testOptions?.regular?.addConsumerIFrameOneSecTimeout) {
    return `(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      ${consumerIntegration}
    })();`;
  }
  return consumerIntegration;
}

function getSovendusIntegrationScript({
  sovAppData,
  testOptions,
}: {
  sovAppData: SovFinalDataType;
  testOptions: TestOptionsType | undefined;
}): string {
  const integrationScript = `
    ${getConsumerAndIframeDataAndAddTimeoutIfEnabled({ sovAppData, testOptions })}

    ${
      testOptions?.regular?.disableSovendusDiv
        ? ""
        : `
          var sovDiv = document.createElement("div");
          sovDiv.id = "sovendus-integration-container"
          document.body.appendChild(sovDiv);
        `
    }
    ${getChangeSovendusJsScriptTypeScript(
      testOptions?.regular?.sovendusJsScriptType,
      testOptions?.regular?.removeSovendusJs,
    )}
    ${
      testOptions?.regular?.disableFlexibleIFrameJs
        ? ""
        : `
          var script = document.createElement("script");
          script.type = ${getFlexibleIFrameScriptType(testOptions)};
          script.async = true;
          script.src =
            "https://testing4.sovendus.com/sovabo/common/js/flexibleIframe.js";
          document.body.appendChild(script);
        `
    }
    ${
      testOptions?.regular?.useAwinMasterTagInRegularIntegration
        ? awinMasterTagScript
        : ""
    }
  `;
  return integrationScript;
}

function getFlexibleIFrameScriptType(
  testOptions: TestOptionsType | undefined,
): string | undefined | null {
  if (testOptions?.regular?.flexibleIFrameJsScriptType === undefined) {
    return '"text/javascript"';
  } else if (testOptions?.regular?.flexibleIFrameJsScriptType === "undefined") {
    return undefined;
  } else if (
    typeof testOptions?.regular?.flexibleIFrameJsScriptType === "string"
  ) {
    return `"${testOptions?.regular?.flexibleIFrameJsScriptType}"`;
  }
  return testOptions?.regular?.flexibleIFrameJsScriptType;
}

function getChangeSovendusJsScriptTypeScript(
  sovendusJsScriptType: string | null | undefined,
  removeSovendusJs: boolean | undefined,
  flexibleIFrameJsScriptType?: string | null | undefined,
): string {
  return sovendusJsScriptType !== undefined ||
    flexibleIFrameJsScriptType !== undefined ||
    removeSovendusJs
    ? `
      const flexibleSources = [
        "api.sovendus.com/sovabo/common/js/flexibleIframe.js",
        "testing4.sovendus.com/sovabo/common/js/flexibleIframe.js"
      ];
      
      function interceptAndBlockScripts(originalMethod) {
        return function(node) {
          ${
            removeSovendusJs
              ? `
                  if (node.tagName === 'SCRIPT' && node.id === 'sovloader-script') {
                    if (${removeSovendusJs}){
                      return
                    }
                  }
                `
              : ""
          }
          ${
            sovendusJsScriptType !== undefined
              ? `
                  if (node.tagName === 'SCRIPT' && node.id === 'sovloader-script') {
                    node.type = ${getNewScriptType(sovendusJsScriptType)};
                  }
                `
              : ""
          }
          ${
            flexibleIFrameJsScriptType !== undefined
              ? `
                  if (node.tagName === 'SCRIPT') {
                    if (node.src && flexibleSources.some((str) => node.src.includes(str))) {
                      node.type = ${getNewScriptType(flexibleIFrameJsScriptType)};
                    }
                  }
                `
              : ""
          }
              
        return originalMethod.apply(this, arguments);
        };
      }

      Node.prototype.appendChild = interceptAndBlockScripts(Node.prototype.appendChild);
    `
    : "";
}

function getNewScriptType(
  scriptType: string | null,
): string | undefined | null {
  if (typeof scriptType === "string") {
    if (scriptType === "undefined") {
      return undefined;
    }
    return `"${scriptType}"`;
  }
  return scriptType;
}

async function executeWithTimeout(
  fn: () => Promise<SelfTester>,
): Promise<SelfTester> {
  return new Promise((resolve, reject) => {
    // Create a timeout promise that rejects after the specified time
    const timeoutId = setTimeout(() => {
      reject(new Error("Failed to wait for the testing page - timed out"));
    }, testTimeout);

    // Execute the async function and resolve/reject the promise when done
    fn()
      .then((result) => {
        resolve(result); // Resolve with the result of the function
      })
      .catch((error) => {
        reject(error); // Reject with the error from the function
      })
      .finally(() => {
        // Clear the timeout once the function completes
        clearTimeout(timeoutId);
      });
  });
}

async function getIntegrationTesterData(
  driver: WebDriver,
): Promise<SelfTester> {
  const script = "return window.sovSelfTester;";
  const sovSelfTester = await driver.executeScript(script);
  return sovSelfTester as SelfTester;
}

function initializeWebDriver(browser: Browsers): {
  driver: WebDriver;
  fileUrl: string;
} {
  let driver: WebDriver;
  const extensionPath =
    browser === Browsers.Firefox
      ? resolve(
          __dirname,
          "../../../test_zips/firefox-test-sovendus-integration_TESTING.xpi",
        )
      : resolve(
          __dirname,
          "../../../test_zips/chrome-test-sovendus-integration_TESTING.crx",
        );
  const preferences = new Preferences();
  // preferences.setLevel(Type.BROWSER, Level.OFF);
  // preferences.setLevel(Type.DRIVER, Level.OFF);
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
    options.addArguments("log-level=3");
    options.addArguments("disable-cache");
    options.addArguments("--disable-gpu");
    driver = new Builder()
      .forBrowser(Browsers.Chrome)
      .setChromeOptions(options)
      .setLoggingPrefs(preferences)
      .build();
  } else if (browser === Browsers.Edge) {
    const options = new browserOptions[browser]();
    options.addArguments("--disable-search-engine-choice-screen");
    // options.addArguments("--auto-open-devtools-for-tabs");
    options.addExtensions(extensionPath);
    options.addArguments("log-level=3");
    options.addArguments("disable-cache");
    options.addArguments("--disable-gpu");
    driver = new Builder()
      .forBrowser(browser)
      .setEdgeOptions(options)
      .setLoggingPrefs(preferences)
      .build();
  } else {
    const options = new browserOptions[browser]();
    options.addArguments("--disable-search-engine-choice-screen");
    options.addExtensions(extensionPath);

    let firefoxDevPath: string;
    if (process.env["FIREFOX_DEVELOPER_EDITION_BINARY_PATH"]) {
      firefoxDevPath = process.env["FIREFOX_DEVELOPER_EDITION_BINARY_PATH"];
    } else {
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
          throw new Error(`Unsupported OS: ${platform()}`);
      }
    }
    options.setBinary(firefoxDevPath);
    options.setPreference("xpinstall.signatures.required", false);
    options.setPreference("extensions.experiments.enabled", true);
    driver = new Builder()
      .forBrowser(browser)
      .setFirefoxOptions(options)
      .setLoggingPrefs(preferences)
      .build();
  }
  const localFilePath = resolve(__dirname, "testHtmlFiles/empty.html");
  const fileUrl = pathToFileURL(localFilePath).toString();
  return {
    driver,
    fileUrl,
  };
}

function getBrowsersToTest(browser: Browsers | undefined): Browsers[] {
  const buildMode = process.env["npm_config_buildmode"] === "true";
  return browser
    ? [browser]
    : buildMode
      ? [
          Browsers.Firefox,
          Browsers.Chrome,
          Browsers.Edge,
          Browsers.Android,
          Browsers.iPhone,
        ]
      : [Browsers.Chrome];
}

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
