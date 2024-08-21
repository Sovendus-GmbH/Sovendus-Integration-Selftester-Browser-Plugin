import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { executeOverlayTests } from "../../../testUtils";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../../sovAppData";

// TODO add more tests

executeOverlayTests({
  testName: "emailHash",
  tests: [
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
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerEmailHash.elementValue).toBe(
          "46706b7505f547083f5c02a63419e79d",
        );
        expect(sovSelfTester.consumerEmailHash.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerEmailHash.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerEmailHashSuccess,
        );
      },
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerEmailHash.elementValue).toBe(null);
        expect(sovSelfTester.consumerEmailHash.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.consumerEmailHash.statusMessageKey).toBe(
          StatusMessageKeyTypes.missingConsumerEmailHash,
        );
      },
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
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerEmailHash.elementValue).toBe(
          "18ee24150dcb1d96752a4d6dd0f20dfd8ba8c38527e40aa8509b7adecf78f9c6",
        );
        expect(sovSelfTester.consumerEmailHash.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.consumerEmailHash.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerEmailNotMD5Hash,
        );
      },
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
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerEmailHash.elementValue).toBe("banana");
        expect(sovSelfTester.consumerEmailHash.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.consumerEmailHash.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerEmailNotMD5Hash,
        );
      },
    },
  ],
});
