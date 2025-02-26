import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

const insertLandingPageScript = `
  return (async () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.setAttribute('src', "https://www.sovopt.com/test-optimizeId");
    document.body.appendChild(script);
  })();
`;

const insertThankYouPageScript = `
  return (async () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.setAttribute('src', "https://www.sovopt.com/test-optimizeId/conversion/?ordervalue=123&ordernumber=456&vouchercode=test123&email=test@example.com&subtext=Test");
    document.body.appendChild(script);
  })();
`;

const executeLandingPageDetectionScript = `
  return (async () => {
    const scripts = Array.from(document.querySelectorAll("script"));
    const landingPageScript = scripts.find(script =>
      script.src.startsWith("https://www.sovopt.com/") &&
      !script.src.includes("conversion")
    );
    const thankYouPageScript = scripts.find(script =>
      script.src.startsWith("https://www.sovopt.com/") &&
      script.src.includes("conversion")
    );

    return {
      isLandingPage: !!landingPageScript,
      isThankYouPage: !!thankYouPageScript,
    };
  })();
`;

executeOverlayTests({
  testName: "landingPageDetection",
  tests: [
    {
      testName: "isLandingPage",
      sovAppData: sovAppDataEverythingIsOkay,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        await driver.executeScript(insertLandingPageScript);

        const detectionResult = await driver.executeScript(
          executeLandingPageDetectionScript,
        );
        expect(detectionResult).toStrictEqual({
          isLandingPage: true,
          isThankYouPage: false,
        });
      },
    },
    {
      testName: "notLandingPage",
      sovAppData: sovAppDataEverythingIsOkay,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      testFunction: async ({ driver }): Promise<void> => {
        await driver.executeScript(insertThankYouPageScript);

        const detectionResult = await driver.executeScript(
          executeLandingPageDetectionScript,
        );
        expect(detectionResult).toStrictEqual({
          isLandingPage: false,
          isThankYouPage: true,
        });
      },
    },
  ],
});
