import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
} from "../sovAppData";

executeOverlayTests({
  testName: "salutationSuccessMr",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerSalutation.elementValue).toBe("Mr.");
    expect(sovSelfTester.consumerSalutation.statusCode).toBe(
      StatusCodes.Warning
    );
    expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerSalutationSuccess
    );
  },
});

executeOverlayTests({
  testName: "salutationSuccessMrs",
  sovAppData: {
    ...sovAppDataEverythingIsOkay,
    sovConsumer: { ...sovAppConsumerAllValidData, consumerSalutation: "Mrs." },
  },
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerSalutation.elementValue).toBe("Mrs.");
    expect(sovSelfTester.consumerSalutation.statusCode).toBe(
      StatusCodes.Warning
    );
    expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerSalutationSuccess
    );
  },
});

// executeOverlayTests(
//   "salutationMissing",
//   sovAppDataNoParameterButIsOkay,
//   async (driver, sovSelfTester) => {
//     expect(sovSelfTester.consumerSalutation.elementValue).toBe(undefined);
//     expect(sovSelfTester.consumerSalutation.statusCode).toBe(StatusCodes.Error);
//     expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
//       StatusMessageKeyTypes.missingConsumerSalutation
//     );
//   }
// );

executeOverlayTests({
  testName: "salutationMalformed",
  sovAppData: sovAppDataMalformedButIsOkay,
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerSalutation.elementValue).toBe("Mensch.");
    expect(sovSelfTester.consumerSalutation.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerSalutationNotValid
    );
  },
});
