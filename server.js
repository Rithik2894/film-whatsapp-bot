const express = require("express");
const pool = require("./config/db");
const webhookRoutes = require("./routes/webhook");
require("./services/reminderService");
const app = express();

app.use(express.json());

app.use("/webhook", webhookRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send("Server + Database working. Time: " + result.rows[0].now);
  } catch (err) {
    res.send("Database connection failed");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});