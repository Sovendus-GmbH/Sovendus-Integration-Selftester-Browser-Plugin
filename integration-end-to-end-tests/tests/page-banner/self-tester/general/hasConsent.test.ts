import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import {
  sovAppIFramesAllValidData,
  sovAppDataMalformedButIsOkay,
  sovAppDataMalformedObjectsButIsOkay,
  sovAppDataNumberButIsOkay,
  sovAppDataNullButIsOkay,
  sovAppDataUndefinedButIsOkay,
  sovAppDataEmptyStringButIsOkay,
} from "../../../testUtils/sovAppData";
import { generateTests } from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "hasConsent",
  tests: [
    ...generateTests({
      elementKey: "hasConsent",
      testsInfo: [
        {
          testName: "SuccessTrue",
          sovAppData: {
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              hasConsent: true,
            },
          },
          expectedElementValue: "true",
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "SuccessFalse",
          sovAppData: {
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              hasConsent: false,
            },
          },
          expectedElementValue: "false",
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "MissingUndefined",
          sovAppData: sovAppDataUndefinedButIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.missingHasConsent,
        },
        {
          testName: "MissingNull",
          sovAppData: sovAppDataNullButIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.missingHasConsent,
        },
        {
          testName: "MissingEmptyString",
          sovAppData: sovAppDataEmptyStringButIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.missingHasConsent,
        },
        {
          testName: "TruthyStringYes",
          sovAppData: sovAppDataMalformedButIsOkay,
          expectedElementValue: "yes (truthy)",
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "MalformedNumber",
          sovAppData: sovAppDataNumberButIsOkay,
          expectedElementValue: "1234",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.hasConsentNotABoolean,
        },
        {
          testName: "MalformedObject",
          sovAppData: sovAppDataMalformedObjectsButIsOkay,
          expectedElementValue: '{"object":"isNotGood"}',
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.hasConsentNotABoolean,
        },
      ],
    }),
  ],
});
