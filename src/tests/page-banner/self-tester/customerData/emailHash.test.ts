import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "src/tests/testUtils/sovAppData";
import { executeOverlayTests } from "src/tests/testUtils/testUtils";

// TODO add more tests

executeOverlayTests({
  testName: "emailHash",
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
              // SHA hash instead of md5
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
      ],
    }),
  ],
});
