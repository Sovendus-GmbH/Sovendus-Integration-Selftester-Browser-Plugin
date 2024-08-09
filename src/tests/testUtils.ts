import { Builder, Browser, By, until, WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import * as path from "path";
import * as url from "url";
import SelfTester from "@src/page-banner/self-tester";

export async function executeOverlayTests(
  testName: string,
  testHtmlFileName: string,
  testFunction: (driver: WebDriver, sovSelfTester: SelfTester) => Promise<void>
) {
  test(
    testName,
    async () => {
      const extensionPath = path.resolve(
        __dirname,
        "../../release_zips/chrome-test-sovendus-integration_TESTING.crx"
      );

      const options = new Options();
      options.addExtensions(extensionPath);
      const driver = new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .build();
      const localFilePath = path.resolve(
        __dirname,
        "page-banner/testHtmlFiles/" + testHtmlFileName
      );
      const fileUrl = url.pathToFileURL(localFilePath).toString();

      try {
        await driver.get(fileUrl);
        await waitForTestOverlay(driver);
        const sovSelfTester = await getIntegrationTesterData(driver);
        await testFunction(driver, sovSelfTester);
      } finally {
        await driver?.quit();
      }
    },
    30000
  );
}

export async function waitForTestOverlay(driver: WebDriver) {
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
