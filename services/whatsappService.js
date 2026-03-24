const axios = require("axios");
require("dotenv").config();

async function sendMessage(to, text) {

  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  try {

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: to,
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Message sent to", to);
    await saveMessage(to, text, "bot");

  } catch (err) {
    console.error("Send message error:", err.response?.data || err.message);
  }

}
async function sendButtons(to) {

  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  try {

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "interactive",
        interactive: {
          type: "button",

          body: {
            text: "Did you watch our film?"
          },

          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "watched",
                  title: "I watched the film"
                }
              },
              {
                type: "reply",
                reply: {
                  id: "watch_link",
                  title: "Watch the film here"
                }
              },
              {
                type: "reply",
                reply: {
                  id: "remind",
                  title: "Remind me later"
                }
              }
            ]
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Buttons sent");
    await saveMessage(to, "sent main buttons", "bot");
  } catch (err) {
    console.error("Button message error:", err.response?.data || err.message);
  }
}

async function sendVideo(to) {

  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  try {

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "video",
        video: {
         link: "https://res.cloudinary.com/dgiekpqc0/video/upload/v1773857981/final_reel_wiah_for_cloud_sb8a1z.mp4",
         caption: "🎬 Thanks for checking our film!\n\nHere's short clip from the film."
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Video sent");
    await saveMessage(to, "sent teaser video", "bot");
  } catch (err) {
    console.error(
      "Video error:",
      JSON.stringify(err.response?.data || err.message, null, 2)
      
    );
    throw err;
  }
}

async function sendFeedbackButtons(to) {

  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  try {

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: "How was the film?"
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "love",
                  title: "⭐ Loved it"
                }
              },
              {
                type: "reply",
                reply: {
                  id: "good",
                  title: "🙂 Good"
                }
              },
              {
                type: "reply",
                reply: {
                  id: "ok",
                  title: "😐 Okay"
                }
              }
            ]
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Feedback buttons sent");
    await saveMessage(to, "sent feedback buttons", "bot");
  } catch (err) {
    console.error("Feedback error:", err.response?.data || err.message);
  }
}

async function sendFilmPoster(to) {

  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  try {

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "image",
        image: {
          link: "https://res.cloudinary.com/dgiekpqc0/image/upload/v1773856894/AI_YT_copy_q6ehsp.jpg",
          caption: "🎬 Watch the full film here:\n\nhttps://www.youtube.com/watch?v=ojUztMd80rE\n\n Please let us know what you think😁"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Poster sent");
    await saveMessage(to, "sent film poster + link", "bot");
  } catch (err) {
    console.error("Poster error:", err.response?.data || err.message);
  }
}

module.exports = {
  sendMessage,
  sendButtons,
  sendVideo,
  sendFeedbackButtons,
  sendFilmPoster
};