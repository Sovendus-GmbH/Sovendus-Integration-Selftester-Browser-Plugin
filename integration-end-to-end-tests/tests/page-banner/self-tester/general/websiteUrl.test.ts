import { resolve } from "path";
import { pathToFileURL } from "url";

import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "websiteURL",
  tests: [
    {
      testName: "URL",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: ({ sovSelfTester }): void => {
        const localFilePath = resolve(
          __dirname,
          "../../../../testUtils/testHtmlFiles/empty.html",
        );
        const fileUrl = pathToFileURL(localFilePath).toString();
        expect(sovSelfTester.websiteURL.elementValue).toBe(fileUrl);
      },
    },
  ],
});
