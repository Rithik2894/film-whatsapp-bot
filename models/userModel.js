const pool = require("../config/db");

async function saveUser(phone, name) {
  try {
    await pool.query(
      `INSERT INTO users (phone, name, status, first_contact)
       VALUES ($1, $2, 'pending', NOW())
       ON CONFLICT (phone) DO NOTHING`,
      [phone, name]
    );

    console.log("User saved:", phone, name);
  } catch (err) {
    console.error("DB error:", err);
  }
}

async function scheduleReminder(phone) {
  await pool.query(
    `UPDATE users
     SET next_reminder = NOW() + INTERVAL '6 hours',
         reminder_count = 1,
         last_interaction = NOW()
     WHERE phone = $1`,
    [phone]
  );
}

async function stopReminders(phone) {
  await pool.query(
    `UPDATE users
     SET next_reminder = NULL
     WHERE phone = $1`,
    [phone]
  );
}

module.exports = {
  saveUser,
  scheduleReminder,
  stopReminders
};