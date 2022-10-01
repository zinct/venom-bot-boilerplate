const BotError = require("../utils/botError");
const HttpError = require("../utils/httpError");

module.exports = async function (client, message, err) {
  console.log("err", err);
  if (client !== null && message !== null) {
    if (err instanceof BotError) return await client.sendText(message.from, err.message);
    else if (err instanceof HttpError) {
      const errMessage = `Error Name: ${err.name}\nMessage: ${err.message}\n\nResponse: ${JSON.stringify(err.response)}`;
      await client.sendText(message.from, errMessage);
    } else {
      const errMessage = `Error Name: ${err.name}\nMessage: ${err.message}\n\nStack: ${err.stack}`;
      await client.sendText(message.from, errMessage);
    }
  } else {
    console.log("SERVER ERR", err);
  }
};
