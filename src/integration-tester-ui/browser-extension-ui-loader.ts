import { executeTests, repeatTestsOnSPA } from "./integration-test-overlay.js";

void (async (): Promise<void> => {
  await repeatTestsOnSPA(async () => {
    await executeTests();
  });
})();
