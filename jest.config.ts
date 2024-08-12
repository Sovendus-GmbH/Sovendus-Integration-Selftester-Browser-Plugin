import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  maxWorkers: 25,
  setupFiles: ["<rootDir>/jest.setup.js"],
};

export default config;
