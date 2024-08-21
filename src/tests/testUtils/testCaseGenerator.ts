import type SelfTester from "@src/page-banner/self-tester";
import type { StatusMessageKeyTypes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";

import type { SovDataType } from "./sovAppData";
import {
  malformedArrayData,
  malformedObjectData,
  sovAppDataEmptyStringButIsOkay,
  sovAppDataFalseButIsOkay,
  sovAppDataFloatNumberButIsOkay,
  sovAppDataMalformedArrayButIsOkay,
  sovAppDataMalformedObjectsButIsOkay,
  sovAppDataNullButIsOkay,
  sovAppDataNumberButIsOkay,
  sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
  sovAppDataTrueButIsOkay,
  sovAppDataUndefinedButIsOkay,
} from "./sovAppData";

export function generateTests({
  elementKey,
  testsInfo,
}: {
  elementKey: SovSelfTesterKeys;
  testsInfo: TestsInfoType;
}): TestsType {
  return testsInfo.map((testInfo) => ({
    testName: testInfo.testName,
    sovAppData: testInfo.sovAppData,
    testFunction: ({ sovSelfTester }): void => {
      expect(sovSelfTester[elementKey].elementValue).toBe(
        testInfo.expectedElementValue,
      );
      expect(sovSelfTester[elementKey].statusMessageKey).toBe(
        testInfo.expectedStatusMessageKey,
      );
      expect(sovSelfTester[elementKey].statusCode).toBe(
        testInfo.expectedStatusCode,
      );
    },
    testOptions: testInfo.testOptions,
  }));
}

export function generateMalformedDataTests({
  elementKey,
  expectedMalformedStatusMessageKey,
  expectedMissingStatusMessageKey,
  canBeANumber,
  skipNumberCheck,
  objectElementValueType = "stringified",
  undefinedValue = null,
  isAwinTest = false,
}: {
  elementKey: SovSelfTesterKeys;
  expectedMalformedStatusMessageKey: StatusMessageKeyTypes;
  expectedMissingStatusMessageKey: StatusMessageKeyTypes;
  canBeANumber?: boolean;
  skipNumberCheck?: boolean;
  objectElementValueType?: "stringified" | "objectObject";
  undefinedValue?: string | null;
  isAwinTest?: boolean;
}): TestsType {
  const testCasesWhenScriptRuns: TestsInfoType = [
    {
      testName: "MalformedTrue",
      sovAppData: sovAppDataTrueButIsOkay,
      expectedElementValue: "true",
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMalformedStatusMessageKey,
    },
    {
      testName: "MalformedFalse",
      sovAppData: sovAppDataFalseButIsOkay,
      expectedElementValue: "false",
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMalformedStatusMessageKey,
    },
    ...(skipNumberCheck
      ? []
      : canBeANumber
        ? [
            {
              testName: "MalformedNumberWithCommaInsteadOfDot",
              sovAppData: sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
              expectedElementValue: "1234,56",
              expectedStatusCode: StatusCodes.Error,
              expectedStatusMessageKey: expectedMalformedStatusMessageKey,
            },
          ]
        : [
            {
              testName: "MalformedNumber",
              sovAppData: sovAppDataNumberButIsOkay,
              expectedElementValue: "1234",
              expectedStatusCode: StatusCodes.Error,
              expectedStatusMessageKey: expectedMalformedStatusMessageKey,
            },
            {
              testName: "MalformedFloatNumber",
              sovAppData: sovAppDataFloatNumberButIsOkay,
              expectedElementValue: "1234.56",
              expectedStatusCode: StatusCodes.Error,
              expectedStatusMessageKey: expectedMalformedStatusMessageKey,
            },
          ]),
    {
      testName: "EmptyString",
      sovAppData: sovAppDataEmptyStringButIsOkay,
      expectedElementValue: undefinedValue,
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMissingStatusMessageKey,
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNullButIsOkay,
      expectedElementValue: undefinedValue,
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMissingStatusMessageKey,
    },
    {
      testName: "MalformedNull",
      sovAppData: sovAppDataNullButIsOkay,
      expectedElementValue: undefinedValue,
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMissingStatusMessageKey,
    },
    {
      testName: "MalformedUndefined",
      sovAppData: sovAppDataUndefinedButIsOkay,
      expectedElementValue: undefinedValue,
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMissingStatusMessageKey,
    },
  ];
  const testCasesWhenScriptDoesNotRun: TestsInfoType = isAwinTest
    ? []
    : testCasesWhenScriptRuns.map((testInfo) => ({
        ...testInfo,
        testName: `${testInfo.testName}_WhenScriptDoesNotRun`,
        testOptions: {
          regular: {
            disableFlexibleIFrameJs: true,
          },
        },
      }));
  return generateTests({
    elementKey,
    testsInfo: [
      ...testCasesWhenScriptRuns,
      ...testCasesWhenScriptDoesNotRun,
      {
        testName: "MalformedObject",
        sovAppData: sovAppDataMalformedObjectsButIsOkay,
        expectedElementValue:
          objectElementValueType === "stringified"
            ? JSON.stringify(malformedObjectData)
            : "[object-Object]",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: expectedMalformedStatusMessageKey,
      },
      {
        testName: "MalformedArray",
        sovAppData: sovAppDataMalformedArrayButIsOkay,
        expectedElementValue:
          objectElementValueType === "stringified"
            ? JSON.stringify(malformedArrayData)
            : "[object-Object]",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: expectedMalformedStatusMessageKey,
      },

      ...(isAwinTest
        ? []
        : [
            {
              testName: "MalformedObject_WhenScriptDoesNotRun",
              sovAppData: sovAppDataMalformedObjectsButIsOkay,
              expectedElementValue: JSON.stringify(malformedObjectData),
              expectedStatusCode: StatusCodes.Error,
              expectedStatusMessageKey: expectedMalformedStatusMessageKey,
              testOptions: {
                regular: {
                  disableFlexibleIFrameJs: true,
                },
              },
            },
            {
              testName: "MalformedArray_WhenScriptDoesNotRun",
              sovAppData: sovAppDataMalformedArrayButIsOkay,
              expectedElementValue: JSON.stringify(malformedArrayData),
              expectedStatusCode: StatusCodes.Error,
              expectedStatusMessageKey: expectedMalformedStatusMessageKey,
              testOptions: {
                regular: {
                  disableFlexibleIFrameJs: true,
                },
              },
            },
          ]),
    ],
  });
}

export type TestsInfoType = {
  testName: string;
  sovAppData: SovDataType;
  expectedElementValue: string | boolean | number | null;
  expectedStatusCode: StatusCodes;
  expectedStatusMessageKey: StatusMessageKeyTypes | null;
  testOptions?: TestOptionsType;
}[];

export type TestsType = TestDataType[];

export type TestDataType = {
  testName: string;
  sovAppData: SovDataType | (() => SovDataType);
  testFunction: ({
    sovSelfTester,
    sovAppData,
  }: {
    sovSelfTester: SelfTester;
    sovAppData: SovDataType;
  }) => void;
  testOptions?: TestOptionsType | undefined;
};

export interface TestOptionsType {
  awin?: {
    disableAwinSalesTracking?: boolean | undefined;
    sovendusJsScriptType?: string | undefined | null;
    flexibleIFrameJsScriptType?: string | undefined | null;
    removeSovendusJs?: boolean | undefined;
    addSaleTrackingDelay?: boolean | undefined;
  };
  regular?: {
    disableFlexibleIFrameJs?: boolean | undefined;
    disableSovendusDiv?: boolean | undefined;
    removeSovIFrame?: boolean | undefined;
    flexibleIFrameJsScriptType?: string | undefined | null;
    sovendusJsScriptType?: string | undefined | null;
    removeSovendusJs?: boolean | undefined;
    addConsumerIFrameOneSecTimeout?: boolean | undefined;
    useAwinMasterTagInRegularIntegration?: boolean | undefined;
  };
}

export type SovSelfTesterKeys =
  | "integrationType"
  | "browserName"
  | "websiteURL"
  | "consumerSalutation"
  | "consumerFirstName"
  | "consumerLastName"
  | "consumerYearOfBirth"
  | "consumerEmail"
  | "consumerEmailHash"
  | "consumerStreet"
  | "consumerStreetNumber"
  | "consumerZipCode"
  | "consumerPhone"
  | "consumerCity"
  | "consumerCountry"
  | "trafficSourceNumber"
  | "trafficMediumNumber"
  | "orderCurrency"
  | "orderId"
  | "orderValue"
  | "sessionId"
  | "timestamp"
  | "usedCouponCode"
  | "iFrameContainerId"
  | "isEnabledInBackend"
  | "wasExecuted"
  | "sovendusDivFound"
  | "multipleSovIFramesDetected"
  | "sovIFramesAmount"
  | "multipleIFramesAreSame"
  | "flexibleIFrameOnDOM"
  | "isFlexibleIFrameExecutable"
  | "isSovendusJsOnDom"
  | "isSovendusJsExecutable"
  | "isUnknownSovendusJsError"
  | "awinIntegrationDetectedTestResult"
  | "awinSaleTrackedTestResult"
  | "awinExecutedTestResult";
