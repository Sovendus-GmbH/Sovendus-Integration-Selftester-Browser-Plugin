import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataMalformedButIsOkay,
  sovAppDataNoParameterButIsOkay,
} from "../sovAppData";

executeOverlayTests({
  testName: "yearOfBirthSuccess",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerYearOfBirth.elementValue).toBe(1991);
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
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerYearOfBirth.elementValue).toBe(null);
    expect(sovSelfTester.consumerYearOfBirth.statusCode).toBe(
      StatusCodes.Error
    );
    expect(sovSelfTester.consumerYearOfBirth.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerYearOfBirth
    );
  },
});

executeOverlayTests({
  testName: "yearOfBirthMalformed",
  sovAppData: sovAppDataMalformedButIsOkay,
  testFunction: async ({ sovSelfTester }) => {
    expect(sovSelfTester.consumerYearOfBirth.elementValue).toBe("12.06.1991");
    expect(sovSelfTester.consumerYearOfBirth.statusCode).toBe(
      StatusCodes.Error
    );
    expect(sovSelfTester.consumerYearOfBirth.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerYearOfBirthNotValid
    );
  },
});
