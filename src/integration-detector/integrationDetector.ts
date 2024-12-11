import type { Dispatch, SetStateAction } from "react";

import { defaultBlacklist } from "../constants";
import type { SovSelfTesterWindow } from "../integration-tester/integrationTester";
import SelfTester from "../integration-tester/integrationTester";
import { IntegrationState } from "../integration-tester-loader/integrationTesterLoader";

export interface IntegrationDetectorData {
  shouldCheck: boolean;
  setSelfTester: SelfTester | undefined;
  integrationState: IntegrationState;
  isBlackListedPage: boolean;
}

export class IntegrationDetectorLoop {
  private state: IntegrationDetectorData;
  private setState: Dispatch<SetStateAction<IntegrationDetectorData>>;

  constructor(
    blacklist: string[] | undefined,
    setState: Dispatch<SetStateAction<IntegrationDetectorData>>,
    state: IntegrationDetectorData,
  ) {
    this.state = state;
    this.setState = setState;
    this.setState({
      shouldCheck: true,
      setSelfTester: undefined,
      integrationState: IntegrationState.NOT_DETECTED,
      isBlackListedPage: isBlacklistedPage(blacklist),
    });
  }

  async integrationDetectionLoop(): Promise<void> {
    await this.repeatUntilStopped(async () => {
      await this.integrationDetection();
    });
  }

  async integrationDetection(): Promise<void> {
    const sovSelfTester = new SelfTester();
    window.sovSelfTester = sovSelfTester;
    await sovSelfTester.waitForSovendusIntegrationDetected();
    this.setState((prevState) => ({
      ...prevState,
      integrationState: IntegrationState.DETECTED,
    }));
    await sovSelfTester.waitForSovendusIntegrationToBeLoaded();
    sovSelfTester.selfTestIntegration();
    this.setState((prevState) => ({
      ...prevState,
      integrationState: IntegrationState.LOADED,
      sovSelfTester,
    }));
  }

  async repeatUntilStopped(tests: () => Promise<void>): Promise<void> {
    let visitedPath = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.state.shouldCheck) {
        if (visitedPath !== window.location.pathname) {
          visitedPath = window.location.pathname;
          await tests();
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

function isBlacklistedPage(blacklist: string[] | undefined): boolean {
  const _blacklist: string[] = [...defaultBlacklist, ...(blacklist || [])];
  return _blacklist.includes(window.location.host);
}

declare let window: SovSelfTesterWindow;
