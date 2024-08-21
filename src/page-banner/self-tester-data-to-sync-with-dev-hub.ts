export interface TestResultResponseDataType {
  integrationType?: TestResultType<string>;
  browserName?: TestResultType<BrowserTypes>;
  websiteURL?: TestResultType<string>;
  consumerSalutation?: TestResultType<string | undefined>;
  consumerFirstName?: TestResultType<string | undefined>;
  consumerLastName?: TestResultType<string | undefined>;
  consumerYearOfBirth?: TestResultType<string | undefined>;
  consumerEmail?: TestResultType<string | undefined>;
  consumerEmailHash?: TestResultType<string | undefined>;
  consumerStreet?: TestResultType<string | undefined>;
  consumerStreetNumber?: TestResultType<string | undefined>;
  consumerZipCode?: TestResultType<string | undefined>;
  consumerPhone?: TestResultType<string | undefined>;
  consumerCity?: TestResultType<string | undefined>;
  consumerCountry?: TestResultType<string | undefined>;
  trafficSourceNumber?: TestResultType<string | undefined>;
  trafficMediumNumber?: TestResultType<string | undefined>;
  orderCurrency?: TestResultType<string | undefined>;
  orderId?: TestResultType<string | undefined>;
  orderValue?: TestResultType<string | undefined>;
  sessionId?: TestResultType<string | undefined>;
  timestamp?: TestResultType<string | undefined>;
  usedCouponCode?: TestResultType<string | undefined>;
  iframeContainerId?: TestResultType<string | undefined>;
  isEnabledInBackend?: TestResultType<boolean | undefined>;
  wasExecuted?: TestResultType<boolean>;
  sovendusDivFound?: TestResultType<boolean | string | undefined>;
  multipleSovIFramesDetected?: TestResultType<boolean | undefined>;
  sovIFramesAmount?: TestResultType<number | undefined>;
  multipleIFramesAreSame?: TestResultType<number | undefined>;
  flexibleIFrameOnDOM?: TestResultType<boolean | undefined>;
  isFlexibleIframeExecutable?: TestResultType<boolean | undefined>;
  isSovendusJsOnDom?: TestResultType<boolean | undefined>;
  isSovendusJsExecutable?: TestResultType<boolean | string | undefined>;
}

export interface TestResultType<TElementValueType> {
  elementValue: TElementValueType;
  statusMessageKey: StatusMessageKeyTypes | undefined;
  statusCode: StatusCodes;
}

export type ElementValue = undefined | null | string | number | boolean;

export enum StatusCodes {
  Success = "Success",
  SuccessButNeedsReview = "SuccessButNeedsReview",
  Error = "Error",
  TestDidNotRun = "TestDidNotRun",
}

export enum BrowserTypes {
  Chrome = "Chrome",
  iPhone = "iPhone",
  Edge = "Edge",
  Android = "Android",
  Firefox = "Firefox",
  NotDetected = "Failed to detect",
}

