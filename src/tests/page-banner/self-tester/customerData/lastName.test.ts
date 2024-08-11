import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  executeOverlayTests,
  generateMalformedDataTests,
  generateTests,
} from "../../../testUtils";
import { sovAppDataEverythingIsOkay } from "../../sovAppData";

executeOverlayTests({
  testName: "lastName",
  tests: [
    ...generateTests({
      elementKey: "consumerLastName",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "Smith",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerLastNameSuccess,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerLastName",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerLastNameMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerLastName,
    }),
  ],
});
