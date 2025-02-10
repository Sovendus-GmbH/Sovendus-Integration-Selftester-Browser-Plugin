import type { JSX } from "react";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import { maxZIndex, overlayRootId } from "../constants";
import type { IntegrationDetectorWindow } from "../detector/integration-detector";
import { useIntegrationDetector } from "../detector/integration-detector";
import { logger } from "../logger/logger";
import { debugTesterLoader } from "../logger/tester-loader-logger";
import { ErrorBoundary } from "../tester-ui/components/error-boundary";
import type { OverlayState } from "../tester-ui/hooks/use-overlay-state";
import { useOverlayState } from "../tester-ui/hooks/use-overlay-state";
import { DraggableOverlayContainer } from "../tester-ui/overlay/overlay-container";
import type { ExtensionStorage } from "../tester-ui/testing-storage";

export function startIntegrationTester(
  settings: ExtensionStorage,
  getSettings: () => Promise<ExtensionStorage>,
  updateSettings: (newSettings: ExtensionStorage) => Promise<boolean>,
  takeScreenshot: () => Promise<string>,
): void {
  if (!window.testerLoaderDidLoad) {
    window.testerLoaderDidLoad = true;

    reactLoader({
      rootId: overlayRootId,
      RootComponent: Main,
      settings,
      getSettings,
      updateSettings,
      takeScreenshot,
    });
  } else {
    debugTesterLoader(
      "startIntegrationTester",
      "Integration tester is already running",
    );
  }
}

function reactLoader({
  rootId,
  RootComponent,
  settings,
  getSettings,
  updateSettings,
  takeScreenshot,
}: {
  rootId: string;
  RootComponent: ({
    settings,
    getSettings,
    updateSettings,
  }: {
    settings: ExtensionStorage;
    getSettings: () => Promise<ExtensionStorage>;
    updateSettings: (newSettings: ExtensionStorage) => Promise<boolean>;
    takeScreenshot: () => Promise<string>;
  }) => JSX.Element;
  settings: ExtensionStorage;
  getSettings: () => Promise<ExtensionStorage>;
  updateSettings: (newSettings: ExtensionStorage) => Promise<boolean>;
  takeScreenshot: () => Promise<string>;
}): void {
  const testerContainer = document.createElement("div");
  testerContainer.id = rootId;
  testerContainer.style.position = "fixed";
  testerContainer.style.zIndex = maxZIndex.toString();
  document.body.appendChild(testerContainer);

  const root = ReactDOM.createRoot(testerContainer);
  logger("Starting integration tester loader");
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <RootComponent
          settings={settings}
          getSettings={getSettings}
          updateSettings={updateSettings}
          takeScreenshot={takeScreenshot}
        />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}

export function Main({
  settings,
  getSettings,
  updateSettings,
  takeScreenshot,
}: {
  settings: ExtensionStorage;
  getSettings: () => Promise<ExtensionStorage>;
  updateSettings: (newSettings: ExtensionStorage) => Promise<boolean>;
  takeScreenshot: () => Promise<string>;
}): JSX.Element {
  debugTesterLoader("Main", "Rendering Main component", settings);

  const overlayState = useOverlayState(
    settings,
    getSettings,
    updateSettings,
    takeScreenshot,
  )();
  useIntegrationDetector(overlayState);

  useOverlayOnTopMover();

  if (!overlayState.isPromptVisible) {
    debugTesterLoader("Main", "Overlay is currently hidden or blacklisted");
    if (window.sovDetector) {
      window.sovDetector.shouldStop = true;
      delete window.sovDetector;
    }
    return <></>;
  }

  return <ActiveMain overlayState={overlayState} />;
}

function ActiveMain({
  overlayState,
}: {
  overlayState: OverlayState;
}): JSX.Element {
  return <DraggableOverlayContainer overlayState={overlayState} />;
}

function useOverlayOnTopMover(): void {
  useEffect(() => {
    const observer = moveOverlayRootOnTopOfOtherObserver();
    return (): void => {
      observer.disconnect();
    };
  }, []);
}

const moveOverlayRootOnTopOfOtherObserver = (): MutationObserver => {
  moveOverlayRootToOnTopOfOther();
  const observer = new MutationObserver(() => {
    moveOverlayRootToOnTopOfOther();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return observer;
};

const moveOverlayRootToOnTopOfOther = (): void => {
  const integrationTesterRoot = document.getElementById(overlayRootId);
  if (integrationTesterRoot && integrationTesterRoot.parentNode) {
    if (integrationTesterRoot !== integrationTesterRoot.parentNode.lastChild) {
      integrationTesterRoot.parentNode.appendChild(integrationTesterRoot);
    }
  }
};

interface LoaderWindow extends IntegrationDetectorWindow {
  testerLoaderDidLoad?: boolean;
}

declare const window: LoaderWindow;
