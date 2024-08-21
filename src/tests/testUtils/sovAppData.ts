import { SovConsumer, SovIframes } from "@src/page-banner/self-tester";

export function getSovAppData(sovAppData: SovDataType) {
  const sovData: SovFinalDataType = {
    sovIframes: [sovAppData.sovIframes1],
  };
  if (sovAppData.sovConsumer) {
    sovData.sovConsumer = sovAppData.sovConsumer;
  }
  if (sovAppData.sovIframes2) {
    sovData.sovIframes.push(sovAppData.sovIframes2);
  }
  return sovData;
}

export interface SovFinalDataType {
  sovConsumer?: SovConsumer;
  sovIframes: SovIframes[];
}

export interface SovDataType {
  sovConsumer?: SovConsumer;
  sovIframes1: SovIframes;
  sovIframes2?: SovIframes;
  payload?: any;
}

export const sovAppConsumerAllValidData: SovConsumer = {
  consumerSalutation: "Mr.",
  consumerFirstName: "John",
  consumerLastName: "Smith",
  consumerEmail: "test.001@sovendus.com",
  consumerCountry: "DE",
  consumerZipcode: "76135",
  consumerPhone: "+4915512005211",
  consumerYearOfBirth: "1991",
  consumerStreet: "test street",
  consumerStreetNumber: "1a",
  consumerCity: "Karlsruhe",
};

export const sovTestTrafficSourceNumber = "7849";

export const sovTestTrafficMediumNumbers = {
  VNInlineDisabled: { trafficMediumNumber: "1" },
  VNStickyDisabled: { trafficMediumNumber: "4" },
  CBOverlayDisabled: { trafficMediumNumber: "5" },
  CBVNOverlayDisabled: { trafficMediumNumber: "9" },
  CBVNInlineDisabled: { trafficMediumNumber: "10" },
  CBInlineDisabled: { trafficMediumNumber: "11" },
  CBInlineVNStickyDisabled: { trafficMediumNumber: "12" },
  CBOverlayVNInlineDisabled: { trafficMediumNumber: "13" },
  CBOverlayVNStickyDisabled: { trafficMediumNumber: "14" },

  VNInline: { trafficMediumNumber: "15" },
  VNSticky: { trafficMediumNumber: "16" },
  CBOverlay: { trafficMediumNumber: "17" },
  CBVNOverlay: { trafficMediumNumber: "18" },
  CBVNInline: { trafficMediumNumber: "19" },
  CBInline: { trafficMediumNumber: "20" },
  CBInlineVNSticky: { trafficMediumNumber: "21" },
  CBOverlayVNInline: { trafficMediumNumber: "22" },
  CBOverlayVNSticky: { trafficMediumNumber: "23" },
};

export const sovAppIFramesAllValidData: SovIframes = {
  trafficSourceNumber: sovTestTrafficSourceNumber,
  trafficMediumNumber: sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
  sessionId: "session-1234",
  timestamp: "1715872691",
  orderId: "order-1234",
  orderValue: "12.5",
  orderCurrency: "EUR",
  usedCouponCode: "coupon-1234",
  iframeContainerId: "sovendus-integration-container",
  integrationType: "test-1.0.0",
};

export const sovAppDataEverythingIsOkay: SovDataType = {
  sovConsumer: sovAppConsumerAllValidData,
  sovIframes1: sovAppIFramesAllValidData,
};

export const sovAppDataNoParameterButIsOkay: SovDataType = {
  sovIframes1: {
    trafficSourceNumber: sovTestTrafficSourceNumber,
    trafficMediumNumber:
      sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
  },
};

export const sovAppDataNoParameter: SovDataType = {
  sovIframes1: {},
};

export const sovAppDataMalformedButIsOkay: SovDataType = {
  sovConsumer: {
    consumerSalutation: "Mensch.",
    consumerFirstName: 21,
    consumerLastName: 500,
    consumerEmail: "test.002",
    consumerCountry: "Space",
    consumerZipcode: "City",
    consumerPhone: "test@test.de",
    consumerYearOfBirth: "12.06.1991",
    consumerStreet: 1,
    consumerStreetNumber: "Street Name",
    consumerCity: { object: "isNotGood" },
  },
  sovIframes1: {
    trafficSourceNumber: sovTestTrafficSourceNumber,
    trafficMediumNumber:
      sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
    sessionId: true,
    timestamp: "dubidub",
    orderId: false,
    orderValue: "dreitausend",
    orderCurrency: "EURO",
    usedCouponCode: { object: "isNotGood" },
    iframeContainerId: "sovendus-integration-container",
    integrationType: { object: "isNotGood" },
  },
};

