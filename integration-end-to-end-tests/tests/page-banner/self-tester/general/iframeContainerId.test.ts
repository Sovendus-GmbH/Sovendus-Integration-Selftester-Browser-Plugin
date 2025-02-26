import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import {
  sovAppDataEverythingIsOkay,
  sovAppDataUndefinedButIsOkay,
} from "../../../testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "iFrameContainerId",
  tests: [
    ...generateTests({
      elementKey: "iFrameContainerId",
      testsInfo: [
        {
          testName: "iFrameContainerIdIsSet",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "sovendus-integration-container",
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "iFrameContainerIdNotSet",
          sovAppData: sovAppDataUndefinedButIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.missingIframeContainerId,
        },
        {
          testName: "iFrameContainerIdWithSpaces",
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
            StatusMessageKeyTypes.iFrameContainerIdHasSpaces,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "iFrameContainerId",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.iFrameContainerIdMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingIframeContainerId,
      objectElementValueType: "objectObject",
      undefinedValue: null,
    }),
  ],
});
