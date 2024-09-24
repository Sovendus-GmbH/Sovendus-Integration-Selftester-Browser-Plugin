import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/integration-tester-data-to-sync-with-dev-hub";
import type { SovDataType } from "@src/tests/testUtils/sovAppData";
import {
  sovAppConsumerAllValidData,
  sovAppDataMalformedButIsOkay,
  sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
  sovAppIFramesAllValidData,
} from "@src/tests/testUtils/sovAppData";
import { generateMalformedDataTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "timestamp",
  tests: [
    // success in seconds
    {
      testName: "SuccessAsStringInSeconds",
      sovAppData: (): SovDataType => {
        const { testValidTimestamp } = getTestingTimestamps();
        return {
          payload: testValidTimestamp,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: String(Math.floor(testValidTimestamp)),
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },
    {
      testName: "SuccessAsFloatStringInSeconds",
      sovAppData: (): SovDataType => {
        const { testValidTimestamp } = getTestingTimestamps();
        return {
          payload: testValidTimestamp,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: testValidTimestamp,
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },
    {
      testName: "SuccessAsNumberInSeconds",
      sovAppData: (): SovDataType => {
        const { testValidTimestamp } = getTestingTimestamps();
        return {
          payload: testValidTimestamp,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: Math.floor(testValidTimestamp),
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },
    {
      testName: "SuccessAsFloatInSeconds",
      sovAppData: (): SovDataType => {
        const { testValidTimestamp } = getTestingTimestamps();
        return {
          payload: testValidTimestamp,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: testValidTimestamp,
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },

    // older than a minute in seconds
    {
      testName: "OlderThanAMinuteAsStringInSeconds",
      sovAppData: (): SovDataType => {
        const { testTimestamp1MinuteOld } = getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOld,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: String(Math.floor(testTimestamp1MinuteOld)),
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan2Minutes,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "OlderThanAMinuteAsFloatStringInSeconds",
      sovAppData: (): SovDataType => {
        const { testTimestamp1MinuteOld } = getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOld,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: testTimestamp1MinuteOld,
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan2Minutes,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "OlderThanAMinuteAsNumberInSeconds",
      sovAppData: (): SovDataType => {
        const { testTimestamp1MinuteOld } = getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOld,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: Math.floor(testTimestamp1MinuteOld),
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan2Minutes,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "OlderThanAMinuteAsFloatInSeconds",
      sovAppData: (): SovDataType => {
        const { testTimestamp1MinuteOld } = getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOld,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: testTimestamp1MinuteOld,
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan2Minutes,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },

    // success in milliseconds
    {
      testName: "SuccessAsStringInMilliSeconds",
      sovAppData: (): SovDataType => {
        const { testValidTimestampInMilliSeconds } = getTestingTimestamps();
        return {
          payload: testValidTimestampInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: String(Math.floor(testValidTimestampInMilliSeconds)),
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },
    {
      testName: "SuccessAsFloatStringInMilliSeconds",
      sovAppData: (): SovDataType => {
        const { testValidTimestampInMilliSeconds } = getTestingTimestamps();
        return {
          payload: testValidTimestampInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: testValidTimestampInMilliSeconds,
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },
    {
      testName: "SuccessAsNumberInMilliSeconds",
      sovAppData: (): SovDataType => {
        const { testValidTimestampInMilliSeconds } = getTestingTimestamps();
        return {
          payload: testValidTimestampInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: Math.floor(testValidTimestampInMilliSeconds),
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },
    {
      testName: "SuccessAsFloatInMilliSeconds",
      sovAppData: (): SovDataType => {
        const { testValidTimestampInMilliSeconds } = getTestingTimestamps();
        return {
          payload: testValidTimestampInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: testValidTimestampInMilliSeconds,
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },

    // older than a minute in milliseconds
    {
      testName: "OlderThanAMinuteAsStringInMilliSeconds",
      sovAppData: (): SovDataType => {
        const { testTimestamp1MinuteOldInMilliSeconds } =
          getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOldInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: String(
              Math.floor(testTimestamp1MinuteOldInMilliSeconds),
            ),
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan2Minutes,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "OlderThanAMinuteAsFloatStringInMilliSeconds",
      sovAppData: (): SovDataType => {
        const { testTimestamp1MinuteOldInMilliSeconds } =
          getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOldInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: testTimestamp1MinuteOldInMilliSeconds,
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan2Minutes,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "OlderThanAMinuteAsNumberInMilliSeconds",
      sovAppData: (): SovDataType => {
        const { testTimestamp1MinuteOldInMilliSeconds } =
          getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOldInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: Math.floor(testTimestamp1MinuteOldInMilliSeconds),
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan2Minutes,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "OlderThanAMinuteAsFloatInMilliSeconds",
      sovAppData: (): SovDataType => {
        const { testTimestamp1MinuteOldInMilliSeconds } =
          getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOldInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            timestamp: testTimestamp1MinuteOldInMilliSeconds,
          },
        };
      },
      testFunction: ({ sovSelfTester, sovAppData }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan2Minutes,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "Malformed",
      sovAppData: sovAppDataMalformedButIsOkay,
      testFunction: ({ sovSelfTester }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe("dubidub");
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.notAUnixTimestamp,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "MalformedNumberWithCommaInsteadOfDot",
      sovAppData: sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
      testFunction: ({ sovSelfTester }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe("1234,56");
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.notAUnixTimestamp,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "MalformedNumberWithCommaInsteadOfDot_WhenScriptDoesNotRun",
      sovAppData: sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
      testFunction: ({ sovSelfTester }): void => {
        expect(sovSelfTester.timestamp.elementValue).toBe("1234,56");
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.notAUnixTimestamp,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
      testOptions: {
        regular: {
          disableFlexibleIFrameJs: true,
        },
      },
    },
    ...generateMalformedDataTests({
      elementKey: "timestamp",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.notAUnixTimestamp,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.unixTimestampMissing,
      skipNumberCheck: true,
      objectElementValueType: "objectObject",
    }),
  ],
});

function getTestingTimestamps(): {
  testValidTimestampInMilliSeconds: number;
  testTimestamp1MinuteOldInMilliSeconds: number;
  testValidTimestamp: number;
  testTimestamp1MinuteOld: number;
} {
  const testValidTimestampInMilliSeconds = Date.now() - 0.1; // make it a float
  const testTimestamp1MinuteOldInMilliSeconds =
    testValidTimestampInMilliSeconds - 2 * 60 * 1000; // 120 seconds in the past

  const testValidTimestamp = testValidTimestampInMilliSeconds / 1000;
  const testTimestamp1MinuteOld = testTimestamp1MinuteOldInMilliSeconds / 1000;
  return {
    testValidTimestampInMilliSeconds,
    testTimestamp1MinuteOldInMilliSeconds,
    testValidTimestamp,
    testTimestamp1MinuteOld,
  };
}
