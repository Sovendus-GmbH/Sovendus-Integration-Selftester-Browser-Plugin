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
];

executeOverlayTests({
  testName: "orderId",
  tests: [
    ...tests,
    ...generateMalformedDataTests({
      elementKey: "orderId",
      expectedMalformedStatusMessageKey: StatusMessageKeyTypes.orderIdMalformed,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.missingOrderId,
      objectElementValueType: "objectObject",
    }),
  ],
});

executeOverlayTests({
  testName: "orderIdAwin",
  tests: [
    ...tests,
    ...generateMalformedDataTests({
      elementKey: "orderId",
      expectedMalformedStatusMessageKey: StatusMessageKeyTypes.orderIdMalformed,
      expectedMissingStatusMessageKey: StatusMessageKeyTypes.missingOrderId,
      objectElementValueType: "objectObject",
      isAwinTest: true,
    }),
  ],
  isAwinTest: true,
});
