import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import {
  sovAppDataEverythingIsOkay,
  sovAwinID,
} from "../../../testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "integrationType",
  tests: [
    ...generateTests({
      elementKey: "integrationType",
      testsInfo: [
        {
          testName: "Set",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "test-1.0.0",
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "SetWithAwinMasterTag",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "test-1.0.0",
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              useAwinMasterTagInRegularIntegration: true,
            },
          },
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "integrationType",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.integrationTypeMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.integrationTypeMissing,
      objectElementValueType: "objectObject",
      undefinedValue: "unknown",
    }),
  ],
});

executeOverlayTests({
  testName: "integrationTypeAwin",
  isAwinTest: true,
  tests: [
    ...generateTests({
      elementKey: "integrationType",
      testsInfo: [
        {
          testName: "integrationTypeAwin",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: `Awin (Merchant ID: ${sovAwinID})`,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
      ],
    }),
  ],
});
