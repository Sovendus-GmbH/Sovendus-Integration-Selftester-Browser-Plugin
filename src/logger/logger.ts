export function logger(message: string, level: "info" = "info"): void {
  if (level === "info") {
    // eslint-disable-next-line no-console
    console.log(`SOVENDUS INTEGRATION TESTER: ${message}`);
  }
}
