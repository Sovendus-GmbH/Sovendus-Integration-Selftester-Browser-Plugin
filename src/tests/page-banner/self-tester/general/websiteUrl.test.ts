import { resolve } from "path";
import { executeOverlayTests } from "../../../testUtils/testUtils";
import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import { pathToFileURL } from "url";

executeOverlayTests({
  testName: "website",
  tests: [
    {
      testName: "URL",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
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
