import type { ExplicitAnyType } from "./integration-tester";
import { safeURI, WarningOrFailTestResult } from "./integration-tester";
import type { StatusMessageKeyTypes } from "./integration-tester-data-to-sync-with-dev-hub";
import { StatusCodes } from "./integration-tester-data-to-sync-with-dev-hub";

export function validValueTestResult({
  value,
  missingErrorMessageKey,
  successMessageKey,
  malformedMessageKey,
  checkTypes,
}: {
  value: ExplicitAnyType;
  missingErrorMessageKey: StatusMessageKeyTypes;
  successMessageKey: StatusMessageKeyTypes;
  malformedMessageKey: StatusMessageKeyTypes;
  checkTypes?: NumberCheckType;
}): WarningOrFailTestResult<string | undefined> {
  if (isMissingValue(value)) {
    return createTestResult(
      undefined,
      missingErrorMessageKey,
      StatusCodes.Error,
    );
  }

  if (typeof value === "object") {
    return handleObject(value as object, malformedMessageKey);
  } else if (typeof value === "boolean") {
    return handleBoolean(value, malformedMessageKey);
  } else if (typeof value === "number") {
    return handleNumber(
      value,
      checkTypes,
      successMessageKey,
      malformedMessageKey,
    );
  } else if (typeof value === "string") {
    return handleString(
      value,
      checkTypes,
      successMessageKey,
      malformedMessageKey,
    );
  }
  return createTestResult(`${value}`, malformedMessageKey, StatusCodes.Error);
}

function createTestResult(
  elementValue: string | undefined,
  statusMessageKey: StatusMessageKeyTypes,
  statusCode:
    | StatusCodes.Error
    | StatusCodes.SuccessButNeedsReview
    | StatusCodes.TestFailed,
): WarningOrFailTestResult<string | undefined> {
  return new WarningOrFailTestResult<string | undefined>({
    elementValue,
    statusMessageKey,
    statusCode,
  });
}

function isMissingValue(value: ExplicitAnyType): boolean {
  return (
    value === undefined ||
    value === "undefined" ||
    value === null ||
    value === "null" ||
    value === ""
  );
}

function handleObject(
  value: object,
  malformedMessageKey: StatusMessageKeyTypes,
): WarningOrFailTestResult<string | undefined> {
  return createTestResult(
    JSON.stringify(value),
    malformedMessageKey,
    StatusCodes.Error,
  );
}

function handleBoolean(
  value: boolean,
  malformedMessageKey: StatusMessageKeyTypes,
): WarningOrFailTestResult<string | undefined> {
  return createTestResult(
    value ? "true" : "false",
    malformedMessageKey,
    StatusCodes.Error,
  );
}

function handleNumber(
  value: number,
  checkTypes: NumberCheckType | undefined,
  successMessageKey: StatusMessageKeyTypes,
  malformedMessageKey: StatusMessageKeyTypes,
): WarningOrFailTestResult<string | undefined> {
  if (checkTypes?.numberTypeAllowed) {
    if (
      isPositiveIntegerCheck(String(value)) ||
      checkTypes?.floatNumbersAllowed
    ) {
      return createTestResult(
        `${value}`,
        successMessageKey,
        StatusCodes.SuccessButNeedsReview,
      );
    }
  }
  return createTestResult(`${value}`, malformedMessageKey, StatusCodes.Error);
}
function handleString(
  value: string,
  checkTypes: NumberCheckType | undefined,
  successMessageKey: StatusMessageKeyTypes,
  malformedMessageKey: StatusMessageKeyTypes,
): WarningOrFailTestResult<string | undefined> {
  if (isObjectString(value)) {
    return createTestResult(
      "[object-Object]",
      malformedMessageKey,
      StatusCodes.Error,
    );
  }
  if (value === "true" || value === "false") {
    return createTestResult(value, malformedMessageKey, StatusCodes.Error);
  }
  if (checkTypes?.anyStringAllowed) {
    const checkValue = safeURI(
      "decodeURIComponent",
      safeURI("decodeURI", value),
    );
    if (
      hasWhitespaceIssues(checkValue) ||
      hasOnlySpecialCharacter(checkValue)
    ) {
      return createTestResult(value, malformedMessageKey, StatusCodes.Error);
    }
    return createTestResult(
      value,
      successMessageKey,
      StatusCodes.SuccessButNeedsReview,
    );
  }
  if (!isNaN(Number(value))) {
    return handleNumericString(
      value,
      checkTypes,
      successMessageKey,
      malformedMessageKey,
    );
  }
  if (isNumberStringWithComma(value, checkTypes)) {
    return createTestResult(
      safeURI("decodeURIComponent", safeURI("decodeURI", value)),
      malformedMessageKey,
      StatusCodes.Error,
    );
  }
  if (checkTypes?.mustBeANumberOrStringNumber) {
    return createTestResult(value, malformedMessageKey, StatusCodes.Error);
  }

  if (isInvalidString(value, checkTypes)) {
    return createTestResult(value, malformedMessageKey, StatusCodes.Error);
  }

  return createTestResult(
    value,
    successMessageKey,
    StatusCodes.SuccessButNeedsReview,
  );
}

