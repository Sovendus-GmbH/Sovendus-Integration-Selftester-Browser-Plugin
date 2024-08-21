import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { executeOverlayTests } from "../../../testUtils/testUtils";
import {
  generateMalformedDataTests,
  generateTests,
} from "@src/tests/testUtils/testCaseGenerator";
import {
  sovAppConsumerAllValidData,
  sovAppDataEverythingIsOkay,
  sovAppIframesAllValidData,
} from "../../../testUtils/sovAppData";

executeOverlayTests({
  testName: "phone",
  tests: [
    ...generateTests({
      elementKey: "consumerPhone",
      testsInfo: [
        {
          testName: "SuccessAsStringLeadingPlus",
          sovAppData: sovAppDataEverythingIsOkay,

          expectedElementValue: "+4915512005211",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerPhoneSuccess,
        },
        {
          testName: "SuccessAsStringLeadingZeros",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerPhone: "004915512005211",
            },
            sovIframes1: sovAppIframesAllValidData,
          },
          expectedElementValue: "004915512005211",
          expectedStatusCode: StatusCodes.SuccessButNeedsReview,
          expectedStatusMessageKey: StatusMessageKeyTypes.consumerPhoneSuccess,
        },
        {
          testName: "AsANumber",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerPhone: 123456,
            },
            sovIframes1: sovAppIframesAllValidData,
          },
          expectedElementValue: "123456",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerPhoneMalformed,
        },
        {
          testName: "AsAFloatNumber",
          sovAppData: {
            sovConsumer: {
              ...sovAppConsumerAllValidData,
              consumerPhone: 123456.78,
            },
            sovIframes1: sovAppIframesAllValidData,
          },
          expectedElementValue: "123456.78",
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.consumerPhoneMalformed,
        },
      ],
    }),
    ...generateMalformedDataTests({
      elementKey: "consumerPhone",
      expectedMalformedStatusMessageKey:
        StatusMessageKeyTypes.consumerPhoneMalformed,
      expectedMissingStatusMessageKey:
        StatusMessageKeyTypes.missingConsumerPhone,
    }),
  ],
});
