const replyHandler = require("../../../util/reply-handler")

module.exports = (command, usage) => {
    const { guildOnly, deferReply } = command.commandObject
    const { guild, message, interaction } = usage

    if(guildOnly === true && !guild){
        const text = `**__ERROR__**\`\`\`This command ${command.commandName} can only be ran inside a guild/server\`\`\``
        
        replyHandler(message, interaction, text, deferReply)

        return false
    }
    
    return true
}