import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../sovAppData";

executeOverlayTests({
  testName: "yearOfBirthSuccess",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerYearOfBirth.elementValue).toBe("Smith");
    expect(sovSelfTester.consumerYearOfBirth.statusCode).toBe(
      StatusCodes.Warning
    );
    expect(sovSelfTester.consumerYearOfBirth.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerYearOfBirthSuccess
    );
  },
});

executeOverlayTests({
  testName: "yearOfBirthMissing",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerYearOfBirth.elementValue).toBe(undefined);
    expect(sovSelfTester.consumerYearOfBirth.statusCode).toBe(
      StatusCodes.Error
    );
    expect(sovSelfTester.consumerYearOfBirth.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerYearOfBirth
    );
  },
});