export const malformedObjectData = { object: "isNotGood" };
export const sovAppDataMalformedObjectsButIsOkay: SovDataType = {
  sovConsumer: {
    consumerSalutation: malformedObjectData,
    consumerFirstName: malformedObjectData,
    consumerLastName: malformedObjectData,
    consumerEmail: malformedObjectData,
    consumerCountry: malformedObjectData,
    consumerZipcode: malformedObjectData,
    consumerPhone: malformedObjectData,
    consumerYearOfBirth: malformedObjectData,
    consumerStreet: malformedObjectData,
    consumerStreetNumber: malformedObjectData,
    consumerCity: malformedObjectData,
  },
  sovIframes1: {
    trafficSourceNumber: sovTestTrafficSourceNumber,
    trafficMediumNumber:
      sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
    sessionId: malformedObjectData,
    timestamp: malformedObjectData,
    orderId: malformedObjectData,
    orderValue: malformedObjectData,
    orderCurrency: malformedObjectData,
    usedCouponCode: malformedObjectData,
    iframeContainerId: malformedObjectData,
    integrationType: malformedObjectData,
  },
};

export const sovAppDataMalformedObjects: SovDataType = {
  sovConsumer: {
    consumerSalutation: malformedObjectData,
    consumerFirstName: malformedObjectData,
    consumerLastName: malformedObjectData,
    consumerEmail: malformedObjectData,
    consumerCountry: malformedObjectData,
    consumerZipcode: malformedObjectData,
    consumerPhone: malformedObjectData,
    consumerYearOfBirth: malformedObjectData,
    consumerStreet: malformedObjectData,
    consumerStreetNumber: malformedObjectData,
    consumerCity: malformedObjectData,
  },
  sovIframes1: {
    trafficSourceNumber: malformedObjectData,
    trafficMediumNumber: malformedObjectData,
    sessionId: malformedObjectData,
    timestamp: malformedObjectData,
    orderId: malformedObjectData,
    orderValue: malformedObjectData,
    orderCurrency: malformedObjectData,
    usedCouponCode: malformedObjectData,
    iframeContainerId: malformedObjectData,
    integrationType: malformedObjectData,
  },
};

export const sovAppDataNumberButIsOkay: SovDataType = {
  sovConsumer: {
    consumerSalutation: 1234,
    consumerFirstName: 1234,
    consumerLastName: 1234,
    consumerEmail: 1234,
    consumerCountry: 1234,
    consumerZipcode: 1234,
    consumerPhone: 1234,
    consumerYearOfBirth: 1234,
    consumerStreet: 1234,
    consumerStreetNumber: 1234,
    consumerCity: 1234,
  },
  sovIframes1: {
    trafficSourceNumber: sovTestTrafficSourceNumber,
    trafficMediumNumber:
      sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
    sessionId: 1234,
    timestamp: 1234,
    orderId: 1234,
    orderValue: 1234,
    orderCurrency: 1234,
    usedCouponCode: 1234,
    iframeContainerId: 1234,
    integrationType: 1234,
  },
};

export const sovAppDataNumberWithCommaInsteadOfDotButIsOkay: SovDataType = {
  sovConsumer: {
    consumerSalutation: "1234,56",
    consumerFirstName: "1234,56",
    consumerLastName: "1234,56",
    consumerEmail: "1234,56",
    consumerCountry: "1234,56",
    consumerZipcode: "1234,56",
    consumerPhone: "1234,56",
    consumerYearOfBirth: "1234,56",
    consumerStreet: "1234,56",
    consumerStreetNumber: "1234,56",
    consumerCity: "1234,56",
  },
  sovIframes1: {
    trafficSourceNumber: sovTestTrafficSourceNumber,
    trafficMediumNumber: "5",
    sessionId: "1234,56",
    timestamp: "1234,56",
    orderId: "1234,56",
    orderValue: "1234,56",
    orderCurrency: "1234,56",
    usedCouponCode: "1234,56",
    iframeContainerId: "1234,56",
    integrationType: "1234,56",
  },
};

