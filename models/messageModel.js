const pool = require("../config/db");

async function saveMessage(phone, message, direction) {
  try {
    await pool.query(
      `INSERT INTO messages (phone, message, direction)
       VALUES ($1, $2, $3)`,
      [phone, message, direction]
    );
  } catch (err) {
    console.error("Message DB error:", err);
  }
}

module.exports = { saveMessage };