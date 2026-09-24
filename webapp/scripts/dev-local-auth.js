const { spawn } = require("child_process");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const webappDir = path.join(__dirname, "..");
const localAuthEnvFiles = [".env.local-auth", ".env.local-auth.example"];
const nextEnvFiles = [
  ".env.development.local",
  ".env.local",
  ".env.development",
  ".env",
];

const readEnvFile = (file) => {
  const filePath = path.join(webappDir, file);
  return fs.existsSync(filePath)
    ? dotenv.parse(fs.readFileSync(filePath))
    : null;
};

if (process.env.BEACONS_LOCAL_AUTH !== "true") {
  console.error(
    "BEACONS_LOCAL_AUTH is not 'true'. Set it in the root .envrc, or use `npm run dev` to sign in with Azure.",
  );
  process.exit(1);
}

const localAuthEnvFile = localAuthEnvFiles.find((file) => readEnvFile(file));
if (!localAuthEnvFile) {
  console.error(`None of ${localAuthEnvFiles.join(", ")} exist in webapp/.`);
  process.exit(1);
}
const localAuthEnv = readEnvFile(localAuthEnvFile);

const env = { ...process.env };
for (const [key, value] of Object.entries(localAuthEnv)) {
  if (env[key] === undefined) env[key] = value;
}
for (const file of nextEnvFiles) {
  for (const key of Object.keys(readEnvFile(file) || {})) {
    if (env[key] === undefined) env[key] = "";
  }
}

console.log(
  `Local auth is on: the webapp is using ${localAuthEnvFile} and signing in without Azure AD B2C`,
);

const next = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "dev", "--turbopack"],
  { cwd: webappDir, env, stdio: "inherit" },
);
next.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
