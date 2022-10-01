const chatService = require("../services/chat.service");
const botException = require("../exceptions/botException");
const { PhoneState } = require("../models/index");
const { Keyword } = require("../models/index");

module.exports = async (client, message) => {
  try {
    // Set phone number
    const phone = message.from.replace("@c.us", "");
    message.phone = phone;

    // Phone state handler
    const phoneState = await PhoneState.findOne({ where: { phone } });

    if (phoneState) {
      const stateData = JSON.parse(phoneState.data);

      switch (phoneState.state) {
      }
      return;
    }

    // Handling command
    let command = null;

    switch (message.type) {
      case "chat":
        command = String(message.text.split(" ")[0]).toLowerCase();
        break;
      case "list_response":
        command = message.listResponse.singleSelectReply.selectedRowId;
        break;
    }

    // Get Available command
    const keyword = await Keyword.findOne({
      where: {
        keyword: command,
      },
    });

    // Custom command here...
    switch (keyword?.keyword ?? null) {
      default:
        return chatService.initChat(client, message);
    }
  } catch (err) {
    botException(client, message, err);
  }
};
