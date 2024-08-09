import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester";
import { executeOverlayTests } from "../../testUtils";
import { sovAppConsumerAllValidData, sovAppDataEverythingIsOkay, sovAppDataNoParameterButIsOkay } from "../sovAppData";

executeOverlayTests({
  testName: "emailHashSuccess",
  sovAppData: {
    ...sovAppDataEverythingIsOkay,
    sovConsumer: { ...sovAppConsumerAllValidData, consumerEmailHash: "46706b7505f547083f5c02a63419e79d", consumerEmail: undefined },
  },
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerEmailHash.elementValue).toBe("46706b7505f547083f5c02a63419e79d");
    expect(sovSelfTester.consumerEmailHash.statusCode).toBe(
      StatusCodes.Warning
    );
    expect(sovSelfTester.consumerEmailHash.statusMessageKey).toBe(
      StatusMessageKeyTypes.consumerEmailHashSuccess
    );
  },
});

executeOverlayTests({
  testName: "emailHashMissing",
  sovAppData: sovAppDataNoParameterButIsOkay,
  testFunction: async (driver, sovSelfTester) => {
    expect(sovSelfTester.consumerEmailHash.elementValue).toBe(null);
    expect(sovSelfTester.consumerEmailHash.statusCode).toBe(StatusCodes.Error);
    expect(sovSelfTester.consumerEmailHash.statusMessageKey).toBe(
      StatusMessageKeyTypes.missingConsumerEmailHash
    );
  },
});
