/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("node:fs");
const path = require("node:path");
const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}/${file.name}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(`${path.join(dirPath, "/", file.name)}`);
    }
  });
  return arrayOfFiles;
};

const specs = getAllFiles("webapp/cypress/integration");
process.stdout.write(`${JSON.stringify(specs)}\n`);