export const sovAppDataFloatNumberButIsOkay: SovDataType = {
  sovConsumer: {
    consumerSalutation: 1234.56,
    consumerFirstName: 1234.56,
    consumerLastName: 1234.56,
    consumerEmail: 1234.56,
    consumerCountry: 1234.56,
    consumerZipcode: 1234.56,
    consumerPhone: 1234.56,
    consumerYearOfBirth: 1234.56,
    consumerStreet: 1234.56,
    consumerStreetNumber: 1234.56,
    consumerCity: 1234.56,
  },
  sovIframes1: {
    trafficSourceNumber: sovTestTrafficSourceNumber,
    trafficMediumNumber:
      sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
    sessionId: 1234.56,
    timestamp: 1234.56,
    orderId: 1234.56,
    orderValue: 1234.56,
    orderCurrency: 1234.56,
    usedCouponCode: 1234.56,
    iframeContainerId: 1234.56,
    integrationType: 1234.56,
  },
};

export const sovAppDataTrueButIsOkay: SovDataType = {
  sovConsumer: {
    consumerSalutation: true,
    consumerFirstName: true,
    consumerLastName: true,
    consumerEmail: true,
    consumerCountry: true,
    consumerZipcode: true,
    consumerPhone: true,
    consumerYearOfBirth: true,
    consumerStreet: true,
    consumerStreetNumber: true,
    consumerCity: true,
  },
  sovIframes1: {
    trafficSourceNumber: sovTestTrafficSourceNumber,
    trafficMediumNumber:
      sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
    sessionId: true,
    timestamp: true,
    orderId: true,
    orderValue: true,
    orderCurrency: true,
    usedCouponCode: true,
    iframeContainerId: true,
    integrationType: true,
  },
};

export const sovAppDataTrue: SovDataType = {
  sovConsumer: {
    consumerSalutation: true,
    consumerFirstName: true,
    consumerLastName: true,
    consumerEmail: true,
    consumerCountry: true,
    consumerZipcode: true,
    consumerPhone: true,
    consumerYearOfBirth: true,
    consumerStreet: true,
    consumerStreetNumber: true,
    consumerCity: true,
  },
  sovIframes1: {
    trafficSourceNumber: true,
    trafficMediumNumber: true,
    sessionId: true,
    timestamp: true,
    orderId: true,
    orderValue: true,
    orderCurrency: true,
    usedCouponCode: true,
    iframeContainerId: true,
    integrationType: true,
  },
};

export const sovAppDataFalseButIsOkay: SovDataType = {
  sovConsumer: {
    consumerSalutation: false,
    consumerFirstName: false,
    consumerLastName: false,
    consumerEmail: false,
    consumerCountry: false,
    consumerZipcode: false,
    consumerPhone: false,
    consumerYearOfBirth: false,
    consumerStreet: false,
    consumerStreetNumber: false,
    consumerCity: false,
  },
  sovIframes1: {
    trafficSourceNumber: sovTestTrafficSourceNumber,
    trafficMediumNumber:
      sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
    sessionId: false,
    timestamp: false,
    orderId: false,
    orderValue: false,
    orderCurrency: false,
    usedCouponCode: false,
    iframeContainerId: false,
    integrationType: false,
  },
};

export const sovAppDataFalse: SovDataType = {
  sovConsumer: {
    consumerSalutation: false,
    consumerFirstName: false,
    consumerLastName: false,
    consumerEmail: false,
    consumerCountry: false,
    consumerZipcode: false,
    consumerPhone: false,
    consumerYearOfBirth: false,
    consumerStreet: false,
    consumerStreetNumber: false,
    consumerCity: false,
  },
  sovIframes1: {
    trafficSourceNumber: false,
    trafficMediumNumber: false,
    sessionId: false,
    timestamp: false,
    orderId: false,
    orderValue: false,
    orderCurrency: false,
    usedCouponCode: false,
    iframeContainerId: false,
    integrationType: false,
  },
};

export const sovAppDataNullButIsOkay: SovDataType = {
  sovConsumer: {
    consumerSalutation: null,
    consumerFirstName: null,
    consumerLastName: null,
    consumerEmail: null,
    consumerCountry: null,
    consumerZipcode: null,
    consumerPhone: null,
    consumerYearOfBirth: null,
    consumerStreet: null,
    consumerStreetNumber: null,
    consumerCity: null,
  },
  sovIframes1: {
    trafficSourceNumber: sovTestTrafficSourceNumber,
    trafficMediumNumber:
      sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
    sessionId: null,
    timestamp: null,
    orderId: null,
    orderValue: null,
    orderCurrency: null,
    usedCouponCode: null,
    iframeContainerId: null,
    integrationType: null,
  },
};

