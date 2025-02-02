import type { ExplicitAnyType } from "../tester/integration-tester-data-to-sync-with-dev-hub";
import { debug as _debug } from "./logger";

const enableExtensionLoaderDebug: boolean = true;

export function debugExtensionLoader(
  component: string,
  message: string,
  data?: ExplicitAnyType,
): void {
  if (enableExtensionLoaderDebug) {
    _debug(
      `browserBridge][browserExtensionLoader][${component}`,
      message,
      data,
    );
  }
}
