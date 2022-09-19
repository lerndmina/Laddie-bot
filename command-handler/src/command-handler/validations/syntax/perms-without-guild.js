module.exports = (command) => {
    const {instance, commandName, commandObject } = command
    const { guildOnly, permissions = [] } = commandObject
  
    if (guildOnly !== true && permissions.length) {
      throw new Error(
        `Command "${commandName}" property "permissions" exists but the command is not guildOnly, permissions can only be used in guilds`
      )
    }
  }
  