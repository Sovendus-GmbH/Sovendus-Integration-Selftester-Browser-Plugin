import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  executeOverlayTests,
  generateMalformedDataTests,
  generateTests,
} from "../../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
} from "../../sovAppData";

executeOverlayTests({
  testName: "email",
  tests: [
    ...generateTests({
      elementKey: "consumerEmail",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "test.001@sovendus.com",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerEmailSuccess,
        },
        {
          testName: "Malformed1",
          sovAppData: sovAppDataMalformedButIsOkay,
          expectedElementValue: "test.002",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerEmailNotValid,
        },
        {
          testName: "Malformed2",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerEmail: "@bla.com",
            },
          },
          expectedElementValue: "@bla.com",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerEmailNotValid,
        },
        {
          testName: "Malformed3",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerEmail: "@",
            },
          },
          expectedElementValue: "@",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerEmailNotValid,
        },
        {
          testName: "Malformed4",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerEmail: "bla@",
            },
          },
          expectedElementValue: "bla@",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerEmailNotValid,
        },
        {
          testName: "Malformed5",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerEmail: "test@bla",
            },
          },
          expectedElementValue: "test@bla",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerEmailNotValid,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerEmail",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerEmailNotValid,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerEmail,
    }),
  ],
});
