let testPathIgnorePatterns = ["/node_modules/", "/.next/", "/cypress"];
// Make sure we don't try running tests etc. in temporary Stryker Mutator directories
if (!process.cwd().includes("stryker-tmp")) {
  testPathIgnorePatterns = testPathIgnorePatterns.concat([
    "./.stryker-tmp",
    "./stryker-tmp",
  ]);
}

/** @type {import("@jest/types").Config.InitialOptions } */
const config = {
  roots: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
  transform: {
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
    "^.+\\.(ts|tsx|js|jsx)?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns,
  transformIgnorePatterns: [
    "<rootDir>/node_modules",
    "<rootDir>/.next/",
    "<rootDir>/cypress",
  ],
  verbose: true,
};

export default config;
