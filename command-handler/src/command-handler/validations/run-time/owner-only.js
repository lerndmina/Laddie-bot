module.exports = (command, usage, prefix) => {
    const { instance, commandObject } = command
    const { botOwners } = instance
    const { ownerOnly } = commandObject
    const { user, message } = usage

    if(ownerOnly === true && !botOwners.includes(user.id)){
        text = `**__ERROR__**\`\`\`The command ${command.commandName} can only be ran by the bot owner.\`\`\``

        if(message){
            message.reply(text)
          } else if (interaction){
            interaction.reply(text)
          }
        return false
    }

    return true
}