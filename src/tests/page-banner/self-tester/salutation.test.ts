import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";

executeOverlayTests(
  "salutationSuccessMr",
  "everythingIsOkay.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerSalutation.elementValue).toBe("Mr.");
    expect(sovSelfTester.consumerSalutation.statusCode).toBe(
      StatusCodes.Warning
    );
    expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerSalutationSuccess
    );
  }
);

executeOverlayTests(
  "salutationSuccessMrs",
  "salutationTests/salutationMrs.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerSalutation.elementValue).toBe("Mrs.");
    expect(sovSelfTester.consumerSalutation.statusCode).toBe(
      StatusCodes.Warning
    );
    expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerSalutationSuccess
    );
  }
);

// executeOverlayTests(
//   "salutationMissing",
//   "noParameterButOkay.html",
//   async (driver, sovSelfTester) => {
//     expect(sovSelfTester.consumerSalutation.elementValue).toBe(undefined);
//     expect(sovSelfTester.consumerSalutation.statusCode).toBe(StatusCodes.Error);
//     expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
//       StatusMessageKeyTypes.missingConsumerSalutation
//     );
//   }
// );

executeOverlayTests(
  "salutationMalformed",
  "okayButMalformedData.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerSalutation.elementValue).toBe("Mensch.");
    expect(sovSelfTester.consumerSalutation.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerSalutationNotValid
    );
  }
);
