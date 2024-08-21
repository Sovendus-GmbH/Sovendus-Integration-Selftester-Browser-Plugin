import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  executeOverlayTests,
  generateMalformedDataTests,
} from "../../../testUtils";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppDataNoParameterButIsOkay,
  sovAppIframesAllValidData,
} from "../../sovAppData";

executeOverlayTests({
  testName: "yearOfBirth",
  tests: [
    {
      testName: "SuccessAsString",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerYearOfBirth.elementValue).toBe(1991);
        expect(sovSelfTester.consumerYearOfBirth.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerYearOfBirth.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerYearOfBirthSuccess,
        );
      },
    },
    {
      testName: "SuccessAsNumber",
      sovAppData: {
        sovConsumer: {
          ...sovAppConsumerAllValidData,
          consumerYearOfBirth: 1969,
        },
        sovIframes1: sovAppIframesAllValidData,
      },
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerYearOfBirth.elementValue).toBe(1969);
        expect(sovSelfTester.consumerYearOfBirth.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerYearOfBirth.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerYearOfBirthSuccess,
        );
      },
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerYearOfBirth.elementValue).toBe(null);
        expect(sovSelfTester.consumerYearOfBirth.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.consumerYearOfBirth.statusMessageKey).toBe(
          StatusMessageKeyTypes.missingConsumerYearOfBirth,
        );
      },
    },
    {
      testName: "Malformed",
      sovAppData: sovAppDataMalformedButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerYearOfBirth.elementValue).toBe(
          "12.06.1991",
        );
        expect(sovSelfTester.consumerYearOfBirth.statusCode).toBe(
          StatusCodes.Error,
        );
        expect(sovSelfTester.consumerYearOfBirth.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerYearOfBirthNotValid,
        );
      },
    },
    ...generateMalformedDataTests({
      elementKey: "consumerYearOfBirth",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerYearOfBirthNotValid,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerYearOfBirth,
      canBeANumber: true,
    }),
  ],
});
