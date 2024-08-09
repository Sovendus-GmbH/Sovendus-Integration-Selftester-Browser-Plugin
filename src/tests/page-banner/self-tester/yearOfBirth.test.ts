import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";

executeOverlayTests(
  "yearOfBirthSuccess",
  "everythingIsOkay.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerYearOfBirth.elementValue).toBe("Smith");
    expect(sovSelfTester.consumerYearOfBirth.statusCode).toBe(
      StatusCodes.Warning
    );
    expect(sovSelfTester.consumerYearOfBirth.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerYearOfBirthSuccess
    );
  }
);

executeOverlayTests(
  "yearOfBirthMissing",
  "noParameterButOkay.html",
  async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerYearOfBirth.elementValue).toBe(undefined);
    expect(sovSelfTester.consumerYearOfBirth.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerYearOfBirth.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerYearOfBirth
    );
  }
);
