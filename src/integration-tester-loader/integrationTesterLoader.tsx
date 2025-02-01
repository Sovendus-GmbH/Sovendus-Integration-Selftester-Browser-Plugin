"use client";

import type { JSX } from "react";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import { maxZIndex, overlayRootId } from "../constants";
import { useIntegrationDetector } from "../integration-detector/integrationDetector";
import { ErrorBoundary } from "../integration-tester-ui/components/ErrorBoundary";
import { DraggableOverlayContainer } from "../integration-tester-ui/components/overlay-container";
import { useOverlayState } from "../integration-tester-ui/hooks/useOverlayState";
import type { ExtensionStorage } from "../integration-tester-ui/testing-storage";
import { debug, logger } from "../logger/logger";

export function startIntegrationTester(
  settings: ExtensionStorage,
  getSettings: () => Promise<ExtensionStorage>,
  updateSettings: (newSettings: Partial<ExtensionStorage>) => Promise<boolean>,
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
    logger("Integration tester is already running");
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
    updateSettings: (
      newSettings: Partial<ExtensionStorage>,
    ) => Promise<boolean>;
    takeScreenshot: () => Promise<string>;
  }) => JSX.Element;
  settings: ExtensionStorage;
  getSettings: () => Promise<ExtensionStorage>;
  updateSettings: (newSettings: Partial<ExtensionStorage>) => Promise<boolean>;
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
  updateSettings: (newSettings: Partial<ExtensionStorage>) => Promise<boolean>;
  takeScreenshot: () => Promise<string>;
}): JSX.Element {
  debug("Main", "Rendering Main component", settings);

  const overlayState = useOverlayState(
    settings,
    getSettings,
    updateSettings,
    takeScreenshot,
  )();
  useOverlayOnTopMover();

  if (!overlayState.isPromptVisible) {
    debug("Main", "Overlay is currently hidden or blacklisted");
    return <></>;
  }

  useIntegrationDetector(overlayState);

  return (
    <ErrorBoundary>
      <DraggableOverlayContainer overlayState={overlayState} />
    </ErrorBoundary>
  );
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

interface LoaderWindow extends Window {
  testerLoaderDidLoad: boolean;
}

declare const window: LoaderWindow;
