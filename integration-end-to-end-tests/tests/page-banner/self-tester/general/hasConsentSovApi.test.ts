import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import { sovAppIFramesAllValidData } from "../../../testUtils/sovAppData";
import { generateTests } from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

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
