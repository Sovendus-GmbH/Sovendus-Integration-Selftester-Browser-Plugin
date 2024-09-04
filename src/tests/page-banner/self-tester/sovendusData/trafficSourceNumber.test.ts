import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  malformedArrayData,
  malformedObjectData,
  sovAppConsumerAllValidData,
  sovAppDataEmptyStringButIsOkay,
  sovAppDataEverythingIsOkay,
  sovAppDataFalse,
  sovAppDataMalformedArray,
  sovAppDataMalformedObjects,
  sovAppDataNoParameter,
  sovAppDataNull,
  sovAppDataTrue,
  sovAppDataUndefined,
  sovAppIFramesAllValidData,
  sovTestTrafficSourceNumber,
} from "@src/tests/testUtils/sovAppData";
import type { TestsInfoType } from "@src/tests/testUtils/testCaseGenerator";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

const testCasesWhenScriptRuns: TestsInfoType = [
  {
    testName: "SuccessAsString",
    sovAppData: sovAppDataEverythingIsOkay,
    expectedElementValue: sovTestTrafficSourceNumber,
    expectedStatusCode: StatusCodes.SuccessButNeedsReview,
    expectedStatusMessageKey: StatusMessageKeyTypes.trafficSourceNumberSuccess,
  },
  {
    testName: "SuccessAsNumber",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: Number(sovTestTrafficSourceNumber),
      },
    },
    expectedElementValue: sovTestTrafficSourceNumber,
    expectedStatusCode: StatusCodes.SuccessButNeedsReview,
    expectedStatusMessageKey: StatusMessageKeyTypes.trafficSourceNumberSuccess,
  },
  {
    testName: "FailNumberWithSpecialCharacters",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: "123#456",
      },
    },
    expectedElementValue: encodeURIComponent("123#456"),
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "FailNumberWithHyphen",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: "123-456",
      },
    },
    expectedElementValue: "123-456",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "FailNumberWithPlusSign",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: "+12345",
      },
    },
    expectedElementValue: "+12345",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "FailNumberWithParentheses",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: "(12345)",
      },
    },
    expectedElementValue: "(12345)",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "FailNumberWithLeadingAndTrailingSpaces",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: " 12345 ",
      },
    },
    expectedElementValue: " 12345 ",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "FailNumberWithMultipleSpaces",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: "12  345",
      },
    },
    expectedElementValue: encodeURI("12  345"),
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "FailNumberWithTabCharacter",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: "123\t456",
      },
    },
    expectedElementValue: encodeURI("123\t456"),
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  // {
  //   testName: "FailNumberWithExponentialNotation",
  //   sovAppData: {
  //     sovConsumer: sovAppConsumerAllValidData,
  //     sovIframes1: { ...sovAppIFramesAllValidData, trafficSourceNumber: "1e5" },
  //   },
  //   expectedElementValue: "1e5",
  //   expectedStatusCode: StatusCodes.Error,
  //   expectedStatusMessageKey:
  //     StatusMessageKeyTypes.trafficSourceNumberMalformed,
  // },
  {
    testName: "FailNumberWithDecimalPoint",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: "123.45",
      },
    },
    expectedElementValue: "123.45",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "FailNumberWithUnicodeCharacter",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: "1234✓",
      },
    },
    expectedElementValue: encodeURI("1234✓"),
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "FailNumberWithLetters",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: { ...sovAppIFramesAllValidData, trafficSourceNumber: "d55" },
    },
    expectedElementValue: "d55",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "FailNumberWithQuotation",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: { ...sovAppIFramesAllValidData, trafficSourceNumber: "'55" },
    },
    expectedElementValue: "'55",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "FailNumberWithSpace",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: "55 66",
      },
    },
    expectedElementValue: encodeURI("55 66"),
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "FailNumberWithSymbols",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: "55@66",
      },
    },
    expectedElementValue: encodeURIComponent("55@66"),
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "FailNumberWithComma",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: "55,66",
      },
    },
    expectedElementValue: "55,66",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  // {
  //   testName: "FailNumberWithLeadingZeros",
  //   sovAppData: {
  //     sovConsumer: sovAppConsumerAllValidData,
  //     sovIframes1: { ...sovAppIFramesAllValidData, trafficSourceNumber: "007" },
  //   },
  //   expectedElementValue: "007",
  //   expectedStatusCode: StatusCodes.Error,
  //   expectedStatusMessageKey:
  //     StatusMessageKeyTypes.trafficSourceNumberMalformed,
  // },
  {
    testName: "FailNumberWithNewLine",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficSourceNumber: "55\n66",
      },
    },
    expectedElementValue: encodeURI("55\n66"),
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficSourceNumberMalformed,
  },
  {
    testName: "EmptyString",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppDataEmptyStringButIsOkay.sovIframes1,
        trafficSourceNumber: "",
      },
    },
    expectedElementValue: null,
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey: StatusMessageKeyTypes.missingTrafficSourceNumber,
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
          expectedElementValue: "[object-Object]",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.trafficSourceNumberMalformed,
        },
        {
          testName: "MalformedArray",
          sovAppData: sovAppDataMalformedArray,
          expectedElementValue: "[object-Object]",
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
          testOptions: {
            regular: {
              disableFlexibleIFrameJs: true,
            },
          },
        },
        {
          testName: "MalformedArray_WhenScriptDoesNotRun",
          sovAppData: sovAppDataMalformedArray,
          expectedElementValue: JSON.stringify(malformedArrayData),
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.trafficSourceNumberMalformed,
          testOptions: {
            regular: {
              disableFlexibleIFrameJs: true,
            },
          },
        },
      ],
    }),
  ],
});
