const replyHandler = require("../../../util/reply-handler");

module.exports = (command, usage) => {
  const { commandObject } = command
  const { ownerOnly, deferReply } = commandObject
  const { user, message, interaction, botOwners } = usage

    if(ownerOnly === true && !botOwners.includes(user.id)){
        text = `**__ERROR__**\`\`\`The command "${command.commandName}" can only be ran by the bot owner.\`\`\``

        replyHandler(message, interaction, text, deferReply)
        return false
    }

    return true
}