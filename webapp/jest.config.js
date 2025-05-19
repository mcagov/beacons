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
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  preset: "ts-jest/presets/js-with-ts",
  roots: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
  testPathIgnorePatterns,
  transform: {
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
    "\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules(?!(@azure/msal-node))",
    "<rootDir>/node_modules(?!(@azure/msal-node/node_modules/uuid))",
    "<rootDir>/.next/",
    "<rootDir>/cypress",
  ],
  verbose: true,
};

module.exports = config;
