import { defaultBlacklist } from "../constants";

export function isBlacklistedPage(blacklist: string[] | undefined): boolean {
  const _blacklist: string[] = [...defaultBlacklist, ...(blacklist || [])];
  return (
    _blacklist.includes(removeSubdomain(window.location.host)) ||
    window.location.protocol === "chrome-extension:"
  );
}

export function removeSubdomain(host: string): string {
  const parts = host.split(".");
  if (parts.length >= 2) {
    return parts.slice(-2).join(".");
  }
  return host;
}
