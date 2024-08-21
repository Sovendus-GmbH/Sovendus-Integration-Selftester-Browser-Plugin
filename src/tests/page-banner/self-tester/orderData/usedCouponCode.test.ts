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
  testName: "usedCouponCode",
  tests: [
    ...generateTests({
      elementKey: "usedCouponCode",
      testsInfo: [
        {
          testName: "Success",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: "coupon-1234",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.couponCodeSuccess,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "usedCouponCode",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.couponCodeMalformed,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.missingCouponCode,
      objectElementValueType: "objectObject",
    }),
  ],
});
