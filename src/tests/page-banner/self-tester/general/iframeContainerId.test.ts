import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";

import {
  sovAppDataEverythingIsOkay,
  sovAppDataUndefinedButIsOkay,
} from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "iframeContainerId",
  tests: [
    ...generateTests({
      elementKey: "iframeContainerId",
      testsInfo: [
        {
          testName: "iframeContainerIdIsSet",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "sovendus-integration-container",
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "iframeContainerIdNotSet",
          sovAppData: sovAppDataUndefinedButIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.missingIframeContainerId,
        },
        {
          testName: "iframeContainerIdWithSpaces",
          sovAppData: {
            ...sovAppDataUndefinedButIsOkay,
            sovIframes1: {
              ...sovAppDataEverythingIsOkay,
              iframeContainerId: "sovendus integration container",
            },
          },
          expectedElementValue: "sovendus integration container",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.iframeContainerIdHasSpaces,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "iframeContainerId",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.iframeContainerIdMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingIframeContainerId,
      objectElementValueType: "objectObject",
      undefinedValue: null,
    }),
  ],
});
