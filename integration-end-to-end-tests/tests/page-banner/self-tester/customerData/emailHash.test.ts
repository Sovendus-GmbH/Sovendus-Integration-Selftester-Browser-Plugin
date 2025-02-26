import { MD5 } from "crypto-js";
import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import {
  sovAppConsumerAllValidData,
  sovAppDataEmptyStringButIsOkay,
  sovAppDataEverythingIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../../../testUtils/sovAppData";
import { generateTests } from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "consumerEmailHash",
  tests: [
    ...generateTests({
      elementKey: "consumerEmailHash",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerEmailHash: "46706b7505f547083f5c02a63419e79d",
              consumerEmail: undefined,
            },
          },
          expectedElementValue: "46706b7505f547083f5c02a63419e79d",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerEmailHashSuccess,
        },
        {
          testName: "SuccessHash",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerEmailHash: MD5("test.001@sovendus.de").toString(),
              consumerEmail: undefined,
            },
          },
          expectedElementValue: MD5("test.001@sovendus.de").toString(),
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerEmailHashSuccess,
        },
        {
          testName: "EmptyString",
          sovAppData: sovAppDataEmptyStringButIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.missingConsumerEmailHash,
        },
        {
          testName: "Missing",
          sovAppData: sovAppDataNoParameterButIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.missingConsumerEmailHash,
        },
        {
          testName: "Malformed1",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              // SHA-256 hash instead of MD5
              consumerEmailHash:
                "18ee24150dcb1d96752a4d6dd0f20dfd8ba8c38527e40aa8509b7adecf78f9c6",
              consumerEmail: undefined,
            },
          },
          expectedElementValue:
            "18ee24150dcb1d96752a4d6dd0f20dfd8ba8c38527e40aa8509b7adecf78f9c6",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerEmailNotMD5Hash,
        },
        {
          testName: "Malformed2",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerEmailHash: "banana",
              consumerEmail: undefined,
            },
          },
          expectedElementValue: "banana",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerEmailNotMD5Hash,
        },
        {
          testName: "Malformed3ShortHash",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerEmailHash: "46706b7505f54708", // too short to be an MD5 hash
              consumerEmail: undefined,
            },
          },
          expectedElementValue: "46706b7505f54708",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerEmailNotMD5Hash,
        },
        {
          testName: "Malformed4LongHash",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerEmailHash: "46706b7505f547083f5c02a63419e79d12345678", // too long to be an MD5 hash
              consumerEmail: undefined,
            },
          },
          expectedElementValue: "46706b7505f547083f5c02a63419e79d12345678",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerEmailNotMD5Hash,
        },
        {
          testName: "Malformed5NonHexHash",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerEmailHash: "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ", // contains non-hexadecimal characters
              consumerEmail: undefined,
            },
          },
          expectedElementValue: "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerEmailNotMD5Hash,
        },
        {
          testName: "Malformed6SpecialChars",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerEmailHash: "46706b7505f54708!@#$%^&*()_+", // contains special characters
              consumerEmail: undefined,
            },
          },
          expectedElementValue: "46706b7505f54708!@#$%^&*()_+",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerEmailNotMD5Hash,
        },
      ],
    }),
  ],
});
