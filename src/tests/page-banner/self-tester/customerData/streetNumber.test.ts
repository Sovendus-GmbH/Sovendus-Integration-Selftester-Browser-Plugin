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
  testName: "streetNumber",
  tests: [
    ...generateTests({
      elementKey: "consumerStreetNumber",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "1a",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerStreetNumberSuccess,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerStreetNumber",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerStreetNumberMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerStreetNumber,
    }),
  ],
});
