export type ElementValue = undefined | null | string | number | boolean;

export enum StatusCodes {
  Success = "Success",
  SuccessButNeedsReview = "SuccessButNeedsReview",
  Error = "Error",
  TestDidNotRun = "TestDidNotRun",
}

export const validCountries = [
  "AT",
  "CH",
  "NL",
  "GB",
  "IE",
  "FR",
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

export enum StatusMessageKeyTypes {
  awinNoSalesTracked = "awinNoSalesTracked",
  awinSaleTrackedAfterScript = "awinSaleTrackedAfterScript",
  consumerSalutationNotValid = "consumerSalutationNotValid",
  consumerSalutationSuccess = "consumerSalutationSuccess",
  consumerYearOfBirthNotValid = "consumerYearOfBirthNotValid",
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
  orderValueMissing = "orderValueMissing",
  orderValueWrongFormat = "orderValueWrongFormat",
  orderValueSuccess = "orderValueSuccess",
  orderIdSuccess = "orderIdSuccess",
  missingOrderId = "missingOrderId",
  missingSessionId = "missingSessionId",
  sessionIdSuccess = "sessionIdSuccess",
  missingCouponCode = "missingCouponCode",
  couponCodeSuccess = "couponCodeSuccess",
  missingConsumerStreet = "missingConsumerStreet",
  consumerStreetSuccess = "consumerStreetSuccess",
  missingConsumerStreetNumber = "missingConsumerStreetNumber",
  consumerStreetNumberSuccess = "consumerStreetNumberSuccess",
  missingConsumerZipCode = "missingConsumerZipCode",
  consumerZipCodeSuccess = "consumerZipCodeSuccess",
  missingConsumerPhone = "missingConsumerPhone",
  consumerPhoneSuccess = "consumerPhoneSuccess",
  missingConsumerCity = "missingConsumerCity",
  consumerCitySuccess = "consumerCitySuccess",
  missingConsumerCountry = "missingConsumerCountry",
  consumerCountrySuccess = "consumerCountrySuccess",
  consumerCountryInvalid = "consumerCountryInvalid",
  missingTrafficSourceNumber = "missingTrafficSourceNumber",
  trafficSourceNumberSuccess = "trafficSourceNumberSuccess",
  missingTrafficMediumNumber = "missingTrafficMediumNumber",
  trafficMediumNumberSuccess = "trafficMediumNumberSuccess",
  missingIframeContainerId = "missingIframeContainerId",
  missingConsumerFirstName = "missingConsumerFirstName",
  consumerFirstNameSuccess = "consumerFirstNameSuccess",
  missingConsumerLastName = "missingConsumerLastName",
  consumerLastNameSuccess = "consumerLastNameSuccess",
  consumerYearOfBirthSuccess = "consumerYearOfBirthSuccess",
  missingConsumerEmailHash = "missingConsumerEmailHash",
  missingConsumerSalutation = "missingConsumerSalutation",
  missingConsumerYearOfBirth = "missingConsumerYearOfBirth",
  missingConsumerEmail = "missingConsumerEmail",
  iframeContainerIdSuccess = "iframeContainerIdSuccess",
  noiframeContainerId = "noiframeContainerId",
  empty = "empty",
}

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
  awinNoSalesTracked: {
    errorText:
      "ERROR: Awin integration detected and a sale has been tracked, but for an unknown reason Sovendus hasn't been executed. A potential cause for the issue could be that the sale has been tracked after the www.dwin1.com/XXXX.js script got executed.",
    infoText:
      "ERROR: Awin integration detected and a sale has been tracked, but for an unknown reason Sovendus hasn't been executed. \
                A potential cause for the issue could be that the sale has been tracked after the www.dwin1.com/XXXX.js script got executed. \
                How to set up sales tracking with Awin? https://wiki.awin.com/index.php/Advertiser_Tracking_Guide/Standard_Implementation#Conversion_Tag",
  },

  awinSaleTrackedAfterScript: {
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
    infoText: "Make sure to pass the year of birth of the customer, e.g. 1991",
  },

  consumerYearOfBirthSuccess: {
    errorText: "",
    infoText:
      "Make sure the year of birth aligns with the year of birth you used for the order.",
  },

  missingConsumerYearOfBirth: {
    errorText: "DATA IS MISSING",
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
    errorText: "DATA IS MISSING",
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
    errorText: "DATA IS MISSING",
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

  noiframeContainerId: {
    errorText:
      "ERROR: There was no iframeContainerId specified in sovIframes. Make sure to define it and also make sure the div with this id exists on the DOM.",
    infoText: "",
  },

  unknownErrorIntegrationScriptFailed: {
    errorText:
      "Sovendus was detected and flexibleiframe.js was executed. For an unknown reason the integration script didn't run successfully tho.",
    infoText: "",
  },

  sovendusJsBlockedByCookieConsent: {
    errorText:
      "Sovendus was detected and flexibleiframe.js was executed. But the sovendus.js script, which gets placed by the flexibleiframe.js script, got blocked most likely because of your cookie consent tool. The type of the sovendus.js script should not be set, but is ${elementValue} instead.",
    infoText: "",
  },

  flexibleIframeJsExecutedTooEarly: {
    errorText:
      "Sovendus was detected but flexibleiframe.js was not executed. This is probably because the flexibleiframe.js script got placed on the DOM / executed before the Sovendus integration script. Make sure the flexibleiframe.js gets placed on the DOM / executed after the the Sovendus integration script.",
    infoText: "",
  },

  flexibleIframeJsBlockedByCookieConsent: {
    errorText:
      "Sovendus was detected but flexibleiframe.js was not executed because the script type is ${elementValue} instead of text/javascript. This probably happened because your cookie consent tool blocked the script.",
    infoText: "",
  },

  containerDivNotFoundOnDOM: {
    errorText:
      "ERROR: The sovendus container div with the id ${elementValue} was not found on the DOM! Make sure to add the div to the DOM before the Sovendus integration script gets executed. If the container is missing, you wont see any inline banners on the page, only overlays. On SPA (like react, angular, etc.) this will also have the effect that the banner is not disappearing after leaving the success page.",
    infoText: "",
  },

  multipleSovIframesDetected: {
    errorText:
      "ERROR: sovIframes was found ${elementValue} times with different content. Make sure to check the window.sovIframes variable in the browser console. This is probably due to Sovendus being integrated multiple times.",
    infoText: "",
  },

  multipleSovIframesDetectedAndAreSame: {
    errorText:
      "ERROR: sovIframes was found ${elementValue} times with the same content. This is probably due to Sovendus being executed multiple times or Sovendus being integrated multiple times.",
    infoText: "",
  },

  currencyNotValid: {
    errorText: "NOT A VALID CURRENCY",
    infoText: `Make sure a valid order currency gets passed, valid currencies are: ${validCurrencies}`,
  },
  currencyMissing: {
    errorText: "DATA MISSING",
    infoText: `Make sure a valid order currency gets passed, valid currencies are: ${validCurrencies}`,
  },

  currencySuccess: {
    errorText: "",
    infoText:
      "The currency is valid, but make sure the value aligns with the actual currency of your order.",
  },

  unixTimestampMissing: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass a unix timestamp in seconds.",
  },

  notAUnixTimestamp: {
    errorText: "IS NOT A UNIX TIME",
    infoText: "Make sure to pass a unix timestamp in seconds.",
  },

  missingOrderId: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the order id",
  },

  orderIdSuccess: {
    errorText: "",
    infoText:
      "Make sure the value aligns with the actual order id of your order.",
  },

  orderValueMissing: {
    errorText: "DATA IS MISSING",
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
    errorText: "DATA IS MISSING",
    infoText: "Make sure a session id gets passed",
  },

  sessionIdSuccess: {
    errorText: "",
    infoText:
      "Make sure the session id doesn't change after a refresh, but changes with a new session.",
  },

  missingCouponCode: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure the used coupon code from the order gets passed",
  },

  couponCodeSuccess: {
    errorText: "",
    infoText:
      "Make sure the used coupon code from the order aligns with this value.",
  },

  missingConsumerStreet: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the street name of the delivery address.",
  },

  consumerStreetSuccess: {
    errorText: "",
    infoText:
      "Make sure this value aligns with the delivery address street name.",
  },

  missingConsumerStreetNumber: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the street number from the delivery address.",
  },

  consumerStreetNumberSuccess: {
    errorText: "",
    infoText:
      "Make sure this value aligns with the delivery address street number.",
  },

  missingConsumerZipCode: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the zip code of the delivery address.",
  },

  consumerZipCodeSuccess: {
    errorText: "",
    infoText: "Make sure this value aligns with the delivery address zip code.",
  },

  missingConsumerPhone: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the phone number.",
  },

  consumerPhoneSuccess: {
    errorText: "",
    infoText: "Make sure this value aligns with the customers phone number.",
  },

  missingConsumerCity: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the city of the delivery address.",
  },

  consumerCitySuccess: {
    errorText: "",
    infoText: "Make sure this value aligns with the delivery address city.",
  },

  missingConsumerCountry: {
    errorText: "DATA IS MISSING",
    infoText: `Make sure to pass the country id of the delivery address. Valid are: ${validCountries}`,
  },

  consumerCountrySuccess: {
    errorText: "",
    infoText: `Make sure this value aligns with the country of the delivery address. Valid are: ${validCountries}`,
  },

  consumerCountryInvalid: {
    errorText: "INVALID COUNTRY",
    infoText: `Make sure this value aligns with the country of the delivery address. Valid are: ${validCountries}`,
  },

  missingTrafficSourceNumber: {
    errorText: "DATA IS MISSING",
    infoText:
      "Make sure to pass the traffic source number you've received in your integration docs.",
  },

  trafficSourceNumberSuccess: {
    errorText: "",
    infoText:
      "Make sure this value aligns with the traffic source number you've received in your integration docs.",
  },

  missingTrafficMediumNumber: {
    errorText: "DATA IS MISSING",
    infoText:
      "Make sure to pass the traffic medium number you've received in your integration docs.",
  },

  trafficMediumNumberSuccess: {
    errorText: "",
    infoText:
      "Make sure the value aligns with the traffic medium number you have received for this country.",
  },

  missingIframeContainerId: {
    errorText: "DATA IS MISSING",
    infoText:
      "Make sure to pass a iframe container id, this id corresponds to a div with this id on the DOM.",
  },

  iframeContainerIdSuccess: {
    errorText: "",
    infoText:
      "Make sure this value aligns with a iframe container id, this id corresponds to a div with this id on the DOM.",
  },

  missingConsumerFirstName: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the customers first name.",
  },

  consumerFirstNameSuccess: {
    errorText: "",
    infoText: "Make sure this value aligns with the customers first name",
  },

  missingConsumerLastName: {
    errorText: "DATA IS MISSING",
    infoText: "Make sure to pass the customers last name.",
  },

  consumerLastNameSuccess: {
    errorText: "",
    infoText: "Make sure this value aligns with the customers last name",
  },

  consumerSalutationSuccess: {
    errorText: "",
    infoText:
      "Make sure this value aligns with the salutation you used for the order.",
  },

  missingConsumerSalutation: {
    errorText: "DATA IS MISSING",
    infoText:
      "Make sure to pass the salutation of the customer, valid are Mrs. and Mr.",
  },
  empty: {
    errorText: "",
    infoText: "",
  },
};
