"use client";

import type { JSX } from "react";
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";

import { overlayRootId } from "../constants";
import type { IntegrationDetectorData } from "../integration-detector/integrationDetector";
import { IntegrationDetectorLoop } from "../integration-detector/integrationDetector";
import { DraggableOverlayContainer } from "../integration-tester-ui/overlay/OverlayContainer/OverlayContainer";

export function startIntegrationTester(blacklist: string[] | undefined): void {
  reactLoader(overlayRootId, Main, blacklist);
}

function reactLoader(
  rootId: string,
  RootComponent: ({
    blacklist,
  }: {
    blacklist: string[] | undefined;
  }) => JSX.Element,
  blacklist?: string[],
): void {
  const alreadyRunning = !!document.getElementById(rootId);
  if (alreadyRunning) {
    return;
  }
  const testerContainer = document.createElement("div");
  testerContainer.id = rootId;
  testerContainer.style.position = "fixed";
  document.body.appendChild(testerContainer);

  const root = ReactDOM.createRoot(testerContainer);
  root.render(
    <React.StrictMode>
      <RootComponent blacklist={blacklist} />
    </React.StrictMode>,
  );
}

export enum IntegrationState {
  NOT_DETECTED = "not-detected",
  DETECTED = "detected",
  LOADED = "loaded",
}

export enum UiState {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export function Main({
  blacklist,
}: {
  blacklist: string[] | undefined;
}): JSX.Element {
  const [uiState, setUiState] = useState<UiState>(UiState.SMALL);
  const [integrationState, setIntegrationState] =
    useState<IntegrationDetectorData>({
      shouldCheck: true,
      setSelfTester: undefined,
      integrationState: IntegrationState.NOT_DETECTED,
      isBlackListedPage: true,
    });
  const integrationDetector: IntegrationDetectorLoop = useMemo(
    () =>
      new IntegrationDetectorLoop(
        blacklist,
        setIntegrationState,
        integrationState,
      ),
    [],
  );

  useEffect(() => {
    if (!integrationState.isBlackListedPage) {
      void integrationDetector.integrationDetectionLoop();
    }
    return;
  }, [integrationState.isBlackListedPage]);

  useEffect(() => {
    const observer = moveOverlayRootOnTopOfOtherObserver();
    return (): void => {
      observer.disconnect();
    };
  }, []);

  return integrationState.isBlackListedPage ? (
    <></>
  ) : (
    <DraggableOverlayContainer
      uiState={uiState}
      setUiState={setUiState}
      integrationState={integrationState}
    />
  );
}

const moveOverlayRootToOnTopOfOther = (): void => {
  const integrationTesterRoot = document.getElementById(overlayRootId);
  if (integrationTesterRoot && integrationTesterRoot.parentNode) {
    if (integrationTesterRoot !== integrationTesterRoot.parentNode.lastChild) {
      integrationTesterRoot.parentNode.appendChild(integrationTesterRoot);
    }
  }
};

const moveOverlayRootOnTopOfOtherObserver = (): MutationObserver => {
  moveOverlayRootToOnTopOfOther();
  const observer = new MutationObserver(() => {
    moveOverlayRootToOnTopOfOther();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
};
