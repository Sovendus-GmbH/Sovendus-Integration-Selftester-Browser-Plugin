import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import {
  sovAppDataEverythingIsOkay,
  sovAppDataUndefinedButIsOkay,
} from "../../../testUtils/sovAppData";
import { generateTests } from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "sovendusDivFound",
  tests: [
    ...generateTests({
      elementKey: "sovendusDivFound",
      testsInfo: [
        {
          testName: "divFound",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "noDivFound",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "sovendus-integration-container",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.containerDivNotFoundOnDOM,
          testOptions: {
            regular: {
              disableSovendusDiv: true,
            },
          },
        },
        {
          testName: "noDivInIFrame",
          sovAppData: sovAppDataUndefinedButIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
        },
      ],
    }),
  ],
});
