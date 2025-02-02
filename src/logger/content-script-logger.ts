import type { ExplicitAnyType } from "../tester/integration-tester-data-to-sync-with-dev-hub";
import { debug as _debug } from "./logger";

const enableContentScriptDebug: boolean = true;

export function debugContentScript(
  message: string,
  data?: ExplicitAnyType,
): void {
  if (enableContentScriptDebug) {
    _debug("browserBridge][contentScript", message, data);
  }
}
