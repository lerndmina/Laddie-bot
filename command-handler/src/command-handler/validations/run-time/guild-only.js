module.exports = (command, usage) => {
    const { guildOnly } = command.commandObject
    const { guild, message, interaction } = usage

    if(guildOnly === true && !guild){
        const text = `**__ERROR__**\`\`\`This command ${command.commandName} can only be ran inside a guild/server\`\`\``
        
        if(message){
            message.reply(text)
          } else if (interaction){
            interaction.reply(text)
          }

        return false
    }
    
    return true
}