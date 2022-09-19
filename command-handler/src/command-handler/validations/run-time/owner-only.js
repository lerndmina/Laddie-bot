module.exports = (command, usage) => {
  const { instance, commandObject } = command
  const { botOwners } = instance
  const { ownerOnly, deferReply } = commandObject
  const { user, message, interaction } = usage

    if(ownerOnly === true && !botOwners.includes(user.id)){
        text = `**__ERROR__**\`\`\`The command ${command.commandName} can only be ran by the bot owner.\`\`\``

        replyHandler(message, interaction, text, deferReply)
        return false
    }

    return true
}