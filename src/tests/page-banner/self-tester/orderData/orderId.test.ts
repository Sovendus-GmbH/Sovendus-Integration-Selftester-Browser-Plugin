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
  testName: "orderId",
  tests: [
    ...generateTests({
      elementKey: "orderId",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "order-1234",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.orderIdSuccess,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "orderId",
      expectedMalformedStatusMessageKey: StatusMessageKeyTypes.orderIdMalformed,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.missingOrderId,
      objectElementValueType: "objectObject",
    }),
  ],
});
