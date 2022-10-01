const venom = require("venom-bot");
const { saveToken, readToken } = require("./services/token.service");
const { logError, log, logMessage } = require("./services/log.service");
const venomConfig = require("../config/venom.config.json");
const chatController = require("./controllers/chat.controller");
const botException = require("./exceptions/botException");

const messageTypes = ["broadcast", "ptt", "video", "sticker", "document", "vcard", "audio"];

exports.connectWhatsapp = async function (socket, server) {
  let usingDB = true;
  // const browserSessionToken = await readToken();

  // if (Object.keys(browserSessionToken).length === 0) usingDB = false;

  try {
    const client = await venom.create(
      process.env.VENOM_SESSION_NAME,
      // Catch QRCode
      (base64Qrimg, asciiQR, attempts, urlCode) => {
        if (base64Qrimg) {
          socket.emit("qrcode", base64Qrimg);
          socket.emit("message", `QRcode recieved. scan now! ${attempts > 0 ? "attempts : " + attempts : ""}`);
        }
      },
      // Catch Status Session
      (statusSession, session) => {
        socket.emit("statusSession", statusSession);
        socket.emit("message", "Your session name is " + session);
      },
      venomConfig
      // browserSessionToken
    );

    socket.emit("message", "Your whatsapp bot is ready!");

    // Setup Bot API
    server.post("/message", async (req, res) => {
      if (!req.body?.phone || !req.body?.message) res.send("Dibutuhkan parameter message & phone");

      let phone = req.body.phone;
      phone = phone[0] == "0" ? phone.replace(phone[0], "62") : phone;

      await client.sendText(`${phone}@c.us`, req.body.message);
      res.send("Message successfully sended");
    });

    server.post("/file", async (req, res) => {
      try {
        if (!req.body?.phone || !req.body?.url) res.send("Dibutuhkan parameter message & phone");

        let phone = req.body.phone;
        phone = phone[0] == "0" ? phone.replace(phone[0], "62") : phone;

        await client.sendFile(`${phone}@c.us`, req.body.url, "file.pdf", " ");
        res.send("Message successfully sended");
      } catch (err) {
        res.send(err.message);
      }
    });

    // Run Bot
    runBot(client, usingDB);

    return client;
  } catch (err) {
    logError(err);
  }
};

let currentClient = null;
let currentMessage = null;

async function runBot(client, usingDB) {
  // Set current client
  currentClient = client;
  // Check if login using database token
  // if (!usingDB) saveToken(client);

  client.onMessage(async (message) => {
    // Set current message
    currentMessage = message;
    // Check if message contains only text
    if ((["chat", "list_response", "location"].includes(message.type) == true || message.isMedia) && message.isGroupMsg === false && message.hasOwnProperty("body")) {
      // Controller
      chatController(client, message);
      // Log message
      logMessage(message);
    }
  });
}

// Global Exception
process.on("unhandledRejection", function (err) {
  botException(currentClient, currentMessage, err);
});
