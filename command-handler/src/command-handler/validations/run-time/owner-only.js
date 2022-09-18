module.exports = (command, usage, prefix) => {
    const { instance, commandObject } = command
    const { botOwners } = instance
    const { ownerOnly } = commandObject
    const { user } = usage

    if(ownerOnly === true && !botOwners.includes(user.id)){
        text = `**__ERROR__**\`\`\`The command ${command.commandName} can only be ran by the bot owner.\`\`\``

        return false
    }

    return true
}