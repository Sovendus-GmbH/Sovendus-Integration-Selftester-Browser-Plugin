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
  testName: "consumerCountry",
  tests: [
    ...generateTests({
      elementKey: "consumerCountry",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "DE",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerCountrySuccess,
        },
        {
          testName: "Malformed",
          sovAppData: sovAppDataMalformedButIsOkay,
          expectedElementValue: "Space",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerCountryInvalid,
        },
        {
          testName: "ValidCountryCodeWithLowercase",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCountry: "de" },
          },
          expectedElementValue: "de",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerCountryInvalid,
        },
        {
          testName: "InvalidCountryCode",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCountry: "XYZ" },
          },
          expectedElementValue: "XYZ",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerCountryInvalid,
        },
        {
          testName: "CountryCodeWithSpaces",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCountry: " D E " },
          },
          expectedElementValue: " D E ",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerCountryInvalid,
        },
        {
          testName: "CountryCodeWithSpecialCharacters",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCountry: "D@E" },
          },
          expectedElementValue: "D@E",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerCountryInvalid,
        },
        {
          testName: "CountryCodeWithNumbers",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCountry: "DE1" },
          },
          expectedElementValue: "DE1",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerCountryInvalid,
        },
        {
          testName: "ValidCountryCodeWithAccents",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCountry: "Côte d'Ivoire" },
          },
          expectedElementValue: "Côte d'Ivoire",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerCountryInvalid,
        },
        {
          testName: "ValidCountryCodeWithDashes",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCountry: "United-Kingdom" },
          },
          expectedElementValue: "United-Kingdom",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerCountryInvalid,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerCountry",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerCountryInvalid,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerCountry,
    }),
  ],
});
