import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import { generateTests } from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "isSovendusJsExecutable",
  tests: [
    ...generateTests({
      elementKey: "isSovendusJsExecutable",
      testsInfo: [
        {
          testName: "IsExecutable",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
        },
        {
          testName: "NotExecutable",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              disableFlexibleIFrameJs: true,
            },
          },
        },
        {
          testName: "NotExecutableScriptTypePlain",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "text/plain",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.sovendusJsBlockedByCookieConsent,
          testOptions: {
            regular: {
              sovendusJsScriptType: "text/plain",
            },
          },
        },
        {
          testName: "NotExecutableScriptTypeJavascript",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              sovendusJsScriptType: "text/javascript",
            },
          },
        },
        {
          testName: "NotExecutableScriptTypeEmpty",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              sovendusJsScriptType: "",
            },
          },
        },
        {
          testName: "NotExecutableScriptTypeUndefined",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "undefined",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.sovendusJsBlockedByCookieConsent,
          testOptions: {
            regular: {
              sovendusJsScriptType: "undefined",
            },
          },
        },
        {
          testName: "NotExecutableScriptTypeNull",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "null",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.sovendusJsBlockedByCookieConsent,
          testOptions: {
            regular: {
              sovendusJsScriptType: null,
            },
          },
        },
      ],
    }),
  ],
});
