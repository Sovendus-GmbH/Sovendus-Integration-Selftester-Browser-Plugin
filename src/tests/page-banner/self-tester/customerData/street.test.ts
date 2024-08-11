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
  testName: "street",
  tests: [
    ...generateTests({
      elementKey: "consumerStreet",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "test street",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerStreetSuccess,
   
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerStreet",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerStreetMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerStreet,
    }),
  ],
});
