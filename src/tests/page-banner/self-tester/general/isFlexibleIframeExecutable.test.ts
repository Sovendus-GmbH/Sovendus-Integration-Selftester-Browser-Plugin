import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";

import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "isFlexibleIframeExecutable",
  tests: [
    ...generateTests({
      elementKey: "isFlexibleIframeExecutable",
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
          disableFlexibleIframeJs: true,
        },
        {
          testName: "FlexibleIFrameNotExecutableScriptTypePlain",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "text/plain",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.flexibleIframeJsBlockedByCookieConsent,
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
            StatusMessageKeyTypes.flexibleIframeJsBlockedByCookieConsent,
          flexibleIFrameJsScriptType: "undefined",
        },
        {
          testName: "FlexibleIFrameNotExecutableScriptTypeNull",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "null",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.flexibleIframeJsBlockedByCookieConsent,
          flexibleIFrameJsScriptType: null,
        },
      ],
    }),
  ],
});
