import { sovAppDataEverythingIsOkay } from "@src/tests/testUtils/sovAppData";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";
import { resolve } from "path";
import { pathToFileURL } from "url";

executeOverlayTests({
  testName: "website",
  tests: [
    {
      testName: "URL",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: ({ sovSelfTester }): void => {
        const localFilePath = resolve(
          __dirname,
          "../../../testUtils/testHtmlFiles/empty.html",
        );
        const fileUrl = pathToFileURL(localFilePath).toString();
        expect(sovSelfTester.websiteURL.elementValue).toBe(fileUrl);
      },
    },
  ],
});
