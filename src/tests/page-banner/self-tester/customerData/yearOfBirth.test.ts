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
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppIframesAllValidData,
} from "../../sovAppData";

executeOverlayTests({
  testName: "yearOfBirth",
  tests: [
    ...generateTests({
      elementKey: "consumerYearOfBirth",
      testsInfo: [
        {
          testName: "SuccessAsString",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "1991",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerYearOfBirthSuccess,
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
          expectedElementValue: "1969",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerYearOfBirthSuccess,
        },
        {
          testName: "InvalidNumber",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerYearOfBirth: 1969.13,
            },
            sovIframes1: sovAppIframesAllValidData,
          },
          expectedElementValue: "1969.13",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerYearOfBirthNotValid,
        },
        {
          testName: "Malformed",
          sovAppData: sovAppDataMalformedButIsOkay,
          expectedElementValue: "12.06.1991",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerYearOfBirthNotValid,
        },
      ],
    }),
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
