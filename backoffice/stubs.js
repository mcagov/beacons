const express = require("express");

const app = express();

const PORT = 3005;

app.get("/backoffice/tenant-id", (req, res) => {
  res.send("513fb495-9a90-425b-a49a-bc6ebe2a429e");
});

app.get("/backoffice/client-id", (req, res) => {
  res.send("5cdcbb41-958a-43b6-baa1-bbafd80b4f70");
});

console.log("🍽 Starting the Backoffice runtime env var stub server...");

app.listen(PORT);

console.log(`🚀 Backoffice stub server listening on port ${PORT}!`);
