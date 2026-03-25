const pool = require("../config/db");

const { saveFeedback } = require("../models/feedbackModel");
const { saveUser, scheduleReminder, stopReminders } = require("../models/userModel");
const { saveTextFeedback } = require("../models/textFeedbackModel");
const { saveMessage } = require("../models/messageModel");

const {
  sendMessage,
  sendButtons,
  sendVideo,
  sendFeedbackButtons,
  sendFilmPoster
} = require("../services/whatsappService");

const express = require("express");
const router = express.Router();

const VERIFY_TOKEN = "film_bot_verify";

router.get("/", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }

});

router.post("/", async (req, res) => {
  
  console.log("🔥 WEBHOOK HIT");
  
  const body = req.body;

  try {

    if (body.object) {

      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages && messages.length > 0) {

        const phone = messages[0].from;
        let text = messages[0].text?.body;

        const buttonReply = messages[0]?.interactive?.button_reply;
        if (buttonReply) {
          text = buttonReply.id;
        }

        const contacts = value?.contacts;
        const name = contacts?.[0]?.profile?.name || "Unknown";

        console.log("User phone:", phone);
        console.log("User name:", name);
        console.log("User message:", text);

        //  PAUSE BOT SWITCH
        if (process.env.PAUSE_BOT === "true") {
          await sendMessage(
            phone,
            "We’re temporarily pausing this experience.\n\nStay tuned 🎬"
          );
          return res.sendStatus(200);
        }

        //  USER LIMIT (ONLY BLOCK NEW USERS)
        const userCheck = await pool.query(
          "SELECT * FROM users WHERE phone = $1",
          [phone]
        );

        const isExistingUser = userCheck.rows.length > 0;

        const userCountResult = await pool.query(
          "SELECT COUNT(*) FROM users"
        );

        const userCount = parseInt(userCountResult.rows[0].count);
        const LIMIT = parseInt(process.env.USER_LIMIT || "1000");

        if (!isExistingUser && userCount >= LIMIT) {

          console.log("User limit reached");

          await sendMessage(
            phone,
            "🙏 Thank you for your interest!\n\nWe’ve reached our current limit for this campaign.\n\nStay tuned for more updates soon 🎬"
          );

          return res.sendStatus(200);
        }

        await saveUser(phone, name);
        await saveMessage(phone, text, "user");

        // FIRST TIME USER
        if (text === "Hi" || text === "hi") {

          await sendVideo(phone);
          await new Promise(resolve => setTimeout(resolve, 1000));
          await sendButtons(phone);

        }

        // USER FEEDBACK BUTTONS
        else if (text === "love" || text === "good" || text === "ok") {

          await saveFeedback(phone, text);

          await sendMessage(
            phone,
            "Thank you so much for your feedback ❤️\n\nYou can also share more thoughts.\n\nType:\nfeedback: your message"
          );

        }

        // TEXT FEEDBACK
        else if (text && text.toLowerCase().includes("feedback")) {

          const feedbackText = text.split(/feedback[:\-]?\s*/i)[1]?.trim();

          if (!feedbackText) {
            await sendMessage(
              phone,
              "Please write your feedback like this:\n\nfeedback: your thoughts 🙂"
            );
            return res.sendStatus(200);
          }

          await saveTextFeedback(phone, feedbackText);

          await sendMessage(
            phone,
            "Thank you for sharing your thoughts! 🙌\n\nThis really helps us improve."
          );

        }

        // REMINDER
        else if (text === "remind") {

          await scheduleReminder(phone);

          await sendMessage(
            phone,
            "We love that curiosity 🙂\n\nWe'll remind you again in a few hours. Hope the excitement stays with you!"
          );

        }

        // WATCHED
        else if (text === "watched") {

          await stopReminders(phone);

          await sendMessage(
            phone,
            "Thank you for watching our film 🎬\n\nWe’d love to know what you think!"
          );

          await sendFeedbackButtons(phone);

        }

        // WATCH LINK
        else if (text === "watch_link") {

          await stopReminders(phone);
          await sendFilmPoster(phone);

        }

        else {
          console.log("Unhandled message:", text);
        }

      }

    }

  } catch (err) {
    console.error("Error parsing webhook:", err);
  }

  res.sendStatus(200);

});

module.exports = router;