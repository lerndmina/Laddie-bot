const replyHandler = require("../../../util/reply-handler")
const CommandHandler = require("../../CommandHandler")

module.exports = (command, usage, prefix) => {
    const { instance, commandObject } = command
    const { guild, message, interaction} = usage

    // console.log(`Guild ID: ${guild?.id} | Test Servers: ${instance.testServers} | Guild: ${guild}`)


    if(commandObject.testOnly !== true){
        return true // the command can run
    }

    // the command can run if in the correct guild
    if(!instance.testServers.includes(guild?.id)){
        text = `**__ERROR__**\`\`\`The command ${command.commandName} is currently being tested and as such can only be ran in the testing guild/server\`\`\``

        replyHandler(message, interaction, text, commandObject.deferReply)
        return false
    }
    return true
}