/** @type {import("@jest/types").Config.InitialOptions } */
const config = {
  roots: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
  transform: {
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
    "^.+\\.(ts|tsx|js|jsx)?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/cypress"],
  transformIgnorePatterns: ["<rootDir>/node_modules", "<rootDir>/.next/", "<rootDir>/cypress"],
  verbose: true,
};

export default config;
