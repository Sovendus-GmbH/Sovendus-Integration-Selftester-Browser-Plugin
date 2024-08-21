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
import type { TestsType } from "./testCaseGenerator";

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

export function executeOverlayTests({
  testName,
  tests,
  browser,
  isAwinTest = false,
}: {
  testName: string;
  tests: TestsType;
  browser?: Browsers;
  isAwinTest?: boolean;
}): void {
  const buildMode = process.env["npm_config_buildmode"] === "true";
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
      let driver: WebDriver | undefined;
      let fileUrl: string;

      beforeAll(() => {
        const driverData = initializeWebDriver(_browser);
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
          const sovAppData =
            typeof testData.sovAppData === "function"
              ? testData.sovAppData()
              : testData.sovAppData;
          const _sovAppData = getSovAppData(sovAppData);
          driver = await prepareTestPageAndRetry({
            sovAppData: _sovAppData,
            driver,
            fileUrl,
            browser: _browser,
            retryCounter: 1,
            isAwinTest,
            disableFlexibleIFrameJs: testData.disableFlexibleIFrameJs,
            disableSovendusDiv: testData.disableSovendusDiv,
            disableAwinSalesTracking: testData.disableAwinSalesTracking,
            removeSovIFrame: testData.removeSovIFrame,
            flexibleIFrameJsScriptType: testData.flexibleIFrameJsScriptType,
          });
          const sovSelfTester = await getIntegrationTesterData(driver);
          testData.testFunction({ driver, sovSelfTester, sovAppData });
        }, 300_000);
      }

      afterAll(async () => {
        await driver?.quit();
      }, 300_000);
    });
  }
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

async function prepareTestPageAndRetry({
  sovAppData,
  driver,
  fileUrl,
  browser,
  retryCounter,
  disableFlexibleIFrameJs,
  disableSovendusDiv,
  isAwinTest,
  disableAwinSalesTracking,
  removeSovIFrame,
  flexibleIFrameJsScriptType = "text/javascript",
}: {
  sovAppData: SovFinalDataType;
  driver: WebDriver;
  fileUrl: string;
  browser: Browsers;
  retryCounter: number;
  disableFlexibleIFrameJs: boolean | undefined;
  disableSovendusDiv: boolean | undefined;
  isAwinTest: boolean | undefined;
  disableAwinSalesTracking: boolean | undefined;
  removeSovIFrame: boolean | undefined;
  flexibleIFrameJsScriptType: string | undefined | null;
}): Promise<WebDriver> {
  let _driver = driver;
  try {
    await executeWithTimeout(async () => {
      await driver.get(fileUrl);
      let integrationScript: string;
      if (!isAwinTest) {
        integrationScript = `
        const consumer = ${JSON.stringify(sovAppData.sovConsumer)};
        if (consumer){
          window.sovConsumer = consumer;
        }
        ${
          removeSovIFrame
            ? ""
            : `
        window.sovIframes =  ${JSON.stringify(sovAppData.sovIframes)};
        `
        }
  
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
          disableFlexibleIFrameJs
            ? ""
            : `
              var script = document.createElement("script");
              script.type = ${flexibleIFrameJsScriptType === "undefined" ? undefined : typeof flexibleIFrameJsScriptType === "string" ? `"${flexibleIFrameJsScriptType}"` : flexibleIFrameJsScriptType};
              script.async = true;
              script.src =
                "https://testing4.sovendus.com/sovabo/common/js/flexibleIframe.js";
              document.body.appendChild(script);
            `
        }
      `;
      } else {
        let salesTrackingScript: string;
        if (disableAwinSalesTracking) {
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
        }
        integrationScript = `
            ${salesTrackingScript}
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.defer = "defer";
            script.src =
              "https://www.dwin1.com/${sovAwinID}.js";
            document.body.appendChild(script);
        `;
      }
      await _driver.executeScript(integrationScript);
      await waitForTestOverlay(_driver);
    });
  } catch (error) {
    if (retryCounter === 3) {
      throw new Error("Failed to wait for the overlay, aborting now");
    }
    if (
      error instanceof InvalidArgumentError &&
      error.message.includes("binary is not a Firefox executable")
    ) {
      throw new Error(
        "failed to find firefox developer edition binary, make sure it is installed ",
      );
    }
    // eslint-disable-next-line no-console
    console.log(
      `Banner didn't load, trying again - tried already ${retryCounter} times - error: ${error as ExplicitAnyType}`,
    );
    retryCounter++;
    // try {
    //   await _driver.quit();
    // } catch (error) {
    //   throw new Error("Failed to close browser before the retry");
    // }
    // const { driver: newDriver } = initializeWebDriver(browser);
    // _driver = newDriver;
    _driver = await prepareTestPageAndRetry({
      sovAppData,
      driver,
      fileUrl,
      browser,
      retryCounter,
      disableFlexibleIFrameJs,
      disableSovendusDiv,
      isAwinTest,
      disableAwinSalesTracking,
      removeSovIFrame,
      flexibleIFrameJsScriptType,
    });
  }
  return _driver;
}

const testTimeout =
  (process.env["TEST_TIMEOUT"]
    ? parseInt(process.env["TEST_TIMEOUT"], 30)
    : 30) * 1000;

async function waitForTestOverlay(driver: WebDriver): Promise<void> {
  await driver.wait(
    until.elementLocated(By.css("#outerSovendusOverlay")),
    testTimeout,
  );
}

async function executeWithTimeout(fn: () => Promise<void>): Promise<void> {
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
