"use client";

import type { JSX } from "react";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

import { overlayRootId } from "../constants";
import type { IntegrationDetectorData } from "../integration-detector/integrationDetector";
import {
  defaultIntegrationState,
  IntegrationDetectorLoop,
  isBlacklistedPage,
} from "../integration-detector/integrationDetector";
import { DraggableOverlayContainer } from "../integration-tester-ui/OverlayContainer/OverlayContainer";
import { logger } from "../logger/logger";

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
  logger("Starting integration tester");
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

export interface UiState {
  overlaySize: OverlaySize;
  integrationType: IntegrationType | undefined;
}

export enum OverlaySize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export enum IntegrationType {
  CB_VN = "Checkout Benefits & Voucher Network",
  CHECKOUT_PRODUCTS = "Checkout Products",
  OPTIMIZE = "Optimize",
}

export function Main({
  blacklist,
}: {
  blacklist: string[] | undefined;
}): JSX.Element {
  const [uiState, setUiState] = useState<UiState>({
    overlaySize: OverlaySize.SMALL,
    integrationType: undefined,
  });

  const { integrationState } = useIntegrationTester(blacklist);
  useOverlayOnTopMover();
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

function useIntegrationTester(blacklist: string[] | undefined): {
  integrationState: IntegrationDetectorData;
} {
  const [integrationState, setIntegrationState] =
    useState<IntegrationDetectorData>({
      shouldCheck: true,
      selfTester: undefined,
      integrationState: defaultIntegrationState,
      isBlackListedPage: isBlacklistedPage(blacklist),
    });
  const integrationStateRef = useRef(integrationState);

  useEffect(() => {
    integrationStateRef.current = integrationState;
  }, [integrationState]);
  window.sovIntegrationDetector =
    window.sovIntegrationDetector ||
    new IntegrationDetectorLoop(
      setIntegrationState,
      integrationStateRef.current,
    );

  return { integrationState };
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

interface SovWindow extends Window {
  sovIntegrationDetector?: IntegrationDetectorLoop;
}
declare const window: SovWindow;
