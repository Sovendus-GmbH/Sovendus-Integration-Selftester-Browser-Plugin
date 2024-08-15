import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataUndefined,
} from "src/tests/testUtils/sovAppData";
import { executeOverlayTests } from "src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "flexibleIFrameOnDOM",
  tests: [
    ...generateTests({
      elementKey: "flexibleIFrameOnDOM",
      testsInfo: [
        {
          testName: "FlexibleIFrameIsOnDOM",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
        },
        {
          testName: "flexibleIFrameNotOnDOM",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.iFrameNotOnDOM,
          disableFlexibleIFrameJs: true,
        },
        {
          testName: "FlexibleIFrameOnDOMScriptTypePlain",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
          flexibleIFrameJsScriptType: "text/plain",
        },
        {
          testName: "FlexibleIFrameOnDOMScriptTypeJavascript",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          flexibleIFrameJsScriptType: "text/javascript",
        },
        {
          testName: "flexibleIFrameOnDOMScriptTypeEmpty",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          flexibleIFrameJsScriptType: "",
        },
        {
          testName: "flexibleIFrameOnDOMScriptTypeUndefined",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
          flexibleIFrameJsScriptType: "undefined",
        },
        {
          testName: "flexibleIFrameOnDOMScriptTypeNull",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
          flexibleIFrameJsScriptType: null,
        },
        {
          testName: "flexibleIFrameOnDOMDataUndefined",
          sovAppData: sovAppDataUndefined,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
        },
      ],
    }),
  ],
});
