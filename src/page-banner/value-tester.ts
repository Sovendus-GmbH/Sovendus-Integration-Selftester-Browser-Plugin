import type { ExplicitAnyType } from "./integration-tester.js";
import { safeURI, WarningOrFailTestResult } from "./integration-tester.js";
import type { StatusMessageKeyTypes } from "./integration-tester-data-to-sync-with-dev-hub.js";
import { StatusCodes } from "./integration-tester-data-to-sync-with-dev-hub.js";

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
    if (/^[1-9]\d*$/.test(String(value)) || checkTypes?.floatNumbersAllowed) {
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
    return createTestResult(
      value,
      successMessageKey,
      StatusCodes.SuccessButNeedsReview,
    );
  }
  if (checkTypes?.stringNumbersAllowed) {
    if (
      checkTypes?.numberTypeAllowed
        ? /^[1-9]\d*$/.test(value)
        : /^\+?[0-9]\d*$/.test(value)
    ) {
      return createTestResult(
        value,
        successMessageKey,
        StatusCodes.SuccessButNeedsReview,
      );
    } else if (checkTypes?.floatNumbersAllowed) {
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

function hasSpecialCharacter(value: string): boolean {
  return /[@#$%^&*()+=[\]]/.test(value);
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

function hasWhitespaceIssues(value: string): boolean {
  return /^\s|\s$|\s{2,}/.test(value);
}

function hasNumberInStringCheck(
  value: string,
  checkTypes: NumberCheckType | undefined,
): boolean {
  return checkTypes?.numbersInStringsAllowed ? false : /\d/.test(value);
}

interface NumberCheckType {
  numberTypeAllowed?: boolean;
  stringNumbersAllowed?: boolean;
  floatNumbersAllowed?: boolean;
  numbersInStringsAllowed?: boolean;
  anyStringAllowed?: boolean;
  mustBeANumberOrStringNumber?: boolean;
}
