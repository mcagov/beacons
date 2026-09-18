/**
 * Runs `next dev` for local development without Azure. `make serve` uses this when BEACONS_LOCAL_AUTH=true;
 * see "Local development without Azure" in the root README.
 *
 * Settings come from .env.local-auth only. Next.js always reads .env.local too, but it never overrides a variable
 * that is already set, even to "", so every key in the files it would read is blanked out here. Switching modes
 * therefore never mixes Azure settings with local ones.
 */
const { spawn } = require("child_process");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const webappDir = path.join(__dirname, "..");
const localAuthEnvFile = ".env.local-auth";
// The files Next.js loads in development
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

const localAuthEnv = readEnvFile(localAuthEnvFile);
if (!localAuthEnv) {
  console.error(
    `webapp/${localAuthEnvFile} is missing. Copy webapp/${localAuthEnvFile}.example to create it.`,
  );
  process.exit(1);
}

// Real environment variables still take precedence, as they do with `next dev`
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
  `🔓 Local auth is on: the webapp is using ${localAuthEnvFile} and signing in without Azure AD B2C`,
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