export const sovAppDataNull: SovDataType = {
  sovConsumer: {
    consumerSalutation: null,
    consumerFirstName: null,
    consumerLastName: null,
    consumerEmail: null,
    consumerCountry: null,
    consumerZipcode: null,
    consumerPhone: null,
    consumerYearOfBirth: null,
    consumerStreet: null,
    consumerStreetNumber: null,
    consumerCity: null,
  },
  sovIframes1: {
    trafficSourceNumber: null,
    trafficMediumNumber: null,
    sessionId: null,
    timestamp: null,
    orderId: null,
    orderValue: null,
    orderCurrency: null,
    usedCouponCode: null,
    iframeContainerId: null,
    integrationType: null,
  },
};

export const sovAppDataUndefinedButIsOkay: SovDataType = {
  sovConsumer: {
    consumerSalutation: undefined,
    consumerFirstName: undefined,
    consumerLastName: undefined,
    consumerEmail: undefined,
    consumerCountry: undefined,
    consumerZipcode: undefined,
    consumerPhone: undefined,
    consumerYearOfBirth: undefined,
    consumerStreet: undefined,
    consumerStreetNumber: undefined,
    consumerCity: undefined,
  },
  sovIframes1: {
    trafficSourceNumber: sovTestTrafficSourceNumber,
    trafficMediumNumber:
      sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
    sessionId: undefined,
    timestamp: undefined,
    orderId: undefined,
    orderValue: undefined,
    orderCurrency: undefined,
    usedCouponCode: undefined,
    iframeContainerId: undefined,
    integrationType: undefined,
  },
};

export const sovAppDataUndefined: SovDataType = {
  sovConsumer: {
    consumerSalutation: undefined,
    consumerFirstName: undefined,
    consumerLastName: undefined,
    consumerEmail: undefined,
    consumerCountry: undefined,
    consumerZipcode: undefined,
    consumerPhone: undefined,
    consumerYearOfBirth: undefined,
    consumerStreet: undefined,
    consumerStreetNumber: undefined,
    consumerCity: undefined,
  },
  sovIframes1: {
    trafficSourceNumber: undefined,
    trafficMediumNumber: undefined,
    sessionId: undefined,
    timestamp: undefined,
    orderId: undefined,
    orderValue: undefined,
    orderCurrency: undefined,
    usedCouponCode: undefined,
    iframeContainerId: undefined,
    integrationType: undefined,
  },
};

export const malformedArrayData = [{ object: "isNotGood" }];
export const sovAppDataMalformedArrayButIsOkay: SovDataType = {
  sovConsumer: {
    consumerSalutation: malformedArrayData,
    consumerFirstName: malformedArrayData,
    consumerLastName: malformedArrayData,
    consumerEmail: malformedArrayData,
    consumerCountry: malformedArrayData,
    consumerZipcode: malformedArrayData,
    consumerPhone: malformedArrayData,
    consumerYearOfBirth: malformedArrayData,
    consumerStreet: malformedArrayData,
    consumerStreetNumber: malformedArrayData,
    consumerCity: malformedArrayData,
  },
  sovIframes1: {
    trafficSourceNumber: sovTestTrafficSourceNumber,
    trafficMediumNumber:
      sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
    sessionId: malformedArrayData,
    timestamp: malformedArrayData,
    orderId: malformedArrayData,
    orderValue: malformedArrayData,
    orderCurrency: malformedArrayData,
    usedCouponCode: malformedArrayData,
    iframeContainerId: malformedArrayData,
    integrationType: malformedArrayData,
  },
};

export const sovAppDataMalformedArray: SovDataType = {
  sovConsumer: {
    consumerSalutation: malformedArrayData,
    consumerFirstName: malformedArrayData,
    consumerLastName: malformedArrayData,
    consumerEmail: malformedArrayData,
    consumerCountry: malformedArrayData,
    consumerZipcode: malformedArrayData,
    consumerPhone: malformedArrayData,
    consumerYearOfBirth: malformedArrayData,
    consumerStreet: malformedArrayData,
    consumerStreetNumber: malformedArrayData,
    consumerCity: malformedArrayData,
  },
  sovIframes1: {
    trafficSourceNumber: malformedArrayData,
    trafficMediumNumber: malformedArrayData,
    sessionId: malformedArrayData,
    timestamp: malformedArrayData,
    orderId: malformedArrayData,
    orderValue: malformedArrayData,
    orderCurrency: malformedArrayData,
    usedCouponCode: malformedArrayData,
    iframeContainerId: malformedArrayData,
    integrationType: malformedArrayData,
  },
};
