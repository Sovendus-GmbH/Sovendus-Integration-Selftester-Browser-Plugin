import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  maxWorkers: process.env["JEST_WORKERS"]
    ? parseInt(process.env["JEST_WORKERS"], 10)
    : 10,
};

export default config;
