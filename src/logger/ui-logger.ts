import { debug as _debug } from "../logger/logger";
import type { ExplicitAnyType } from "../tester/integration-tester-data-to-sync-with-dev-hub";

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
