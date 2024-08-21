import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";
import { sovAppDataEverythingIsOkay, sovAppDataNoParameterButIsOkay } from "../sovAppData";

executeOverlayTests({
  testName: "emailSuccess",
  sovAppData: sovAppDataEverythingIsOkay,
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerEmail.elementValue).toBe("test.001@sovendus.com");
    expect(sovSelfTester.consumerEmail.statusCode).toBe(
      StatusCodes.Warning
    );
    expect(sovSelfTester.consumerEmail.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerEmailSuccess
    );
  },
});

executeOverlayTests({
  testName: "emailMissing",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerEmail.elementValue).toBe(undefined);
    expect(sovSelfTester.consumerEmail.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerEmail.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerEmail
    );
  },
});
