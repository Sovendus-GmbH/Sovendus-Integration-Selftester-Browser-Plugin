import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppDataNoParameterButIsOkay,
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


executeOverlayTests({
  testName: "salutationMissing",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerSalutation.elementValue).toBe(null);
    expect(sovSelfTester.consumerSalutation.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerSalutation
    );
  },
});
