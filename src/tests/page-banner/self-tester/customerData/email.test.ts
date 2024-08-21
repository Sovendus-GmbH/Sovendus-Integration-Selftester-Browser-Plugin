import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  executeOverlayTests,
  generateMalformedDataTests,
} from "../../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../../sovAppData";

executeOverlayTests({
  testName: "email",
  tests: [
    {
      testName: "Success",
      sovAppData: sovAppDataEverythingIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerEmail.elementValue).toBe(
          "test.001@sovendus.com",
        );
        expect(sovSelfTester.consumerEmail.statusCode).toBe(
          StatusCodes.SuccessButNeedsReview,
        );
        expect(sovSelfTester.consumerEmail.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerEmailSuccess,
        );
      },
    },
    {
      testName: "Missing",
      sovAppData: sovAppDataNoParameterButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerEmail.elementValue).toBe(null);
        expect(sovSelfTester.consumerEmail.statusCode).toBe(StatusCodes.Error);
        expect(sovSelfTester.consumerEmail.statusMessageKey).toBe(
          StatusMessageKeyTypes.missingConsumerEmail,
        );
      },
    },
    {
      testName: "Malformed1",
      sovAppData: sovAppDataMalformedButIsOkay,
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerEmail.elementValue).toBe("test.002");
        expect(sovSelfTester.consumerEmail.statusCode).toBe(StatusCodes.Error);
        expect(sovSelfTester.consumerEmail.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerEmailNotValid,
        );
      },
    },
    {
      testName: "Malformed2",
      sovAppData: {
        ...sovAppDataEverythingIsOkay,
        sovConsumer: {
          consumerEmail: "@bla.com",
        },
      },
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerEmail.elementValue).toBe("@bla.com");
        expect(sovSelfTester.consumerEmail.statusCode).toBe(StatusCodes.Error);
        expect(sovSelfTester.consumerEmail.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerEmailNotValid,
        );
      },
    },
    {
      testName: "Malformed3",
      sovAppData: {
        ...sovAppDataEverythingIsOkay,
        sovConsumer: {
          consumerEmail: "@",
        },
      },
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerEmail.elementValue).toBe("@");
        expect(sovSelfTester.consumerEmail.statusCode).toBe(StatusCodes.Error);
        expect(sovSelfTester.consumerEmail.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerEmailNotValid,
        );
      },
    },
    {
      testName: "Malformed4",
      sovAppData: {
        ...sovAppDataEverythingIsOkay,
        sovConsumer: {
          consumerEmail: "bla@",
        },
      },
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerEmail.elementValue).toBe("bla@");
        expect(sovSelfTester.consumerEmail.statusCode).toBe(StatusCodes.Error);
        expect(sovSelfTester.consumerEmail.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerEmailNotValid,
        );
      },
    },
    {
      testName: "Malformed5",
      sovAppData: {
        ...sovAppDataEverythingIsOkay,
        sovConsumer: {
          consumerEmail: "test@bla",
        },
      },
      testFunction: async ({ sovSelfTester }) => {
        expect(sovSelfTester.consumerEmail.elementValue).toBe("test@bla");
        expect(sovSelfTester.consumerEmail.statusCode).toBe(StatusCodes.Error);
        expect(sovSelfTester.consumerEmail.statusMessageKey).toBe(
          StatusMessageKeyTypes.consumerEmailNotValid,
        );
      },
    },
    ...generateMalformedDataTests({
      elementKey: "consumerEmail",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerEmailNotValid,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerEmail,
    }),
  ],
});
