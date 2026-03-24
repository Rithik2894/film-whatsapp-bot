const pool = require("../config/db");

async function saveTextFeedback(phone, message) {
  await pool.query(
    `INSERT INTO feedback_text (phone, message)
     VALUES ($1, $2)`,
    [phone, message]
  );
}

module.exports = { saveTextFeedback };