function handleNumericString(
  value: string,
  checkTypes: NumberCheckType | undefined,
  successMessageKey: StatusMessageKeyTypes,
  malformedMessageKey: StatusMessageKeyTypes,
): WarningOrFailTestResult<string | undefined> {
  if (checkTypes?.anyStringAllowed) {
    if (hasOnlySpecialCharacter(value) || hasWhitespaceIssues(value)) {
      return createTestResult(value, malformedMessageKey, StatusCodes.Error);
    }
    return createTestResult(
      value,
      successMessageKey,
      StatusCodes.SuccessButNeedsReview,
    );
  }
  if (checkTypes?.stringNumbersAllowed) {
    if (hasOnlyNumbersInStringCheck(value, checkTypes)) {
      return createTestResult(
        value,
        successMessageKey,
        StatusCodes.SuccessButNeedsReview,
      );
    } else if (
      checkTypes?.floatNumbersAllowed &&
      isValidFloatNumberFormat(value)
    ) {
      return createTestResult(
        value,
        successMessageKey,
        StatusCodes.SuccessButNeedsReview,
      );
    }
    return createTestResult(value, malformedMessageKey, StatusCodes.Error);
  }
  return createTestResult(value, malformedMessageKey, StatusCodes.Error);
}

function isNumberStringWithComma(
  value: string,
  checkTypes: NumberCheckType | undefined,
): boolean {
  return !!(
    (checkTypes?.stringNumbersAllowed &&
      !isNaN(Number(value.replace(",", ".")))) ||
    (checkTypes?.stringNumbersAllowed &&
      !isNaN(
        Number(
          safeURI("decodeURIComponent", safeURI("decodeURI", value)).replace(
            ",",
            ".",
          ),
        ),
      ))
  );
}

function isObjectString(value: string): boolean {
  return (
    safeURI("encodeURI", safeURI("encodeURIComponent", "[object Object]")) ===
      value ||
    safeURI("encodeURI", "[object Object]") === value ||
    "[object Object]" === value
  );
}

function isInvalidString(
  value: string,
  checkTypes: NumberCheckType | undefined,
): boolean {
  return (
    hasWhitespaceIssues(value) ||
    hasNumberInStringCheck(value, checkTypes) ||
    hasSpecialCharacter(value)
  );
}

interface NumberCheckType {
  numberTypeAllowed?: boolean;
  stringNumbersAllowed?: boolean;
  floatNumbersAllowed?: boolean;
  numbersInStringsAllowed?: boolean;
  anyStringAllowed?: boolean;
  mustBeANumberOrStringNumber?: boolean;
}

function hasSpecialCharacter(value: string): boolean {
  // Checks for Symbols @, #, $, %, ^, &, *, (, ), +, =, [, \ and ] in value and returns true if found
  return /[@#$%^&*()+=[\]]/.test(value);
}

function hasOnlySpecialCharacter(value: string): boolean {
  // Checks if only Symbols @, #, $, %, ^, &, *, (, ), +, =, [, \ and ] in value and returns true if found
  return /^[@#$%^&*()+=[\]]+$/.test(value);
}

function hasWhitespaceIssues(value: string): boolean {
  // Checks for whitespaces at the beginning, at the end, or consecutive spaces within the string and returns true if found
  return /^\s|\s$|\s{2,}/.test(value);
}

export function hasNumberInStringCheck(
  value: string,
  checkTypes: NumberCheckType | undefined,
): boolean {
  // /\d/ checks for decimals [1-9] in value and returns true if found
  return checkTypes?.numbersInStringsAllowed ? false : /\d/.test(value);
}

function hasOnlyNumbersInStringCheck(
  value: string,
  checkTypes: NumberCheckType | undefined,
): boolean {
  return checkTypes?.numberTypeAllowed
    ? isPositiveIntegerCheck(value)
    : // Checks for positive integers or optional '+' sign followed by digits (0-9) and returns true if found
      /^\+?[0-9]\d*$/.test(value);
}

export function isPositiveIntegerCheck(value: string): boolean {
  // Checks for positive integers (1-9 followed by digits) and returns true if found
  return /^[1-9]\d*$/.test(String(value));
}

export function validateEmail(email: string): boolean {
  // Checks if the given email has a correct format, checking for alphanumeric characters,
  // dots or hyphens before the @ symbol, and a valid domain with a top-level domain of at least two characters
  return /^[\w.-]+@[a-zA-Z\d-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function checkIfValidMd5Hash(emailHash: string): boolean {
  // Checks if the given string is a valid MD5 hash, which is a 32-character hexadecimal string
  return /^[a-f0-9]{32}$/gi.test(emailHash);
}

export function isValidStreetNumberFormat(value: string): boolean {
  // Checks for a string starting with digits
  // optionally followed by a single letter or a combination
  // of digits with optional spaces, dashes, or slashes and returns true if found
  return /^(?=.*\d)[A-Za-z\d\s-/]*$/.test(value) && !hasWhitespaceIssues(value);
}

export function hasOnlyLetters(value: string): boolean {
  // Checks if the given string contains only letters
  return /[A-Za-z]/.test(value);
}

export function isValidFloatNumberFormat(value: string): boolean {
  // Checks for valid float Number, at least one digit before the decimal point,
  // and optionally one or more digits after the decimal point
  return /^\d+(\.\d+)?$/.test(value) && !hasWhitespaceIssues(value);
}
