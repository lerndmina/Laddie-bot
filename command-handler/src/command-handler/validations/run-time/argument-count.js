const replyHandler = require("../../../util/reply-handler");

module.exports = (command, usage, prefix) => {
  const {
    minArgs = 0,
    maxArgs = -1,
    correctSyntax,
    commandName,
    expectedArgs = "",
  } = command.commandObject;
  const { length } = usage.args;

  if (length < minArgs || (length > maxArgs && maxArgs !== -1)) {
    const text = 
    `**Incorrect syntax!**\`\`\`${correctSyntax
      .replace("{PREFIX}", prefix)
      .replace("{COMMAND_NAME}", command.commandName)
      .replace("{ARGS}", expectedArgs)}\`\`\``

      const {message, interaction} = usage

      replyHandler(message, interaction, text, command.commandObject.deferReply)
    return false;
  }

  return true;
};
