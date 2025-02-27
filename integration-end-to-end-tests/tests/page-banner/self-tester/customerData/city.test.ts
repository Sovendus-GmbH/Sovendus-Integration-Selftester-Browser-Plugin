import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "consumerCity",
  tests: [
    ...generateTests({
      elementKey: "consumerCity",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "Karlsruhe",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerCitySuccess,
        },
        {
          testName: "numbersInString",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCity: "Karls123ruhe" },
          },
          expectedElementValue: "Karls123ruhe",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerCityMalformed,
        },
        {
          testName: "specialCharacters",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCity: "Karls#ruhe!" },
          },
          expectedElementValue: "Karls#ruhe!",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerCityMalformed,
        },
        {
          testName: "validCityWithDashes",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCity: "Karlsruhe-Durlach" },
          },
          expectedElementValue: "Karlsruhe-Durlach",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerCitySuccess,
        },
        {
          testName: "validCityWithSpaces",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCity: "Bad Wörishofen" },
          },
          expectedElementValue: "Bad Wörishofen",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerCitySuccess,
        },
        {
          testName: "OnlySpaces",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCity: "    " },
          },
          expectedElementValue: "    ",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerCityMalformed,
        },
        {
          testName: "MultipleSpacesBetweenWords",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCity: "Karlsruhe   Durlach" },
          },
          expectedElementValue: "Karlsruhe   Durlach",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerCityMalformed,
        },
        {
          testName: "ValidCityWithAccents",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCity: "München" },
          },
          expectedElementValue: "München",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerCitySuccess,
        },
        {
          testName: "ValidCityWithSpecialChars",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovConsumer: { consumerCity: "St. Gallen" },
          },
          expectedElementValue: "St. Gallen",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerCitySuccess,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerCity",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerCityMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerCity,
    }),
  ],
});
