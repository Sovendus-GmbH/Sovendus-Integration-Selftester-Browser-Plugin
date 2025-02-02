import react from "@vitejs/plugin-react";
import type { PluginOption } from "vite";
import { build } from "vite";
import envCompatible from "vite-plugin-env-compatible";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteStaticCopy } from "vite-plugin-static-copy";

const entries = [];

const plugins: PluginOption[] = [
  react(),
  envCompatible(),
  // string({
  //   include: "**/*.css",
  // }),
  viteStaticCopy({
    targets: [
      {
        src: "src/extension-pop-up/extensionPopUp.html",
        dest: "chrome",
        rename: "extensionPopUp.html",
      },
      {
        src: "src/sovendus.png",
        dest: "chrome",
      },
    ],
  }),
  createHtmlPlugin({
    minify: true,
    inject: {},
  }),
];

async function buildEntries(): Promise<void> {
  for (const entry of entries) {
    await build({
      plugins,
      build: {
        target: "esnext",
        outDir: "build",
        emptyOutDir: false,
        cssMinify: false,
        cssCodeSplit: false,
        rollupOptions: {
          input: entry.input,
          output: {
            entryFileNames: `${entry.name}`,
          },
          preserveEntrySignatures: "strict",
        },
      },
    });
  }
}

void buildEntries();
