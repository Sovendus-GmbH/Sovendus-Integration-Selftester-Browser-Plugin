import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import {
  sovAppDataEverythingIsOkay,
  sovAppDataUndefined,
} from "../../../testUtils/sovAppData";
import { generateTests } from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "isSovendusJsOnDom",
  tests: [
    ...generateTests({
      elementKey: "isSovendusJsOnDom",
      testsInfo: [
        {
          testName: "IsOnDOM",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
        },
        {
          testName: "NotOnDOM",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.sovendusJsMissing,
          testOptions: {
            regular: {
              removeSovendusJs: true,
            },
          },
        },
        {
          testName: "ScriptTypePlain",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              sovendusJsScriptType: "text/plain",
            },
          },
        },
        {
          testName: "ScriptTypeJavascript",
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
          testName: "ScriptTypeEmpty",
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
          testName: "ScriptTypeUndefined",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              sovendusJsScriptType: "undefined",
            },
          },
        },
        {
          testName: "ScriptTypeNull",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              sovendusJsScriptType: null,
            },
          },
        },
        {
          testName: "DataUndefined",
          sovAppData: sovAppDataUndefined,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
        },
      ],
    }),
  ],
});
