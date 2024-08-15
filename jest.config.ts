import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  maxWorkers: process.env["JEST_WORKERS"]
    ? parseInt(process.env["JEST_WORKERS"], 10)
    : 10,
};

export default config;
