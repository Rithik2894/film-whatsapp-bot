const pool = require("../config/db");

async function saveFeedback(phone, rating) {
  try {
    await pool.query(
      `INSERT INTO feedback (phone, rating)
       VALUES ($1, $2)`,
      [phone, rating]
    );

    console.log("Feedback saved:", phone, rating);

  } catch (err) {
    console.error("Feedback DB error:", err);
  }
}

module.exports = { saveFeedback };