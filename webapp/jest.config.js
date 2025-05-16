// See: https://jestjs.io/docs/en/configuration for a full list of configuration options

const config = {
  roots: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
  transform: {
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
    "^.+\\.(ts|tsx|js|jsx)?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: ["**/test/**/*.test.ts"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/cypress",
    // "/.stryker-tmp",
    // "/stryker-tmp",
  ],
  transformIgnorePatterns: ["/node_modules/", "/.next/", "/cypress"],
  verbose: true,
};

export default config;
