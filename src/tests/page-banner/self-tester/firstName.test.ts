import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";

executeOverlayTests(
  "firstNameSuccess",
  "everythingIsOkay.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerFirstName.elementValue).toBe("John");
    expect(sovSelfTester.consumerFirstName.statusCode).toBe(
      StatusCodes.Warning
    );
    expect(sovSelfTester.consumerFirstName.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerFirstNameSuccess
    );
  }
);

executeOverlayTests(
  "firstNameMissing",
  "noParameterButOkay.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerFirstName.elementValue).toBe(undefined);
    expect(sovSelfTester.consumerFirstName.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerFirstName.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerFirstName
    );
  }
);
