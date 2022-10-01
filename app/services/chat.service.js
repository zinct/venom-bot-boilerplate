const { commonMessage } = require("../utils/constants");

// -----------------------------------------------------------
// -------------------- DYNAMIC MESSAGE ----------------------
// -----------------------------------------------------------

function sendText(client, data, content) {
  return client.sendText(data.from, content.text);
}

function sendListMenu(client, data, content) {
  return client.sendListMenu(data.from, content.title, content.description, content.description, content.button, content.items);
}

function sendFile(client, data, content) {
  return client.sendFile(data.from, process.env.APP_URL + content.path, content.name, content.text);
}

function sendFileLink(client, data, content) {
  return client.sendFile(data.from, content.link, content.name, " ");
}

function sendCancelMessage(client, message) {
  return client.sendText(message.from, commonMessage.cancel);
}

// -----------------------------------------------------------
// -------------------- PROCESSING DATA ----------------------
// -----------------------------------------------------------

async function initChat(client, message) {
  try {
  } catch (err) {
    throw err;
  }
}

async function sendChat(client, message, content) {
  try {
    switch (content.type) {
      case "text":
        return await sendText(client, message, content.body);
      case "list":
        return await sendListMenu(client, message, content.body);
      case "file":
        return await sendFile(client, message, content.body);
      default:
        return await client.sendText(message.from, "Maaf format belum tersedia!");
    }
  } catch (err) {
    throw err;
  }
}

module.exports = {
  initChat,
  sendChat,
  sendCancelMessage,
};
