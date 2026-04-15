import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  sovAppIFramesAllValidData,
  sovAppDataMalformedButIsOkay,
  sovAppDataMalformedObjectsButIsOkay,
  sovAppDataNumberButIsOkay,
  sovAppDataNullButIsOkay,
  sovAppDataUndefinedButIsOkay,
  sovAppDataEmptyStringButIsOkay,
} from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

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
          testName: "MalformedString",
          sovAppData: sovAppDataMalformedButIsOkay,
          expectedElementValue: "yes",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.hasConsentNotABoolean,
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
