import type { ExplicitAnyType } from "../integration-tester/integration-tester-data-to-sync-with-dev-hub";
import { debug as _debug } from "../logger/logger";

const enableDebugDetector: boolean = true;

export function debugDetector(
  component: string,
  message: string,
  data?: ExplicitAnyType,
): void {
  if (enableDebugDetector) {
    _debug(`integrationDetection][${component}`, message, data);
  }
}
