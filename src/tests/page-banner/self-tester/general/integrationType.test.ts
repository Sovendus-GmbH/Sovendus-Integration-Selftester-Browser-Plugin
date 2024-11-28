import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/integration-tester/integration-tester-data-to-sync-with-dev-hub";
import {
  sovAppDataEverythingIsOkay,
  sovAwinID,
} from "@src/tests/testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

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
