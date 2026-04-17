import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { sovAppIFramesAllValidData } from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "hasConsentSovApi",
  tests: [
    ...generateTests({
      elementKey: "hasConsentSovApi",
      testsInfo: [
        {
          testName: "SuccessWhenIntegrationLoads",
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
          testName: "MissingWhenIntegrationDoesNotLoad",
          sovAppData: {
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              hasConsent: true,
            },
          },
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.missingHasConsentSovApi,
          testOptions: {
            regular: {
              disableFlexibleIFrameJs: true,
            },
          },
        },
      ],
    }),
  ],
});
