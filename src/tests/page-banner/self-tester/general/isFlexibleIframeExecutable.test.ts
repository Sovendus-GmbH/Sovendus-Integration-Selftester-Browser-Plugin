import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { sovAppDataEverythingIsOkay } from "src/tests/testUtils/sovAppData";
import { executeOverlayTests } from "src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "isFlexibleIFrameExecutable",
  tests: [
    ...generateTests({
      elementKey: "isFlexibleIFrameExecutable",
      testsInfo: [
        {
          testName: "FlexibleIFrameIsExecutable",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
        },
        {
          testName: "FlexibleIFrameNotExecutable",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          disableFlexibleIFrameJs: true,
        },
        {
          testName: "FlexibleIFrameNotExecutableScriptTypePlain",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "text/plain",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.flexibleIFrameJsBlockedByCookieConsent,
          flexibleIFrameJsScriptType: "text/plain",
        },
        {
          testName: "FlexibleIFrameNotExecutableScriptTypeJavascript",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          flexibleIFrameJsScriptType: "text/javascript",
        },
        {
          testName: "FlexibleIFrameNotExecutableScriptTypeEmpty",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          flexibleIFrameJsScriptType: "",
        },
        {
          testName: "FlexibleIFrameNotExecutableScriptTypeUndefined",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "undefined",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.flexibleIFrameJsBlockedByCookieConsent,
          flexibleIFrameJsScriptType: "undefined",
        },
        {
          testName: "FlexibleIFrameNotExecutableScriptTypeNull",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "null",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.flexibleIFrameJsBlockedByCookieConsent,
          flexibleIFrameJsScriptType: null,
        },
      ],
    }),
  ],
});
