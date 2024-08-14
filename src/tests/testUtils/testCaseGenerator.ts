import type SelfTester from "@src/page-banner/self-tester";
import type { ExplicitAnyType } from "@src/page-banner/self-tester";
import type { StatusMessageKeyTypes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import type { WebDriver } from "selenium-webdriver";

import type { SovDataType } from "./sovAppData";
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
} from "./sovAppData";

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
      expect((sovSelfTester as ExplicitAnyType)[elementKey].elementValue).toBe(
        testInfo.expectedElementValue
      );
      expect(
        (sovSelfTester as ExplicitAnyType)[elementKey].statusMessageKey
      ).toBe(testInfo.expectedStatusMessageKey);
      expect((sovSelfTester as ExplicitAnyType)[elementKey].statusCode).toBe(
        testInfo.expectedStatusCode
      );
    },
    disableFlexibleIframeJs: testInfo.disableFlexibleIframeJs,
    disableAwinMasterTag: testInfo.disableAwinMasterTag,
    disableAwinSalesTracking: testInfo.disableAwinSalesTracking,
    deleteSovIFrame: testInfo.removeSovIFrame,
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
}: {
  elementKey: string;
  expectedMalformedStatusMessageKey: StatusMessageKeyTypes;
  expectedMissingStatusMessageKey: StatusMessageKeyTypes;
  canBeANumber?: boolean;
  skipNumberCheck?: boolean;
  objectElementValueType?: "stringified" | "objectObject";
  undefinedValue?: string | null;
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

  const testCasesWhenScriptDoesNotRun = testCasesWhenScriptRuns.map(
    (testInfo) => ({
      ...testInfo,
      testName: `${testInfo.testName}_WhenScriptDoesNotRun`,
      disableFlexibleIframeJs: true,
    })
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
  expectedElementValue: string | boolean | number | null;
  expectedStatusCode: StatusCodes;
  expectedStatusMessageKey: StatusMessageKeyTypes | null;
  disableFlexibleIframeJs?: boolean;
  disableSovendusDiv?: boolean;
  disableAwinMasterTag?: boolean;
  disableAwinSalesTracking?: boolean;
  removeSovIFrame?: boolean;
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
  disableAwinMasterTag?: boolean | undefined;
  disableAwinSalesTracking?: boolean | undefined;
  deleteSovIFrame?: boolean | undefined;
}[];
