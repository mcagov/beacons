// See: https://jestjs.io/docs/en/configuration for a full list of configuration options
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  roots: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
  transform: {
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
    "^.+\\.(ts|tsx|js|jsx)?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transformIgnorePatterns: ["/node_modules/", "/.next/"],
  verbose: true,
};

export default config;
