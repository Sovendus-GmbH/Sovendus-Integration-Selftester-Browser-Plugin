import { Builder, Browser, By, until, WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import * as path from "path";
import * as url from "url";

import { getSovAppData, SovDataType } from "./page-banner/sovAppData";
import SelfTester from "@src/page-banner/self-tester";

export async function executeOverlayTests({
  testName,
  sovAppData,
  testFunction,
  testOnly,
}: {
  testName: string;
  sovAppData: SovDataType;
  testFunction: (driver: WebDriver, sovSelfTester: SelfTester) => Promise<void>;
  testOnly?: boolean;
}) {
  const jestFunction = testOnly ? test.only : test;
  jestFunction(
    testName,
    async () => {
      const extensionPath = path.resolve(
        __dirname,
        "../../release_zips/chrome-test-sovendus-integration_TESTING.crx"
      );

      const options = new Options();
      options.addArguments("--disable-search-engine-choice-screen");
      options.addExtensions(extensionPath);
      const driver = new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .build();
      const localFilePath = path.resolve(
        __dirname,
        "page-banner/testHtmlFiles/empty.html"
      );
      const fileUrl = url.pathToFileURL(localFilePath).toString();
      const _sovAppData = getSovAppData(sovAppData);
      try {
        await driver.get(fileUrl);
        const integrationScript = `
          const consumer = ${JSON.stringify(_sovAppData.sovConsumer)};
          if (consumer){
            window.sovConsumer = consumer;
          }
          window.sovIframes =  ${JSON.stringify(_sovAppData.sovIframes)};

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
        const sovSelfTester = await getIntegrationTesterData(driver);
        await testFunction(driver, sovSelfTester);
      } finally {
        await driver?.quit();
      }
    },
    300000
  );
}

export async function waitForTestOverlay(driver: WebDriver) {
  await driver.wait(
    until.elementLocated(By.css("#outerSovendusOverlay")),
    2000000
  );
}

async function getIntegrationTesterData(
  driver: WebDriver
): Promise<SelfTester> {
  const script = "return window.sovSelfTester;";
  const sovSelfTester = await driver.executeScript(script);
  return sovSelfTester as SelfTester;
}
