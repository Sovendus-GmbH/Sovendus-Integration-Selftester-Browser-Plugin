import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { executeOverlayTests } from "../../../testUtils/testUtils";
import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";

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
