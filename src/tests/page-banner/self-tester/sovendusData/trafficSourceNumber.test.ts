import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  executeOverlayTests,
  generateTests,
  TestsInfoType,
} from "../../../testUtils";
import {
  malformedArrayData,
  malformedObjectData,
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppDataFalse,
  sovAppDataMalformedArray,
  sovAppDataMalformedObjects,
  sovAppDataNoParameter,
  sovAppDataNull,
  sovAppDataTrue,
  sovAppDataUndefined,
  sovAppIframesAllValidData,
} from "../../sovAppData";

const testCasesWhenScriptRuns: TestsInfoType = [
  {
    testName: "SuccessAsString",
    sovAppData: sovAppDataEverythingIsOkay,
    expectedElementValue: "7849",
    expectedStatusCode: StatusCodes.SuccessButNeedsReview,
    expectedStatusMessageKey: StatusMessageKeyTypes.trafficSourceNumberSuccess,
  },
  {
    testName: "SuccessAsNumber",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: { ...sovAppIframesAllValidData, trafficSourceNumber: 7849 },
    },
    expectedElementValue: "7849",
    expectedStatusCode: StatusCodes.SuccessButNeedsReview,
    expectedStatusMessageKey: StatusMessageKeyTypes.trafficSourceNumberSuccess,
  },
  {
    testName: "FailAsFloat",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: { ...sovAppIframesAllValidData, trafficSourceNumber: 5.5 },
    },
    expectedElementValue: "5.5",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "Missing",
    sovAppData: sovAppDataNoParameter,
    expectedElementValue: null,
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey: StatusMessageKeyTypes.missingTrafficSourceNumber,
  },
  {
    testName: "MalformedTrue",
    sovAppData: sovAppDataTrue,
    expectedElementValue: "true",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "MalformedFalse",
    sovAppData: sovAppDataFalse,
    expectedElementValue: "false",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "MalformedNull",
    sovAppData: sovAppDataNull,
    expectedElementValue: null,
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey: StatusMessageKeyTypes.missingTrafficSourceNumber,
  },
  {
    testName: "MalformedUndefined",
    sovAppData: sovAppDataUndefined,
    expectedElementValue: null,
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey: StatusMessageKeyTypes.missingTrafficSourceNumber,
  },
];

const testCasesWhenScriptDoesNotRun: TestsInfoType =
  testCasesWhenScriptRuns.map((testInfo) => ({
    ...testInfo,
    testName: `${testInfo.testName}_WhenScriptDoesNotRun`,
    disableFlexibleIframeJs: true,
  }));

executeOverlayTests({
  testName: "trafficSourceNumber",
  tests: [
    ...generateTests({
      elementKey: "trafficSourceNumber",
      testsInfo: [
        ...testCasesWhenScriptRuns,
        ...testCasesWhenScriptDoesNotRun,
        {
          testName: "MalformedObject",
          sovAppData: sovAppDataMalformedObjects,
          expectedElementValue: "[object Object]",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.trafficSourceNumberMalformed,
        },
        {
          testName: "MalformedArray",
          sovAppData: sovAppDataMalformedArray,
          expectedElementValue: "[object Object]",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.trafficSourceNumberMalformed,
        },
        {
          testName: "MalformedObject_WhenScriptDoesNotRun",
          sovAppData: sovAppDataMalformedObjects,
          expectedStatusCode: StatusCodes.Error,
          expectedElementValue: JSON.stringify(malformedObjectData),
          expectedStatusMessageKey:
            StatusMessageKeyTypes.trafficSourceNumberMalformed,
          disableFlexibleIframeJs: true,
        },
        {
          testName: "MalformedArray_WhenScriptDoesNotRun",
          sovAppData: sovAppDataMalformedArray,
          expectedElementValue: JSON.stringify(malformedArrayData),
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.trafficSourceNumberMalformed,
          disableFlexibleIframeJs: true,
        },
      ],
    }),
  ],
});
