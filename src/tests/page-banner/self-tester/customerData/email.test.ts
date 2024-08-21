import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { executeOverlayTests } from "../../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../../sovAppData";

executeOverlayTests({
  testName: "emailSuccess",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerEmail.elementValue).toBe(
      "test.001@sovendus.com"
    );
    expect(sovSelfTester.consumerEmail.statusCode).toBe(
      StatusCodes.SuccessButNeedsReview
    );
    expect(sovSelfTester.consumerEmail.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerEmailSuccess
    );
  },
});

executeOverlayTests({
  testName: "emailMissing",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerEmail.elementValue).toBe(null);
    expect(sovSelfTester.consumerEmail.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerEmail.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerEmail
    );
  },
});

executeOverlayTests({
  testName: "emailMalformed1",
  sovAppData: sovAppDataMalformedButIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerEmail.elementValue).toBe("test.002");
    expect(sovSelfTester.consumerEmail.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerEmail.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerEmailNotValid
    );
  },
});

executeOverlayTests({
  testName: "emailMalformed2",
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
      StatusMessageKeyTypes.consumerEmailNotValid
    );
  },
});

executeOverlayTests({
  testName: "emailMalformed3",
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
      StatusMessageKeyTypes.consumerEmailNotValid
    );
  },
});

executeOverlayTests({
  testName: "emailMalformed4",
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
      StatusMessageKeyTypes.consumerEmailNotValid
    );
  },
});

executeOverlayTests({
  testName: "emailMalformed5",
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
      StatusMessageKeyTypes.consumerEmailNotValid
    );
  },
});