export enum StatusMessageKeyTypes {
  awinNoSalesTracked = "awinNoSalesTracked",
  awinSaleTrackedAfterScript = "awinSaleTrackedAfterScript",
  integrationTypeMalformed = "integrationTypeMalformed",
  integrationTypeMissing = "integrationTypeMissing",
  failedToDetectBrowserType = "failedToDetectBrowserType",
  consumerSalutationNotValid = "consumerSalutationNotValid",
  consumerSalutationSuccess = "consumerSalutationSuccess",
  consumerEmailNotValid = "consumerEmailNotValid",
  consumerEmailSuccess = "consumerEmailSuccess",
  consumerEmailNotMD5Hash = "consumerEmailNotMD5Hash",
  consumerEmailHashSuccess = "consumerEmailHashSuccess",
  iFrameNotOnDOM = "iFrameNotOnDOM",
  unknownErrorIntegrationScriptFailed = "unknownErrorIntegrationScriptFailed",
  sovendusJsBlockedByCookieConsent = "sovendusJsBlockedByCookieConsent",
  flexibleIframeJsExecutedTooEarly = "flexibleIframeJsExecutedTooEarly",
  flexibleIframeJsBlockedByCookieConsent = "flexibleIframeJsBlockedByCookieConsent",
  sovendusBannerDisabled = "sovendusBannerDisabled",
  containerDivNotFoundOnDOM = "containerDivNotFoundOnDOM",
  multipleSovIframesDetected = "multipleSovIframesDetected",
  multipleSovIframesDetectedAndAreSame = "multipleSovIframesDetectedAndAreSame",
  currencyNotValid = "currencyNotValid",
  currencyMissing = "currencyMissing",
  currencySuccess = "currencySuccess",
  unixTimestampMissing = "unixTimestampMissing",
  notAUnixTimestamp = "notAUnixTimestamp",
  unixTimestampOlderThan1Minute = "unixTimestampOlderThan1Minute",
  orderValueMissing = "orderValueMissing",
  orderValueWrongFormat = "orderValueWrongFormat",
  orderValueSuccess = "orderValueSuccess",
  orderIdSuccess = "orderIdSuccess",
  orderIdMalformed = "orderIdMalformed",
  missingOrderId = "missingOrderId",
  missingSessionId = "missingSessionId",
  sessionIdSuccess = "sessionIdSuccess",
  sessionIdMalformed = "sessionIdMalformed",
  missingCouponCode = "missingCouponCode",
  couponCodeSuccess = "couponCodeSuccess",
  couponCodeMalformed = "couponCodeMalformed",
  missingConsumerStreet = "missingConsumerStreet",
  consumerStreetSuccess = "consumerStreetSuccess",
  consumerStreetMalformed = "consumerStreetMalformed",
  missingConsumerStreetNumber = "missingConsumerStreetNumber",
  consumerStreetNumberSuccess = "consumerStreetNumberSuccess",
  consumerStreetNumberMalformed = "consumerStreetNumberMalformed",
  missingConsumerZipCode = "missingConsumerZipCode",
  consumerZipCodeSuccess = "consumerZipCodeSuccess",
  consumerZipCodeMalformed = "consumerZipCodeMalformed",
  missingConsumerPhone = "missingConsumerPhone",
  consumerPhoneSuccess = "consumerPhoneSuccess",
  consumerPhoneMalformed = "consumerPhoneMalformed",
  missingConsumerCity = "missingConsumerCity",
  consumerCitySuccess = "consumerCitySuccess",
  consumerCityMalformed = "consumerCityMalformed",
  missingConsumerCountry = "missingConsumerCountry",
  consumerCountrySuccess = "consumerCountrySuccess",
  consumerCountryInvalid = "consumerCountryInvalid",
  missingTrafficSourceNumber = "missingTrafficSourceNumber",
  trafficSourceNumberMalformed = "trafficSourceNumberMalformed",
  trafficSourceNumberSuccess = "trafficSourceNumberSuccess",
  missingTrafficMediumNumber = "missingTrafficMediumNumber",
  trafficMediumNumberMalformed = "trafficMediumNumberMalformed",
  trafficMediumNumberSuccess = "trafficMediumNumberSuccess",
  missingConsumerFirstName = "missingConsumerFirstName",
  consumerFirstNameSuccess = "consumerFirstNameSuccess",
  consumerFirstNameMalformed = "consumerFirstNameMalformed",
  missingConsumerLastName = "missingConsumerLastName",
  consumerLastNameSuccess = "consumerLastNameSuccess",
  consumerLastNameMalformed = "consumerLastNameMalformed",
  missingConsumerEmailHash = "missingConsumerEmailHash",
  missingConsumerSalutation = "missingConsumerSalutation",
  missingConsumerYearOfBirth = "missingConsumerYearOfBirth",
  consumerYearOfBirthSuccess = "consumerYearOfBirthSuccess",
  consumerYearOfBirthNotValid = "consumerYearOfBirthNotValid",
  missingConsumerEmail = "missingConsumerEmail",
  missingIframeContainerId = "missingIframeContainerId",
  iframeContainerIdMalformed = "iframeContainerIdMalformed",
  iframeContainerIdHasSpaces = "iframeContainerIdHasSpaces",
  empty = "empty",
}

export const validCountries = [
  "AT",
  "CH",
  "NL",
  "GB",
  "IE",
  "FR",
  "FI",
  "ES",
  "BE",
  "PL",
  "SE",
  "DK",
  "IT",
  "NO",
  "PT",
  "DE",
];

export const validCurrencies = [
  "EUR",
  "GBP",
  "CHF",
  "PLN",
  "SEK",
  "DKK",
  "NOK",
];

