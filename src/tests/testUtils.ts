import { Builder, Browser, By, until, WebDriver } from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome";
import { Options as EdgeOptions } from "selenium-webdriver/edge";
import { Options as FirefoxOptions } from "selenium-webdriver/firefox";

import {
  getSovAppData,
  SovDataType,
  SovFinalDataType,
} from "./page-banner/sovAppData";
import SelfTester from "@src/page-banner/self-tester";
import { resolve } from "path";
import { pathToFileURL } from "url";

const browserOptions = {
  chrome: ChromeOptions,
  MicrosoftEdge: EdgeOptions,
  firefox: FirefoxOptions,
};

export async function executeOverlayTests({
  testName,
  sovAppData,
  testFunction,
  testOnly,
  browser = Browser.CHROME,
}: {
  testName: string;
  sovAppData: SovDataType;
  testFunction: ({
    driver,
    sovSelfTester,
  }: {
    driver: WebDriver;
    sovSelfTester: SelfTester;
  }) => Promise<void>;
  testOnly?: boolean;
  browser?: "chrome" | "MicrosoftEdge" | "firefox" | "safari";
}) {
  const jestFunction = testOnly ? test.only : test;
  jestFunction(
    testName,
    async () => {
      const extensionPath = resolve(
        __dirname,
        "../../release_zips/chrome-test-sovendus-integration_TESTING.crx"
      );

      const options = new browserOptions[browser]();
      options.addArguments("--disable-search-engine-choice-screen");
      options.addArguments("--auto-open-devtools-for-tabs");
      options.addExtensions(extensionPath);
      let driver: WebDriver;
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
        "page-banner/testHtmlFiles/empty.html"
      );
      const fileUrl = pathToFileURL(localFilePath).toString();
      const _sovAppData = getSovAppData(sovAppData);
      try {
        await prepareTestPageAndRetryForever(_sovAppData, driver, fileUrl);
        const sovSelfTester = await getIntegrationTesterData(driver);
        await testFunction({ driver, sovSelfTester });
      } finally {
        await driver?.quit();
      }
    },
    300000
  );
}

async function prepareTestPageAndRetryForever(
  sovAppData: SovFinalDataType,
  driver: WebDriver,
  fileUrl: string,
  retryCounter: number = 1
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

      var sovDiv = document.createElement("div");
      sovDiv.id = "sovendus-integration-container"
      document.body.appendChild(sovDiv);

      var script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "https://api.sovendus.com/sovabo/common/js/flexibleIframe.js";
      document.body.appendChild(script);
    `;
    await driver.executeScript(integrationScript);
    await waitForTestOverlay(driver);
  } catch (e) {
    console.log(
      `Banner didnt load, trying again - tried already ${retryCounter} times - error: ${e}`
    );
    retryCounter += 1;
    await prepareTestPageAndRetryForever(
      sovAppData,
      driver,
      fileUrl,
      retryCounter
    );
  }
}

async function waitForTestOverlay(driver: WebDriver) {
  await driver.wait(
    until.elementLocated(By.css("#outerSovendusOverlay")),
    10000
  );
}

async function getIntegrationTesterData(
  driver: WebDriver
): Promise<SelfTester> {
  const script = "return window.sovSelfTester;";
  const sovSelfTester = await driver.executeScript(script);
  return sovSelfTester as SelfTester;
}
