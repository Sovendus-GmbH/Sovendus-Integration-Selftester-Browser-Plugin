import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";

import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

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
