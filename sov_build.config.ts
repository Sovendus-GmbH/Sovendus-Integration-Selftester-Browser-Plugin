import type { BuildConfig } from "sovendus-builder";

const buildConfig: BuildConfig = {
  foldersToClean: ["../dist/chrome", "../dist/firefox"],
  filesToCompile: [
    {
      input:
        "src/browser-extension-specific/extension-pop-up/extension-pop-up.ts",
      output: "../dist/chrome/extension-pop-up.js",
      options: {
        type: "react",
      },
    },
    {
      input: "src/browser-extension-specific/service-worker.ts",
      output: "../dist/chrome/service-worker.js",
      options: {
        type: "vanilla",
      },
    },
    {
      input: "src/browser-extension-specific/content-script.ts",
      output: "../dist/chrome/content-script.js",
      options: {
        type: "vanilla",
      },
    },
    {
      input: "src/browser-extension-specific/browser-extension-loader.ts",
      output: "../dist/chrome/browser-extension-loader.js",
      options: {
        type: "react",
      },
    },
  ],
  filesOrFoldersToCopy: [
    {
      input:
        "src/browser-extension-specific/extension-pop-up/extension-pop-up.html",
      output: "../dist/chrome/extension-pop-up.html",
    },
    {
      input: "src/browser-extension-specific/sovendus.png",
      output: "../dist/chrome/sovendus.png",
    },
    {
      input: "../dist/chrome",
      output: "../dist/firefox",
    },
    {
      input: "src/browser-extension-specific/chrome/manifest.json",
      output: "../dist/chrome/manifest.json",
    },
    {
      input: "src/browser-extension-specific/firefox/manifest.json",
      output: "../dist/firefox/manifest.json",
    },
  ],
};

export default buildConfig;
