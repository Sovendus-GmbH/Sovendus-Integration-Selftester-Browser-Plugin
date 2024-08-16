import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
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
  sovAppIFramesAllValidData,
  sovTestTrafficMediumNumbers,
} from "@src/tests/testUtils/sovAppData";
import type { TestsInfoType } from "@src/tests/testUtils/testCaseGenerator";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";


// TODO Add EmptyString Test

const testCasesWhenScriptRuns: TestsInfoType = [
  {
    testName: "SuccessAsString",
    sovAppData: sovAppDataEverythingIsOkay,
    expectedElementValue:
      sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
    expectedStatusCode: StatusCodes.SuccessButNeedsReview,
    expectedStatusMessageKey: StatusMessageKeyTypes.trafficMediumNumberSuccess,
  },
  {
    testName: "SuccessAsNumber",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber:
          sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
      },
    },
    expectedElementValue:
      sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
    expectedStatusCode: StatusCodes.SuccessButNeedsReview,
    expectedStatusMessageKey: StatusMessageKeyTypes.trafficMediumNumberSuccess,
  },
  {
    testName: "FailAsFloat",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: { ...sovAppIFramesAllValidData, trafficMediumNumber: 5.5 },
    },
    expectedElementValue: "5.5",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "Missing",
    sovAppData: sovAppDataNoParameter,
    expectedElementValue: null,
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey: StatusMessageKeyTypes.missingTrafficMediumNumber,
  },
  {
    testName: "MalformedTrue",
    sovAppData: sovAppDataTrue,
    expectedElementValue: "true",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "MalformedFalse",
    sovAppData: sovAppDataFalse,
    expectedElementValue: "false",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "MalformedNull",
    sovAppData: sovAppDataNull,
    expectedElementValue: null,
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey: StatusMessageKeyTypes.missingTrafficMediumNumber,
  },
  {
    testName: "MalformedUndefined",
    sovAppData: sovAppDataUndefined,
    expectedElementValue: null,
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey: StatusMessageKeyTypes.missingTrafficMediumNumber,
  },
];

const testCasesWhenScriptDoesNotRun: TestsInfoType =
  testCasesWhenScriptRuns.map((testInfo) => ({
    ...testInfo,
    testName: `${testInfo.testName}_WhenScriptDoesNotRun`,
    disableFlexibleIframeJs: true,
  }));

executeOverlayTests({
  testName: "trafficMediumNumber",
  tests: [
    ...generateTests({
      elementKey: "trafficMediumNumber",
      testsInfo: [
        ...testCasesWhenScriptRuns,
        ...testCasesWhenScriptDoesNotRun,
        {
          testName: "MalformedObject",
          sovAppData: sovAppDataMalformedObjects,
          expectedElementValue: "[object-Object]",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.trafficMediumNumberMalformed,
        },
        {
          testName: "MalformedArray",
          sovAppData: sovAppDataMalformedArray,
          expectedElementValue: "[object-Object]",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.trafficMediumNumberMalformed,
        },
        {
          testName: "MalformedObject_WhenScriptDoesNotRun",
          sovAppData: sovAppDataMalformedObjects,
          expectedStatusCode: StatusCodes.Error,
          expectedElementValue: JSON.stringify(malformedObjectData),
          expectedStatusMessageKey:
            StatusMessageKeyTypes.trafficMediumNumberMalformed,
          disableFlexibleIFrameJs: true,
        },
        {
          testName: "MalformedArray_WhenScriptDoesNotRun",
          sovAppData: sovAppDataMalformedArray,
          expectedElementValue: JSON.stringify(malformedArrayData),
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.trafficMediumNumberMalformed,
          disableFlexibleIFrameJs: true,
        },
      ],
    }),
  ],
});
