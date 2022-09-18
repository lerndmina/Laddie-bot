module.exports = (command, usage, prefix) => {
    const { minArgs = 0, maxArgs = -1 } = command.commandObject
    const { length } = usage.args

    if (length < minArgs || (length > maxArgs && maxArgs !== -1)) {
        usage.message.reply(`**Incorrect syntax!**
        \`\`\`${correctSyntax.replace('{PREFIX}', prefix).replace('{COMMAND_NAME}', command.commandName)}\`\`\``)
        return false;
    }

    return true
}