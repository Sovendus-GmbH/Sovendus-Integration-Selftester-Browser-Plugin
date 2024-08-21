import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { executeOverlayTests } from "../../../testUtils/testUtils";
import {
  sovAppConsumerAllValidData,
  sovAppDataMalformedButIsOkay,
  sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
  sovAppIframesAllValidData,
} from "../../../testUtils/sovAppData";
import { generateMalformedDataTests } from "@src/tests/testUtils/testCaseGenerator";

executeOverlayTests({
  testName: "timestamp",
  tests: [
    // success in seconds
    {
      testName: "SuccessAsStringInSeconds",
      sovAppData: () => {
        const { testValidTimestamp } = getTestingTimestamps();
        return {
          payload: testValidTimestamp,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: String(Math.floor(testValidTimestamp)),
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },
    {
      testName: "SuccessAsFloatStringInSeconds",
      sovAppData: () => {
        const { testValidTimestamp } = getTestingTimestamps();
        return {
          payload: testValidTimestamp,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: testValidTimestamp,
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },
    {
      testName: "SuccessAsNumberInSeconds",
      sovAppData: () => {
        const { testValidTimestamp } = getTestingTimestamps();
        return {
          payload: testValidTimestamp,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: Math.floor(testValidTimestamp),
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },
    {
      testName: "SuccessAsFloatInSeconds",
      sovAppData: () => {
        const { testValidTimestamp } = getTestingTimestamps();
        return {
          payload: testValidTimestamp,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: testValidTimestamp,
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
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
      sovAppData: () => {
        const { testTimestamp1MinuteOld } = getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOld,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: String(Math.floor(testTimestamp1MinuteOld)),
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan1Minute,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "OlderThanAMinuteAsFloatStringInSeconds",
      sovAppData: () => {
        const { testTimestamp1MinuteOld } = getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOld,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: testTimestamp1MinuteOld,
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan1Minute,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "OlderThanAMinuteAsNumberInSeconds",
      sovAppData: () => {
        const { testTimestamp1MinuteOld } = getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOld,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: Math.floor(testTimestamp1MinuteOld),
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan1Minute,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "OlderThanAMinuteAsFloatInSeconds",
      sovAppData: () => {
        const { testTimestamp1MinuteOld } = getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOld,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: testTimestamp1MinuteOld,
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan1Minute,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },

    // success in milliseconds
    {
      testName: "SuccessAsStringInMilliSeconds",
      sovAppData: () => {
        const { testValidTimestampInMilliSeconds } = getTestingTimestamps();
        return {
          payload: testValidTimestampInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: String(Math.floor(testValidTimestampInMilliSeconds)),
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },
    {
      testName: "SuccessAsFloatStringInMilliSeconds",
      sovAppData: () => {
        const { testValidTimestampInMilliSeconds } = getTestingTimestamps();
        return {
          payload: testValidTimestampInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: testValidTimestampInMilliSeconds,
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },
    {
      testName: "SuccessAsNumberInMilliSeconds",
      sovAppData: () => {
        const { testValidTimestampInMilliSeconds } = getTestingTimestamps();
        return {
          payload: testValidTimestampInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: Math.floor(testValidTimestampInMilliSeconds),
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(null);
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Success);
      },
    },
    {
      testName: "SuccessAsFloatInMilliSeconds",
      sovAppData: () => {
        const { testValidTimestampInMilliSeconds } = getTestingTimestamps();
        return {
          payload: testValidTimestampInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: testValidTimestampInMilliSeconds,
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
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
      sovAppData: () => {
        const { testTimestamp1MinuteOldInMilliSeconds } =
          getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOldInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: String(
              Math.floor(testTimestamp1MinuteOldInMilliSeconds),
            ),
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan1Minute,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "OlderThanAMinuteAsFloatStringInMilliSeconds",
      sovAppData: () => {
        const { testTimestamp1MinuteOldInMilliSeconds } =
          getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOldInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: testTimestamp1MinuteOldInMilliSeconds,
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan1Minute,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "OlderThanAMinuteAsNumberInMilliSeconds",
      sovAppData: () => {
        const { testTimestamp1MinuteOldInMilliSeconds } =
          getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOldInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: Math.floor(testTimestamp1MinuteOldInMilliSeconds),
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(Math.floor(sovAppData.payload)),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan1Minute,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "OlderThanAMinuteAsFloatInMilliSeconds",
      sovAppData: () => {
        const { testTimestamp1MinuteOldInMilliSeconds } =
          getTestingTimestamps();
        return {
          payload: testTimestamp1MinuteOldInMilliSeconds,
          sovConsumer: sovAppConsumerAllValidData,
          sovIframes1: {
            ...sovAppIframesAllValidData,
            timestamp: testTimestamp1MinuteOldInMilliSeconds,
          },
        };
      },
      testFunction: async ({ sovSelfTester, sovAppData }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          String(sovAppData.payload),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.unixTimestampOlderThan1Minute,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "Malformed",
      sovAppData: sovAppDataMalformedButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
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
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe(
          encodeURI(encodeURIComponent("1234,56")),
        );
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.notAUnixTimestamp,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
    },
    {
      testName: "MalformedNumberWithCommaInsteadOfDot_WhenScriptDoesNotRun",
      sovAppData: sovAppDataNumberWithCommaInsteadOfDotButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.timestamp.elementValue).toBe("1234,56");
        expect(sovSelfTester.timestamp.statusMessageKey).toBe(
          StatusMessageKeyTypes.notAUnixTimestamp,
        );
        expect(sovSelfTester.timestamp.statusCode).toBe(StatusCodes.Error);
      },
      disableFlexibleIframeJs: true,
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

function getTestingTimestamps() {
  const testValidTimestampInMilliSeconds = Date.now() - 0.1; // make it a float
  const testTimestamp1MinuteOldInMilliSeconds =
    testValidTimestampInMilliSeconds - 1 * 60 * 1000; // 60 seconds in the past

  const testValidTimestamp = testValidTimestampInMilliSeconds / 1000;
  const testTimestamp1MinuteOld = testTimestamp1MinuteOldInMilliSeconds / 1000;
  return {
    testValidTimestampInMilliSeconds,
    testTimestamp1MinuteOldInMilliSeconds,
    testValidTimestamp,
    testTimestamp1MinuteOld,
  };
}
