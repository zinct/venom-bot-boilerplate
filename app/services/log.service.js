const { LogMessage } = require("../models/index");

function log(value) {
  console.log("LOG :", value);
}

async function logMessage(message) {
  await LogMessage.create({
    from: message.from,
    type: message.type,
    text: message.text,
    body: JSON.stringify(message),
  }).catch(logError);
}

function logError(value) {
  console.error("ERR :", value);
}

function logHttp(res) {
  console.log("HTTP : ", res);
}

module.exports = {
  log,
  logMessage,
  logError,
  logHttp,
};
