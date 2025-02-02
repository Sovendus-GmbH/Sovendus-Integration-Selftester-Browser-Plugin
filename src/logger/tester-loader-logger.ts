import type { ExplicitAnyType } from "../tester/integration-tester-data-to-sync-with-dev-hub";
import { debug as _debug } from "./logger";

const enableTesterLoaderDebug: boolean = true;

export function debugTesterLoader(
  component: string,
  message: string,
  data?: ExplicitAnyType,
): void {
  if (enableTesterLoaderDebug) {
    _debug(`browserTesterLoader][${component}`, message, data);
  }
}
