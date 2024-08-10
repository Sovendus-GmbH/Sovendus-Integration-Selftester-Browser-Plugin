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

export const sovAppIframesAllValidData: SovIframes = {
  trafficSourceNumber: "4704",
  trafficMediumNumber: "5",
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
  sovIframes1: sovAppIframesAllValidData,
};

export const sovAppDataNoParameterButIsOkay: SovDataType = {
  sovIframes1: {
    trafficSourceNumber: "4704",
    trafficMediumNumber: "5",
  },
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
  } as unknown,
  sovIframes1: {
    trafficSourceNumber: "4704",
    trafficMediumNumber: "5",
    sessionId: true,
    timestamp: "dubidub",
    orderId: false,
    orderValue: "dreitausend",
    orderCurrency: "EURO",
    usedCouponCode: { object: "isNotGood" },
    iframeContainerId: "sovendus-integration-container",
    integrationType: { object: "isNotGood" },
  } as unknown,
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
  } as unknown,
  sovIframes1: {
    trafficSourceNumber: "4704",
    trafficMediumNumber: "5",
    sessionId: malformedObjectData,
    timestamp: malformedObjectData,
    orderId: malformedObjectData,
    orderValue: malformedObjectData,
    orderCurrency: malformedObjectData,
    usedCouponCode: malformedObjectData,
    iframeContainerId: malformedObjectData,
    integrationType: malformedObjectData,
  } as unknown,
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
  } as unknown,
  sovIframes1: {
    trafficSourceNumber: "4704",
    trafficMediumNumber: "5",
    sessionId: 1234,
    timestamp: 1234,
    orderId: 1234,
    orderValue: 1234,
    orderCurrency: 1234,
    usedCouponCode: 1234,
    iframeContainerId: 1234,
    integrationType: 1234,
  } as unknown,
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
  } as unknown,
  sovIframes1: {
    trafficSourceNumber: "4704",
    trafficMediumNumber: "5",
    sessionId: true,
    timestamp: true,
    orderId: true,
    orderValue: true,
    orderCurrency: true,
    usedCouponCode: true,
    iframeContainerId: true,
    integrationType: true,
  } as unknown,
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
  } as unknown,
  sovIframes1: {
    trafficSourceNumber: "4704",
    trafficMediumNumber: "5",
    sessionId: false,
    timestamp: false,
    orderId: false,
    orderValue: false,
    orderCurrency: false,
    usedCouponCode: false,
    iframeContainerId: false,
    integrationType: false,
  } as unknown,
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
  } as unknown,
  sovIframes1: {
    trafficSourceNumber: "4704",
    trafficMediumNumber: "5",
    sessionId: null,
    timestamp: null,
    orderId: null,
    orderValue: null,
    orderCurrency: null,
    usedCouponCode: null,
    iframeContainerId: null,
    integrationType: null,
  } as unknown,
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
  } as unknown,
  sovIframes1: {
    trafficSourceNumber: "4704",
    trafficMediumNumber: "5",
    sessionId: undefined,
    timestamp: undefined,
    orderId: undefined,
    orderValue: undefined,
    orderCurrency: undefined,
    usedCouponCode: undefined,
    iframeContainerId: undefined,
    integrationType: undefined,
  } as unknown,
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
  } as unknown,
  sovIframes1: {
    trafficSourceNumber: "4704",
    trafficMediumNumber: "5",
    sessionId: malformedArrayData,
    timestamp: malformedArrayData,
    orderId: malformedArrayData,
    orderValue: malformedArrayData,
    orderCurrency: malformedArrayData,
    usedCouponCode: malformedArrayData,
    iframeContainerId: malformedArrayData,
    integrationType: malformedArrayData,
  } as unknown,
};
