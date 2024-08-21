import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";

executeOverlayTests(
  "lastNameSuccess",
  "everythingIsOkay.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerLastName.elementValue).toBe("Smith");
    expect(sovSelfTester.consumerLastName.statusCode).toBe(
      StatusCodes.Warning
    );
    expect(sovSelfTester.consumerLastName.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerLastNameSuccess
    );
  }
);

executeOverlayTests(
  "lastNameMissing",
  "noParameterButOkay.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerLastName.elementValue).toBe(undefined);
    expect(sovSelfTester.consumerLastName.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerLastName.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerLastName
    );
  }
);
