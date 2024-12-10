import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import envCompatible from "vite-plugin-env-compatible";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(async () => {
  const { viteStaticCopy } = await import("vite-plugin-static-copy");

  return {
    plugins: [
      react(),
      envCompatible(),
      viteStaticCopy({
        targets: [
          {
            src: "src/extension-pop-up/extensionPopUp.html",
            dest: "",
            rename: "extensionPopUp.html",
          },
          {
            src: "src/sovendus.png",
            dest: "",
          },
        ],
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          //   injectData: {
          //     // Add any data you want to inject into the HTML file here
          //   },
        },
      }),
    ],
    build: {
      outDir: "build/chrome",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          extensionPopUp: path.resolve(
            __dirname,
            "src/extension-pop-up/extensionPopUp.ts",
          ),
          browserExtensionUiScriptLoader: path.resolve(
            __dirname,
            "src/integration-tester-ui/browserExtensionUiScriptLoader.ts",
          ),
          browserExtensionUiLoader: path.resolve(
            __dirname,
            "src/integration-tester-ui/browserExtensionUiLoader.ts",
          ),
          integrationTestOverlay: path.resolve(
            __dirname,
            "src/integration-tester-ui/integrationTestOverlay.ts",
          ),
          integrationTester: path.resolve(
            __dirname,
            "src/integration-tester/integrationTester.ts",
          ),
        },
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
          manualChunks: undefined, // Ensure no additional chunking
        },
      },
      cssCodeSplit: true,
    },
    resolve: {
      alias: {
        "@src": path.resolve(__dirname, "src"),
      },
    },
    server: {
      open: true,
      port: 4000,
    },
  };
});
