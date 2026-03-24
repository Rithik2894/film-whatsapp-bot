const cron = require("node-cron");
const pool = require("../config/db");
const { sendButtons } = require("./whatsappService");

cron.schedule("*/1 * * * *", async () => {

  console.log("Checking reminders...");

  const result = await pool.query(
    `SELECT * FROM users
     WHERE next_reminder IS NOT NULL
     AND next_reminder <= NOW()`
  );

  for (let user of result.rows) {

    if (user.reminder_count >= 8) {
      // 48 hours (6h * 8)
      await pool.query(
        `UPDATE users SET next_reminder = NULL WHERE phone = $1`,
        [user.phone]
      );
      continue;
    }

    await sendMessage(
  user.phone,
  "Hey 🙂 just a reminder!\n\nDid you get a chance to watch our film?"
);

await new Promise(resolve => setTimeout(resolve, 500));

await sendButtons(user.phone);

    await pool.query(
      `UPDATE users
       SET reminder_count = reminder_count + 1,
           next_reminder = NOW() + INTERVAL '6 hours'
       WHERE phone = $1`,
      [user.phone]
    );

    console.log("Reminder sent to", user.phone);
  }

});