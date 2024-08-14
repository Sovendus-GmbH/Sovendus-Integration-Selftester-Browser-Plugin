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

const tests = [
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
];

executeOverlayTests({
  testName: "usedCouponCode",
  tests: [
    ...tests,
    ...generateMalformedDataTests({
      elementKey: "usedCouponCode",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.couponCodeMalformed,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.missingCouponCode,
      objectElementValueType: "objectObject",
    }),
  ],
});

executeOverlayTests({
  testName: "usedCouponCodeAwin",
  tests: [
    ...tests,
    ...generateMalformedDataTests({
      elementKey: "usedCouponCode",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.couponCodeMalformed,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.missingCouponCode,
      objectElementValueType: "objectObject",
      isAwinTest: true,
    }),
  ],
  isAwinTest: true,
});
