const { PermissionFlagsBits } = require("discord.js")

const keys = Object.keys(PermissionFlagsBits)

module.exports = (command, usage) => {
    const { permissions = [], deferReply } = command.commandObject
    const { member, message, interaction } = usage

    if(member && permissions.length){
        const missingPermissions = []
        for(const permission of permissions){
            if(!member.permissions.has(permission)){
                const permissionName = keys.find(key => PermissionFlagsBits[key] === permission)
                missingPermissions.push(permissionName)
            }
        }
        if(missingPermissions.length){
            const text = `**__No Permissions__**\`\`\`You are missing the following permissions required for this command\n\n${missingPermissions.join("\n")} \`\`\``

            replyHandler(message, interaction, text, deferReply)

            return false
        }
    }
    return true
}