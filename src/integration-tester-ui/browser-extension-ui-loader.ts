import { executeTests, repeatTestsOnSPA } from "./integration-test-overlay";

void (async (): Promise<void> => {
  await repeatTestsOnSPA(async () => {
    await executeTests();
  });
})();
