import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";

executeOverlayTests(
  "salutationSuccess",
  "everythingIsOkay.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerSalutation.elementValue).toBe("Mr.");
    expect(sovSelfTester.consumerSalutation.statusCode).toBe(
      StatusCodes.Success
    );
    expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerSalutationSuccess
    );
  }
);

executeOverlayTests(
  "salutationMissing",
  "noParameterButOkay.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerSalutation.elementValue).toBe(undefined);
    expect(sovSelfTester.consumerSalutation.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerSalutation.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerSalutation
    );
  }
);

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
