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
  sovTestTrafficMediumNumbers,
} from "@src/tests/testUtils/sovAppData";
import type { TestsInfoType } from "@src/tests/testUtils/testCaseGenerator";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

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
    testName: "FailNumberWithSpecialCharacters",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: "123#456",
      },
    },
    expectedElementValue: "123#456",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "FailNumberWithHyphen",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: "123-456",
      },
    },
    expectedElementValue: "123-456",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "FailNumberWithPlusSign",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: "+12345",
      },
    },
    expectedElementValue: "+12345",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "FailNumberWithParentheses",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: "(12345)",
      },
    },
    expectedElementValue: "(12345)",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "FailNumberWithLeadingAndTrailingSpaces",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: " 12345 ",
      },
    },
    expectedElementValue: " 12345 ",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "FailNumberWithMultipleSpaces",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: "12  345",
      },
    },
    expectedElementValue: "12  345",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "FailNumberWithTabCharacter",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: "123\t456",
      },
    },
    expectedElementValue: "123\t456",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  // {
  //   testName: "FailNumberWithExponentialNotation",
  //   sovAppData: {
  //     sovConsumer: sovAppConsumerAllValidData,
  //     sovIframes1: { ...sovAppIFramesAllValidData, trafficMediumNumber: "1e5" },
  //   },
  //   expectedElementValue: "1e5",
  //   expectedStatusCode: StatusCodes.Error,
  //   expectedStatusMessageKey:
  //     StatusMessageKeyTypes.trafficMediumNumberMalformed,
  // },
  {
    testName: "FailNumberWithDecimalPoint",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: "123.45",
      },
    },
    expectedElementValue: "123.45",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "FailNumberWithUnicodeCharacter",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: "1234✓",
      },
    },
    expectedElementValue: "1234✓",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "FailNumberWithLetters",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: { ...sovAppIFramesAllValidData, trafficMediumNumber: "d55" },
    },
    expectedElementValue: "d55",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "FailNumberWithQuotation",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: { ...sovAppIFramesAllValidData, trafficMediumNumber: "'55" },
    },
    expectedElementValue: "'55",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "FailNumberWithSpace",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: "55 66",
      },
    },
    expectedElementValue: "55 66",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "FailNumberWithSymbols",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: "55@66",
      },
    },
    expectedElementValue: "55@66",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "FailNumberWithComma",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: "55,66",
      },
    },
    expectedElementValue: "55,66",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  // {
  //   testName: "FailNumberWithLeadingZeros",
  //   sovAppData: {
  //     sovConsumer: sovAppConsumerAllValidData,
  //     sovIframes1: { ...sovAppIFramesAllValidData, trafficMediumNumber: "007" },
  //   },
  //   expectedElementValue: "007",
  //   expectedStatusCode: StatusCodes.Error,
  //   expectedStatusMessageKey:
  //     StatusMessageKeyTypes.trafficMediumNumberMalformed,
  // },
  {
    testName: "FailNumberWithNewLine",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppIFramesAllValidData,
        trafficMediumNumber: "55\n66",
      },
    },
    expectedElementValue: "55\n66",
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey:
      StatusMessageKeyTypes.trafficMediumNumberMalformed,
  },
  {
    testName: "EmptyString",
    sovAppData: {
      sovConsumer: sovAppConsumerAllValidData,
      sovIframes1: {
        ...sovAppDataEmptyStringButIsOkay.sovIframes1,
        trafficMediumNumber: "",
      },
    },
    expectedElementValue: null,
    expectedStatusCode: StatusCodes.Error,
    expectedStatusMessageKey: StatusMessageKeyTypes.missingTrafficMediumNumber,
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
    testOptions: {
      regular: {
        disableFlexibleIFrameJs: true,
      },
    },
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
            StatusMessageKeyTypes.trafficMediumNumberMalformed,
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
