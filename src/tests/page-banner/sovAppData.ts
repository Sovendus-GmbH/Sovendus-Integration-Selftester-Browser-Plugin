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
  consumerYearOfBirth: 1991,
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
