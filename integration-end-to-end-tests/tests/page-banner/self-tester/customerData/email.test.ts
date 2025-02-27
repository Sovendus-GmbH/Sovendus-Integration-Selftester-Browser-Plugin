import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import {
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
} from "../../../testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "consumerEmail",
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
        {
          testName: "Malformed6",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: {
              consumerEmail: "test@.com",
            },
          },
          expectedElementValue: "test@.com",
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
