import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseConfig = [
  // Enable core rules
  js.configs.recommended,

  // TypeScript rules
  {
    ignores: [
      "./dist"
    ],
  },

  {
    plugins: {
      "@typescript-eslint": ts,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021, // or higher
        sourceType: "module",
        project: [resolve(__dirname, "tsconfig.json")],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...ts.configs["recommended"].rules,
      ...ts.configs["recommended-requiring-type-checking"].rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-empty-function": [
        "error",
        { allow: ["arrowFunctions"] },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },

  // JavaScript rules (if needed, adjust the files glob)
  {
    files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"], // Adjust as needed
    languageOptions: {
      ecmaVersion: 2021, // or higher
      sourceType: "module",
    },
  },

  // Plugin configurations
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      "react-compiler": reactCompiler,
      "import": importPlugin,
    },
    rules: {
      "react-compiler/react-compiler": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "unused-imports/no-unused-imports": "error",
      "prefer-template": "error",
      "no-console": "warn",
      "no-debugger": "error",
      "curly": "error",
      "eqeqeq": ["error", "always"],
    },
  },

  // Prettier configuration
  {
    files: ["**/*"],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          plugins: ["prettier-plugin-sort-json"],
          jsonRecursiveSort: true,
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: false,
          trailingComma: "all",
          bracketSpacing: true,
          arrowParens: "always",
          endOfLine: "lf",
          jsxSingleQuote: false,
          proseWrap: "preserve",
          quoteProps: "consistent",
        },
      ],
    },
  },
];

// Browser and webextensions environment
const cleanGlobals = (globalsObj) =>
  Object.fromEntries(
    Object.entries(globalsObj).map(([key, value]) => [key.trim(), value]),
  );

const browserGlobalsClean = cleanGlobals(globals.browser);

const browserConfig = [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...browserGlobalsClean,
      },
    },
  },
];

const webExtensionsConfig = [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.webextensions,
      },
    },
  },
];

// Node environment config
const nodeConfig = [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],

    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
];

export default [
  ...baseConfig,
  ...nodeConfig,
  ...browserConfig,
  ...webExtensionsConfig,
];
