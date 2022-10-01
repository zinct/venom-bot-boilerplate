const venom = require("venom-bot");
const { LogMessage } = require("../models/index");
const chatRoute = require("../../routes/chat.route");

const startVenom = (socket) => {
  venom
    .create(
      "sessionName",
      // Catch QRCode
      (base64Qrimg, asciiQR, attempts, urlCode) => {
        socket.emit("qrcode", base64Qrimg);
      },
      // Catch Status Session
      (statusSession, session) => {
        socket.emit("statusSession", statusSession);
        socket.emit("statusSession", session);
      },
      {
        disableWelcome: true,
      }
    )
    .then((client) => start(client, socket))
    .catch((err) => console.log("Something went wrong! ", err));
};

const start = (client, socket) => {
  client.onMessage(async (data) => {
    // Logging Message
    try {
      await LogMessage.create({
        from: data.from,
        type: data.type,
        text: data.text,
        body: JSON.stringify(data),
      });

      console.log("text", data.text);
    } catch (err) {
      console.error("ERR :", err);
    }

    // Routing
    chatRoute(client, data, socket);
  });
};

exports.startVenom = startVenom;
