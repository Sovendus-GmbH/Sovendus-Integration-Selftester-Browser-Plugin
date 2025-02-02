import type { ExplicitAnyType } from "../integration-tester/integration-tester-data-to-sync-with-dev-hub";
import { debug as _debug } from "../logger/logger";

const enableUiDebug: boolean = true;

export function debugUi(
  component: string,
  message: string,
  data?: ExplicitAnyType,
): void {
  if (enableUiDebug) {
    _debug(`ui][${component}`, message, data);
  }
}
