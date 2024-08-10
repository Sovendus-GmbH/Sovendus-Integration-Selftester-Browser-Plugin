import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  executeOverlayTests,
  generateTests,
  TestsType,
} from "../../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedArrayButIsOkay,
  sovAppDataFalseButIsOkay,
  sovAppDataNullButIsOkay,
  sovAppDataMalformedObjectsButIsOkay,
  sovAppDataTrueButIsOkay,
  sovAppDataNoParameterButIsOkay,
  sovAppDataUndefinedButIsOkay,
  sovAppDataNumberButIsOkay,
  malformedArrayData,
  malformedObjectData,
} from "../../sovAppData";

executeOverlayTests({
  testName: "integrationType",
  tests: generateTests({
    elementKey: "integrationType",
    testsInfo: [
      {
        testName: "Set",
        sovAppData: sovAppDataEverythingIsOkay,
        expectedElementValue: "test-1.0.0",
        expectedStatusCode: StatusCodes.Success,
        expectedStatusMessageKey: null,
      },
      {
        testName: "NotSet",
        sovAppData: sovAppDataNoParameterButIsOkay,
        expectedElementValue: "unknown",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: null,
      },
      {
        testName: "MalformedTrue",
        sovAppData: sovAppDataTrueButIsOkay,
        expectedElementValue: "true",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey:
          StatusMessageKeyTypes.integrationTypeMalformed,
      },
      {
        testName: "MalformedFalse",
        sovAppData: sovAppDataFalseButIsOkay,
        expectedElementValue: "false",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey:
          StatusMessageKeyTypes.integrationTypeMalformed,
      },
      {
        testName: "MalformedNumber",
        sovAppData: sovAppDataNumberButIsOkay,
        expectedElementValue: "1234",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey:
          StatusMessageKeyTypes.integrationTypeMalformed,
      },
      {
        testName: "MalformedObject",
        sovAppData: sovAppDataMalformedObjectsButIsOkay,
        expectedElementValue: "object",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey:
          StatusMessageKeyTypes.integrationTypeMalformed,
      },
      {
        testName: "MalformedArray",
        sovAppData: sovAppDataMalformedArrayButIsOkay,
        expectedElementValue: "object",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey:
          StatusMessageKeyTypes.integrationTypeMalformed,
      },
      {
        testName: "MalformedNull",
        sovAppData: sovAppDataNullButIsOkay,
        expectedElementValue: "unknown",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: null,
      },
      {
        testName: "MalformedUndefined",
        sovAppData: sovAppDataUndefinedButIsOkay,
        expectedElementValue: "unknown",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: null,
      },
      {
        testName: "MalformedTrue_WhenScriptDoesNotRun",
        sovAppData: sovAppDataTrueButIsOkay,
        expectedElementValue: "true",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey:
          StatusMessageKeyTypes.integrationTypeMalformed,
        disableFlexibleIframeJs: true,
      },
      {
        testName: "MalformedFalse_WhenScriptDoesNotRun",
        sovAppData: sovAppDataFalseButIsOkay,
        expectedElementValue: "false",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey:
          StatusMessageKeyTypes.integrationTypeMalformed,
        disableFlexibleIframeJs: true,
      },
      {
        testName: "MalformedNumber_WhenScriptDoesNotRun",
        sovAppData: sovAppDataNumberButIsOkay,
        expectedElementValue: "1234",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey:
          StatusMessageKeyTypes.integrationTypeMalformed,
        disableFlexibleIframeJs: true,
      },
      {
        testName: "MalformedObject_WhenScriptDoesNotRun",
        sovAppData: sovAppDataMalformedObjectsButIsOkay,
        expectedElementValue: JSON.stringify(malformedObjectData),
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey:
          StatusMessageKeyTypes.integrationTypeMalformed,
        disableFlexibleIframeJs: true,
      },
      {
        testName: "MalformedArray_WhenScriptDoesNotRun",
        sovAppData: sovAppDataMalformedArrayButIsOkay,
        expectedElementValue: JSON.stringify(malformedArrayData),
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey:
          StatusMessageKeyTypes.integrationTypeMalformed,
        disableFlexibleIframeJs: true,
      },
      {
        testName: "MalformedNull_WhenScriptDoesNotRun",
        sovAppData: sovAppDataNullButIsOkay,
        expectedElementValue: "unknown",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: null,
        disableFlexibleIframeJs: true,
      },
      {
        testName: "MalformedUndefined_WhenScriptDoesNotRun",
        sovAppData: sovAppDataUndefinedButIsOkay,
        expectedElementValue: "unknown",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: null,
        disableFlexibleIframeJs: true,
      },
    ],
  }),
});
