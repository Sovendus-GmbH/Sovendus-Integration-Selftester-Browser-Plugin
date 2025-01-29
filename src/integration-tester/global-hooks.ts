interface ConsoleOverrideOptions {
  prefix?: string;
  allowedDomains?: string[];
}

function isSameDomain(iframe: HTMLIFrameElement): boolean {
  try {
    return Boolean(iframe.contentWindow?.location.hostname);
  } catch {
    return false;
  }
}

function createConsoleProxy(originalConsole: Console, prefix: string): Console {
  return {
    log: (...args) => originalConsole.log(prefix, ...args),
    warn: (...args) => originalConsole.warn(prefix, ...args),
    error: (...args) => originalConsole.error(prefix, ...args),
    info: (...args) => originalConsole.info(prefix, ...args),
    debug: (...args) => originalConsole.debug(prefix, ...args),
  } as Console;
}

function overrideConsoleInWindow(windowObj: Window, prefix: string) {
  try {
    windowObj.console = createConsoleProxy(windowObj.console, prefix);
  } catch (e) {
    // Silently fail for cross-origin windows
  }
}

function handleIframes(prefix: string) {
  // Handle existing iframes
  const iframes = document.getElementsByTagName("iframe");
  Array.from(iframes).forEach((iframe) => {
    if (isSameDomain(iframe) && iframe.contentWindow) {
      overrideConsoleInWindow(iframe.contentWindow, prefix);
    }
  });

  // Watch for new iframes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (
          node instanceof HTMLIFrameElement &&
          isSameDomain(node) &&
          node.contentWindow
        ) {
          overrideConsoleInWindow(node.contentWindow, prefix);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export function overrideConsole(options: ConsoleOverrideOptions = {}) {
  const prefix = options.prefix || "bla bla";

  // Override main window console
  overrideConsoleInWindow(window, prefix);

  // Handle iframes
  handleIframes(prefix);
}