export const statusMessages: {
  [errorKey in StatusMessageKeyTypes]: {
    errorText: string;
    infoText: string;
  };
} = {
  integrationTypeMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText: "Error: you can only pass a string as the integrationType",
  },
  failedToDetectBrowserType: {
    errorText: "", // error is in BrowserTypes.NotDetected
    infoText: "",
  },
  integrationTypeMissing: {
    errorText: "",
    infoText:
      "The integration type can only be detected for integrations that where done since beginning of 2024.",
  },
  awinSaleTrackedAfterScript: {
    errorText:
      "ERROR: Awin integration detected and a sale has been tracked, but for an unknown reason Sovendus hasn't been executed. A potential cause for the issue could be that the sale has been tracked after the www.dwin1.com/XXXX.js script got executed.",
    infoText:
      "ERROR: Awin integration detected and a sale has been tracked, but for an unknown reason Sovendus hasn't been executed. \
                  A potential cause for the issue could be that the sale has been tracked after the www.dwin1.com/XXXX.js script got executed. \
                  How to set up sales tracking with Awin? https://wiki.awin.com/index.php/Advertiser_Tracking_Guide/Standard_Implementation#Conversion_Tag",
  },

  awinNoSalesTracked: {
    errorText: "ERROR: No Sale tracked yet",
    infoText:
      "If this happens on the order success page, make sure you've implemented Awin sales tracking properly, as no sale was tracked. \
        How to set up sales tracking with Awin? https://wiki.awin.com/index.php/Advertiser_Tracking_Guide/Standard_Implementation#Conversion_Tag",
  },

  consumerSalutationNotValid: {
    errorText: "NOT A VALID SALUTATION",
    infoText:
      "Make sure to pass the salutation of the customer, valid are Mrs. and Mr.",
  },

  consumerYearOfBirthNotValid: {
    errorText: "NOT A VALID BIRTH YEAR",
    infoText:
      "Make sure to pass the year of birth of the customer as a string or a number, e.g. 1991",
  },

  consumerYearOfBirthSuccess: {
    errorText: "",
    infoText:
      "Make sure the year of birth aligns with the year of birth you used for the order.",
  },

  missingConsumerYearOfBirth: {
    errorText: "VALUE MISSING",
    infoText: "Make sure to pass the year of birth of the customer, e.g. 1991",
  },

  consumerEmailNotValid: {
    errorText: "NOT A VALID EMAIL",
    infoText: "Make sure to pass the email address of the customer.",
  },

  consumerEmailSuccess: {
    errorText: "",
    infoText:
      "Make sure the email address aligns with the email address you used for the order.",
  },

  missingConsumerEmail: {
    errorText: "VALUE MISSING",
    infoText:
      "Make sure the email address aligns with the email address you used for the order.",
  },

  consumerEmailNotMD5Hash: {
    errorText: "EMAIL HASH IS NOT A MD5 HASH",
    infoText:
      "The value is not a valid MD5 hash, make sure the email is properly encoded.",
  },

  consumerEmailHashSuccess: {
    errorText: "",
    infoText:
      "Make sure either a valid email or a md5 hashed email is provided. Note that hashed email support must be enabled by Sovendus.",
  },

  missingConsumerEmailHash: {
    errorText: "VALUE MISSING",
    infoText:
      "Make sure either a valid email or a md5 hashed email is provided. Note that hashed email support must be enabled by Sovendus.",
  },

  iFrameNotOnDOM: {
    errorText:
      "Sovendus was detected but flexibleiframe.js was not found on the DOM. Make sure to place the flexibleiframe.js on the DOM after the Sovendus Integration Script.",
    infoText: "",
  },

  sovendusBannerDisabled: {
    errorText:
      "ERROR: Seems like the Sovendus banner is disabled in the Sovendus backend, or doesn't exist at all. Please contact your account manager to check if you're using the right traffic source and medium numbers and check if the banner is configured properly.",
    infoText: "",
  },

  unknownErrorIntegrationScriptFailed: {
    errorText:
      "Sovendus was detected and flexibleiframe.js was executed. For an unknown reason the integration script didn't run successfully tho.",
    infoText: "",
  },

  sovendusJsBlockedByCookieConsent: {
    errorText:
      "Sovendus was detected and flexibleiframe.js was executed. But the sovendus.js script, which gets placed by the flexibleiframe.js script, got blocked most likely because of your cookie consent tool. The type of the sovendus.js script should not be set, but is {elementValue} instead.",
    infoText: "",
  },

  flexibleIframeJsExecutedTooEarly: {
    errorText:
      "Sovendus was detected but flexibleiframe.js was not executed. This is probably because the flexibleiframe.js script got placed on the DOM / executed before the Sovendus integration script. Make sure the flexibleiframe.js gets placed on the DOM / executed after the the Sovendus integration script.",
    infoText: "",
  },

  flexibleIframeJsBlockedByCookieConsent: {
    errorText:
      "Sovendus was detected but flexibleiframe.js was not executed because the script type is {elementValue} instead of text/javascript. This probably happened because your cookie consent tool blocked the script.",
    infoText: "",
  },

  containerDivNotFoundOnDOM: {
    errorText:
      "ERROR: The sovendus container div with the id {elementValue} was not found on the DOM! Make sure to add the div to the DOM before the Sovendus integration script gets executed. <br/>If the container is missing, you wont see any inline banners on the page, only overlays. On SPA (like react, angular, etc.) this will also have the effect that the banner is not disappearing after leaving the success page.",
    infoText: "",
  },

  multipleSovIframesDetected: {
    errorText:
      "ERROR: sovIframes was found {elementValue} times with different content. Make sure to check the window.sovIframes variable in the browser console.<br/> This is probably due to Sovendus being integrated multiple times.",
    infoText: "",
  },

  multipleSovIframesDetectedAndAreSame: {
    errorText:
      "ERROR: sovIframes was found {elementValue} times with the same content.<br/> This is probably due to Sovendus being executed multiple times or Sovendus being integrated multiple times.",
    infoText: "",
  },

  currencyNotValid: {
    errorText: "NOT A VALID CURRENCY",
    infoText: `Make sure a valid order currency gets passed, valid currencies are: ${validCurrencies.join(
      ", "
    )}`,
  },
  currencyMissing: {
    errorText: "VALUE MISSING",
    infoText: `Make sure a valid order currency gets passed, valid currencies are: ${validCurrencies.join(
      ", "
    )}`,
  },

  currencySuccess: {
    errorText: "",
    infoText:
      "The currency is valid, but make sure the value aligns with the actual currency of your order.",
  },

  unixTimestampMissing: {
    errorText: "VALUE MISSING",
    infoText: "Make sure to pass a unix timestamp in seconds.",
  },

  notAUnixTimestamp: {
    errorText: "IS NOT A UNIX TIME",
    infoText: "Make sure to pass a unix timestamp in seconds.",
  },

  unixTimestampOlderThan1Minute: {
    errorText: "TIMESTAMP OLDER THAN 1 MINUTE",
    infoText:
      "Make sure to pass the unix timestamp in seconds of the order time. If you just refreshed the success page after a while then this is normal and expected",
  },

  missingOrderId: {
    errorText: "VALUE MISSING",
    infoText: "Make sure to pass the order id",
  },

  orderIdSuccess: {
    errorText: "",
    infoText:
      "Make sure the value aligns with the actual order id of your order.",
  },

  orderIdMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText:
      "Make sure the value aligns with the actual order id of your order.",
  },

  orderValueMissing: {
    errorText: "VALUE MISSING",
    infoText:
      "Make sure to pass the order value, it needs to be a number e.g. 20.5 and NOT 20,5",
  },

  orderValueWrongFormat: {
    errorText: "IS NOT A NUMBER",
    infoText:
      "Make sure to pass the order value, it needs to be a number e.g. 20.5 and NOT 20,5",
  },

  orderValueSuccess: {
    errorText: "",
    infoText: "Make sure the order value is net without shipping cost.",
  },

  missingSessionId: {
    errorText: "VALUE MISSING",
    infoText: "Make sure a session id gets passed",
  },

  sessionIdSuccess: {
    errorText: "",
    infoText:
      "Make sure the session id doesn't change after a refresh, but changes with a new session.",
  },

  sessionIdMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText:
      "Make sure the session id doesn't change after a refresh, but changes with a new session.",
  },

  missingCouponCode: {
    errorText: "VALUE MISSING",
    infoText: "Make sure the used coupon code from the order gets passed",
  },

  couponCodeSuccess: {
    errorText: "",
    infoText:
      "Make sure the used coupon code from the order aligns with this value.",
  },

  couponCodeMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText:
      "Make sure the used coupon code from the order aligns with this value.",
  },

  missingConsumerStreet: {
    errorText: "VALUE MISSING",
    infoText: "Make sure to pass the street name of the delivery address.",
  },

  consumerStreetSuccess: {
    errorText: "",
    infoText:
      "Make sure this value aligns with the delivery address street name.",
  },

  consumerStreetMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText:
      "Make sure this value is a string and aligns with the delivery address street name.",
  },

  missingConsumerStreetNumber: {
    errorText: "VALUE MISSING",
    infoText: "Make sure to pass the street number from the delivery address.",
  },

  consumerStreetNumberSuccess: {
    errorText: "",
    infoText:
      "Make sure this value aligns with the delivery address street number.",
  },

  consumerStreetNumberMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText:
      "Make sure this value is a string and aligns with the delivery address street number.",
  },

  missingConsumerZipCode: {
    errorText: "VALUE MISSING",
    infoText: "Make sure to pass the zip code of the delivery address.",
  },

  consumerZipCodeSuccess: {
    errorText: "",
    infoText: "Make sure this value aligns with the delivery address zip code.",
  },

  consumerZipCodeMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText:
      "Make sure this value is a string and aligns with the delivery address zip code.",
  },

  missingConsumerPhone: {
    errorText: "VALUE MISSING",
    infoText: "Make sure to pass the phone number.",
  },

  consumerPhoneMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText: "Make sure to pass the phone number of the customer as a string.",
  },

  consumerPhoneSuccess: {
    errorText: "",
    infoText: "Make sure this value aligns with the customers phone number.",
  },

  missingConsumerCity: {
    errorText: "VALUE MISSING",
    infoText: "Make sure to pass the city of the delivery address.",
  },

  consumerCitySuccess: {
    errorText: "",
    infoText: "Make sure this value aligns with the delivery address city.",
  },

  consumerCityMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText:
      "Make sure this value is a string and aligns with the delivery address city.",
  },

  missingConsumerCountry: {
    errorText: "VALUE MISSING",
    infoText: `Make sure to pass the country id of the delivery address. Valid are: ${validCountries.join(
      ", "
    )}`,
  },

  consumerCountrySuccess: {
    errorText: "",
    infoText: `Make sure this value aligns with the country of the delivery address. Valid are: ${validCountries.join(
      ", "
    )}`,
  },

  consumerCountryInvalid: {
    errorText: "INVALID COUNTRY",
    infoText: `Make sure this value aligns with the country of the delivery address. Valid are: ${validCountries.join(
      ", "
    )}`,
  },

  missingTrafficSourceNumber: {
    errorText: "VALUE MISSING",
    infoText:
      "Make sure the value aligns with the traffic medium number you have received for this country as a string or a number.",
  },

  trafficSourceNumberMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText:
      "Make sure the value aligns with the traffic medium number you have received for this country as a string or a number.",
  },

  trafficSourceNumberSuccess: {
    errorText: "",
    infoText:
      "Make sure the value aligns with the traffic medium number you have received for this country.",
  },

  missingTrafficMediumNumber: {
    errorText: "VALUE MISSING",
    infoText:
      "Make sure the value aligns with the traffic medium number you have received for this country as a string or a number.",
  },

  trafficMediumNumberMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText:
      "Make sure the value aligns with the traffic medium number you have received for this country as a string or a number.",
  },

  trafficMediumNumberSuccess: {
    errorText: "",
    infoText:
      "Make sure the value aligns with the traffic medium number you have received for this country.",
  },

  missingIframeContainerId: {
    errorText: "VALUE MISSING",
    infoText:
      "There was no iframeContainerId specified in sovIframes. Make sure to pass a iframe container id, this id corresponds to an empty div with this id on the DOM.",
  },

  iframeContainerIdMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText:
      "Make sure this value aligns with the id of an empty div element on the DOM.",
  },

  iframeContainerIdHasSpaces: {
    errorText: "HAS SPACES",
    infoText:
      "In HTML id's cant have spaces, make sure this value aligns with the id of an empty div element on the DOM.",
  },

  missingConsumerFirstName: {
    errorText: "VALUE MISSING",
    infoText: "Make sure to pass the customers first name.",
  },

  consumerFirstNameSuccess: {
    errorText: "",
    infoText: "Make sure this value aligns with the customers first name",
  },

  consumerFirstNameMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText:
      "Make sure this value is a string and aligns with the customers first name",
  },

  missingConsumerLastName: {
    errorText: "VALUE MISSING",
    infoText: "Make sure to pass the customers last name.",
  },

  consumerLastNameSuccess: {
    errorText: "",
    infoText: "Make sure this value aligns with the customers last name",
  },

  consumerLastNameMalformed: {
    errorText: "VALUE TYPE NOT ALLOWED",
    infoText:
      "Make sure this value is a string and aligns with the customers last name",
  },

  consumerSalutationSuccess: {
    errorText: "",
    infoText:
      "Make sure this value aligns with the salutation you used for the order.",
  },

  missingConsumerSalutation: {
    errorText: "VALUE MISSING",
    infoText:
      "Make sure to pass the salutation of the customer, valid are Mrs. and Mr.",
  },
  empty: {
    errorText: "",
    infoText: "",
  },
};
