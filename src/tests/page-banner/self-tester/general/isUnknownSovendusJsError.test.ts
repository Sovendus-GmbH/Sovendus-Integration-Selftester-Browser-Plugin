import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/integration-tester-data-to-sync-with-dev-hub";
import { sovAppDataEverythingIsOkay } from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "isUnknownSovendusJsError",
  tests: [
    ...generateTests({
      elementKey: "isUnknownSovendusJsError",
      testsInfo: [
        {
          testName: "SovendusJsExecutedWithTimeout",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.unknownErrorIntegrationScriptFailed,
          testOptions: {
            regular: {
              addConsumerIFrameOneSecTimeout: true,
            },
          },
        },
      ],
    }),
  ],
});
