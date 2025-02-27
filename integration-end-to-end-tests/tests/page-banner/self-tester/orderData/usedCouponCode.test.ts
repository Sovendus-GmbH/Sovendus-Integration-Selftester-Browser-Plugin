import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import {
  sovAppDataEverythingIsOkay,
  sovAppDataNumberAsStringButIsOkay,
} from "../../../testUtils/sovAppData";
import {
  generateMalformedDataTests,
  generateTests,
} from "../../../testUtils/testCaseGenerator";
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
      {
        testName: "SuccessAsNumber",
        sovAppData: sovAppDataNumberAsStringButIsOkay,
        expectedElementValue: "1234",
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
      skipNumberCheck: true,
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
      skipNumberCheck: true,
    }),
  ],
  isAwinTest: true,
});
