import type { ExplicitAnyType } from "../tester/integration-tester-data-to-sync-with-dev-hub";
import { debug as _debug } from "./logger";

const enableWorkerDebug: boolean = true;

export function debugWorker(message: string, data?: ExplicitAnyType): void {
  if (enableWorkerDebug) {
    _debug("browserBridge][serviceWorker", message, data);
  }
}
