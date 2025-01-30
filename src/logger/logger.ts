import type { ExplicitAnyType } from "../integration-tester/integration-tester-data-to-sync-with-dev-hub";

export function logger(message: string, level: "info" = "info"): void {
  if (level === "info") {
    // eslint-disable-next-line no-console
    console.log(`SOVENDUS INTEGRATION TESTER: ${message}`);
  }
}

export function debug(
  component: string,
  message: string,
  data?: ExplicitAnyType,
): void {
  // TODO only do this in dev mode
  // eslint-disable-next-line no-console
  console.log(`[DEBUG][${component}] ${message}`, data ? data : "");
}
