import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/integration-tester/integration-tester-data-to-sync-with-dev-hub";
import { sovAppDataEverythingIsOkay } from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

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
          testOptions: {
            regular: {
              disableFlexibleIFrameJs: true,
            },
          },
        },
        {
          testName: "FlexibleIFrameNotExecutableScriptTypePlain",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "text/plain",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.flexibleIFrameJsBlockedByCookieConsent,
          testOptions: {
            regular: {
              flexibleIFrameJsScriptType: "text/plain",
            },
          },
        },
        {
          testName: "FlexibleIFrameNotExecutableScriptTypeJavascript",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              flexibleIFrameJsScriptType: "text/javascript",
            },
          },
        },
        {
          testName: "FlexibleIFrameNotExecutableScriptTypeEmpty",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              flexibleIFrameJsScriptType: "",
            },
          },
        },
        {
          testName: "FlexibleIFrameNotExecutableScriptTypeUndefined",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "undefined",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.flexibleIFrameJsBlockedByCookieConsent,
          testOptions: {
            regular: {
              flexibleIFrameJsScriptType: "undefined",
            },
          },
        },
        {
          testName: "FlexibleIFrameNotExecutableScriptTypeNull",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "null",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.flexibleIFrameJsBlockedByCookieConsent,
          testOptions: {
            regular: {
              flexibleIFrameJsScriptType: null,
            },
          },
        },
        {
          testName: "ExecutedWithCustomSource",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "data-custom-src",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.flexibleIFrameJsBlockedByCookieConsentUsingOtherSource,
          testOptions: {
            regular: {
              sourceFlexibleIFrameJs: "data-custom-src", // Use a custom attribute
            },
          },
        },
        {
          testName: "ExecutedWithUnknownSource",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "unknown-src",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.flexibleIFrameJsBlockedByCookieConsentUsingOtherSource,
          testOptions: {
            regular: {
              sourceFlexibleIFrameJs: "unknown-src", // Test with an unknown source
            },
          },
        },
      ],
    }),
  ],
});
