import type { SovSelfTesterWindow } from "../integration-tester/integrationTester";
import { startIntegrationTester } from "./integrationTesterLoader";

// TODO add blacklist storage

window.transmitTestResult = false;
void startIntegrationTester([]);

declare let window: SovSelfTesterWindow;
