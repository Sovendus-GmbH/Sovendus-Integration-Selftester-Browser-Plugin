import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import { generateTests } from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

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
