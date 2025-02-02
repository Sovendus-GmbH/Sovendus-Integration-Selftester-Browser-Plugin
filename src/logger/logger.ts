import type { ExplicitAnyType } from "../tester/integration-tester-data-to-sync-with-dev-hub";

// TODO only do this in dev mode
export const enableDebugLogs: boolean = true;

export function logger(message: string, level: "info" = "info"): void {
  if (level === "info") {
    // eslint-disable-next-line no-console
    console.log(`SOVENDUS INTEGRATION TESTER: ${message}`);
  }
}

export function error(
  component: string,
  message: string,
  data?: ExplicitAnyType,
): void {
  // TODO send this to api
  // eslint-disable-next-line no-console
  console.error(`[ERROR][${component}] ${message}`, data ? data : "");
}

export function debug(
  component: string,
  message: string,
  data?: ExplicitAnyType,
): void {
  if (!enableDebugLogs) {
    return;
  }
  // eslint-disable-next-line no-console
  console.log(`[DEBUG][${component}] ${message}`, data ? data : "");
}
