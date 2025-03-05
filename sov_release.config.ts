import type { ReleaseConfig } from "sovendus-release-tool";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      updateDeps: true,
      version: "1.0.0",
      release: true,
      releaseOptions: {
        // foldersToScanAndBumpThisPackage: [
        //   { folder: "../../../../" },
        // ],
      },
    },
  ],
};
export default releaseConfig;
