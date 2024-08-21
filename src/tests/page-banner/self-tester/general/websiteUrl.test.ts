import { resolve } from "path";
import { executeOverlayTests } from "../../../testUtils";
import { sovAppDataEverythingIsOkay } from "../../sovAppData";
import { pathToFileURL } from "url";

executeOverlayTests({
  testName: "websiteURL",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    const localFilePath = resolve(__dirname, "../../testHtmlFiles/empty.html");
    const fileUrl = pathToFileURL(localFilePath).toString();
    expect(sovSelfTester.websiteURL).toBe(fileUrl);
  },
});
