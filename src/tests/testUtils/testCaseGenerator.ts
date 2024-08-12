import {
  malformedArrayData,
  malformedObjectData,
  sovAppDataFalseButIsOkay,
  sovAppDataFloatNumberButIsOkay,
  sovAppDataMalformedArrayButIsOkay,
  sovAppDataMalformedObjectsButIsOkay,
  sovAppDataNullButIsOkay,
  sovAppDataNumberButIsOkay,
  sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
  sovAppDataTrueButIsOkay,
  sovAppDataUndefinedButIsOkay,
  SovDataType,
} from "./sovAppData";
import SelfTester from "@src/page-banner/self-tester";
import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { WebDriver } from "selenium-webdriver";

export function generateTests({
  elementKey,
  testsInfo,
}: {
  elementKey: string;
  testsInfo: TestsInfoType;
}): TestsType {
  return testsInfo.map((testInfo) => ({
    testName: testInfo.testName,
    sovAppData: testInfo.sovAppData,
    testFunction: async ({ sovSelfTester }) => {
      expect((sovSelfTester as any)[elementKey].elementValue).toBe(
        testInfo.expectedElementValue,
      );
      expect((sovSelfTester as any)[elementKey].statusMessageKey).toBe(
        testInfo.expectedStatusMessageKey,
      );
      expect((sovSelfTester as any)[elementKey].statusCode).toBe(
        testInfo.expectedStatusCode,
      );
    },
    disableFlexibleIframeJs: testInfo.disableFlexibleIframeJs,
  }));
}

export function generateMalformedDataTests({
  elementKey,
  expectedMalformedStatusMessageKey,
  expectedMissingStatusMessageKey,
  canBeANumber,
  skipNumberCheck,
  objectElementValueType = "stringified",
}: {
  elementKey: string;
  expectedMalformedStatusMessageKey: StatusMessageKeyTypes;
  expectedMissingStatusMessageKey: StatusMessageKeyTypes;
  canBeANumber?: boolean;
  skipNumberCheck?: boolean;
  objectElementValueType?: "stringified" | "objectObject";
}): TestsType {
  const testCasesWhenScriptRuns = [
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
      testName: "Missing",
      sovAppData: sovAppDataNullButIsOkay,
      expectedElementValue: null,
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMissingStatusMessageKey,
    },
    {
      testName: "MalformedNull",
      sovAppData: sovAppDataNullButIsOkay,
      expectedElementValue: null,
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMissingStatusMessageKey,
    },
    {
      testName: "MalformedUndefined",
      sovAppData: sovAppDataUndefinedButIsOkay,
      expectedElementValue: null,
      expectedStatusCode: StatusCodes.Error,
      expectedStatusMessageKey: expectedMissingStatusMessageKey,
    },
  ];

  const testCasesWhenScriptDoesNotRun = testCasesWhenScriptRuns.map(
    (testInfo) => ({
      ...testInfo,
      testName: `${testInfo.testName}_WhenScriptDoesNotRun`,
      disableFlexibleIframeJs: true,
    }),
  );
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
            : "[object Object]",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: expectedMalformedStatusMessageKey,
      },
      {
        testName: "MalformedArray",
        sovAppData: sovAppDataMalformedArrayButIsOkay,
        expectedElementValue:
          objectElementValueType === "stringified"
            ? JSON.stringify(malformedArrayData)
            : "[object Object]",
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: expectedMalformedStatusMessageKey,
      },
      {
        testName: "MalformedObject_WhenScriptDoesNotRun",
        sovAppData: sovAppDataMalformedObjectsButIsOkay,
        expectedElementValue: JSON.stringify(malformedObjectData),
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: expectedMalformedStatusMessageKey,
        disableFlexibleIframeJs: true,
      },
      {
        testName: "MalformedArray_WhenScriptDoesNotRun",
        sovAppData: sovAppDataMalformedArrayButIsOkay,
        expectedElementValue: JSON.stringify(malformedArrayData),
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: expectedMalformedStatusMessageKey,
        disableFlexibleIframeJs: true,
      },
    ],
  });
}

export type TestsInfoType = {
  testName: string;
  sovAppData: SovDataType;
  expectedElementValue: any;
  expectedStatusCode: StatusCodes;
  expectedStatusMessageKey: StatusMessageKeyTypes | null;
  disableFlexibleIframeJs?: boolean;
  disableSovendusDiv?: boolean;
}[];

export type TestsType = {
  testName: string;
  sovAppData: SovDataType | (() => SovDataType);
  testFunction: ({
    driver,
    sovSelfTester,
    sovAppData,
  }: {
    driver: WebDriver;
    sovSelfTester: SelfTester;
    sovAppData: SovDataType;
  }) => Promise<void>;
  disableFlexibleIframeJs?: boolean | undefined;
  disableSovendusDiv?: boolean | undefined;
}[];
