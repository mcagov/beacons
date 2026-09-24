const express = require("express");

const app = express();

const PORT = 3005;

app.get("/backoffice/tenant-id", (req, res) => {
  res.send("513fb495-9a90-425b-a49a-bc6ebe2a429e");
});

app.get("/backoffice/client-id", (req, res) => {
  res.send("5cdcbb41-958a-43b6-baa1-bbafd80b4f70");
});

app.get("/backoffice/auth-mode", (req, res) => {
  if (process.env.BEACONS_LOCAL_AUTH !== "true") {
    return res.json({ mode: "azure" });
  }

  const roles = (
    process.env.LOCAL_AUTH_ROLES ||
    "UPDATE_RECORDS,ADD_BEACON_NOTES,DATA_EXPORTER,DELETE_BEACONS,ADMIN_EXPORT"
  )
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);

  res.json({
    mode: "local",
    username: process.env.LOCAL_AUTH_EMAIL || "dev@beacons.local",
    displayName: process.env.LOCAL_AUTH_NAME || "Dev User",
    roles,
  });
});

app.get("/backoffice/log", (req, res) => {
  res.send();
});

console.log("🍽 Starting the Backoffice runtime env var stub server...");

app.listen(PORT);

console.log(`🚀 Backoffice stub server listening on port ${PORT}!`);

if (process.env.BEACONS_LOCAL_AUTH === "true") {
  console.log(
    `Local auth is on: the Backoffice will sign in as ${
      process.env.LOCAL_AUTH_EMAIL || "dev@beacons.local"
    } without Azure AD`,
  );
}
