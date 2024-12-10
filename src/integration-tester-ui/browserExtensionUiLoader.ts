import { executeTests, repeatTestsOnSPA } from "./integrationTestOverlay.js";

void (async (): Promise<void> => {
  await repeatTestsOnSPA(async () => {
    await executeTests();
  });
})();
