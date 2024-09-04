import type { ExplicitAnyType } from "./integration-tester.js";
import { WarningOrFailTestResult } from "./integration-tester.js";
import type { StatusMessageKeyTypes } from "./integration-tester-data-to-sync-with-dev-hub.js";
import { StatusCodes } from "./integration-tester-data-to-sync-with-dev-hub.js";

export function validValueTestResult({
  value,
  missingErrorMessageKey,
  successMessageKey,
  malformedMessageKey,
  numberCheckType,
}: {
  value: ExplicitAnyType;
  missingErrorMessageKey: StatusMessageKeyTypes;
  successMessageKey: StatusMessageKeyTypes;
  malformedMessageKey: StatusMessageKeyTypes;
  numberCheckType?: NumberCheckType;
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
      numberCheckType,
      successMessageKey,
      malformedMessageKey,
    );
  } else if (typeof value === "string") {
    return handleString(
      value,
      numberCheckType,
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
  numberCheckType: NumberCheckType | undefined,
  successMessageKey: StatusMessageKeyTypes,
  malformedMessageKey: StatusMessageKeyTypes,
): WarningOrFailTestResult<string | undefined> {
  if (numberCheckType?.numberTypeAllowed) {
    if (
      /^[1-9]\d*$/.test(String(value)) ||
      numberCheckType?.floatNumbersAllowed
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
  numberCheckType: NumberCheckType | undefined,
  successMessageKey: StatusMessageKeyTypes,
  malformedMessageKey: StatusMessageKeyTypes,
): WarningOrFailTestResult<string | undefined> {
  if (!isNaN(Number(value))) {
    return handleNumericString(
      value,
      numberCheckType,
      successMessageKey,
      malformedMessageKey,
    );
  }
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
  if (numberCheckType?.anyStringAllowed) {
    return createTestResult(
      value,
      successMessageKey,
      StatusCodes.SuccessButNeedsReview,
    );
  }

  if (isNumberStringWithComma(value, numberCheckType)) {
    return createTestResult(
      decodeURIComponent(decodeURI(value)),
      malformedMessageKey,
      StatusCodes.Error,
    );
  }

  if (isInvalidString(value, numberCheckType)) {
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
  numberCheckType: NumberCheckType | undefined,
  successMessageKey: StatusMessageKeyTypes,
  malformedMessageKey: StatusMessageKeyTypes,
): WarningOrFailTestResult<string | undefined> {
  if (numberCheckType?.anyStringAllowed) {
    return createTestResult(
      value,
      successMessageKey,
      StatusCodes.SuccessButNeedsReview,
    );
  }
  if (numberCheckType?.stringNumbersAllowed) {
    if (
      numberCheckType?.numberTypeAllowed
        ? /^[1-9]\d*$/.test(value)
        : /^\+?[0-9]\d*$/.test(value)
    ) {
      return createTestResult(
        value,
        successMessageKey,
        StatusCodes.SuccessButNeedsReview,
      );
    } else if (numberCheckType?.floatNumbersAllowed) {
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
  numberCheckType: NumberCheckType | undefined,
): boolean {
  return !!(
    (numberCheckType?.stringNumbersAllowed &&
      !isNaN(Number(value.replace(",", ".")))) ||
    (numberCheckType?.stringNumbersAllowed &&
      !isNaN(Number(decodeURIComponent(decodeURI(value)).replace(",", "."))))
  );
}

function isObjectString(value: string): boolean {
  return (
    encodeURI(encodeURIComponent("[object Object]")) === value ||
    encodeURI("[object Object]") === value ||
    "[object Object]" === value
  );
}

function isInvalidString(
  value: string,
  numberCheckType: NumberCheckType | undefined,
): boolean {
  return (
    (numberCheckType?.numbersInStringsAllowed
      ? !/^\d+$/.test(value)
      : /\d/.test(value)) || /^\s|\s$|\s{2,}/.test(value)
  );
}

interface NumberCheckType {
  numberTypeAllowed?: boolean;
  stringNumbersAllowed?: boolean;
  floatNumbersAllowed?: boolean;
  numbersInStringsAllowed?: boolean;
  anyStringAllowed?: boolean;
}
