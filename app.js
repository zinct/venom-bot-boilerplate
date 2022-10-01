const EventEmitter = require("events");
const express = require("express");
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");
const { connectWhatsapp } = require("./app/bot");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Express tweak
app.use(express.static("public"));
app.use(express.static("storage"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

// Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

// Setup event emitter
class MyEmitter extends EventEmitter {}

const ev = new MyEmitter();

let client = null;

async function startApp() {
  // Socket Initialization
  io.on("connection", (socket) => {
    socket.emit("statusSession", "initialize");
    socket.emit("message", "Checking your session...");

    if (client) {
      setTimeout(async () => {
        ev.emit("message", "Your whatsapp bot is ready!");
        ev.emit("statusSession", "isLogged");
      }, 2000);
    }

    ev.on("statusSession", (data) => {
      socket.emit("statusSession", data);
    });

    ev.on("qrcode", (qr) => {
      socket.emit("qrcode", qr);
    });

    ev.on("message", (message) => {
      socket.emit("message", message);
    });
  });

  // Connect into whatsapp
  const status = await connectWhatsapp(ev, app);
  client = status;
}

startApp();

process.on("uncaughtException", function (err) {
  console.log("UNcaught", err);
});

module.exports = server;
