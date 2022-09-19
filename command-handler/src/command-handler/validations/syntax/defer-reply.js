module.exports = (command) => {
    const {instance, commandName, commandObject } = command
    const { deferReply } = commandObject
  
    if (deferReply && typeof deferReply !== "boolean" && deferReply !== "ephemeral") {
        // if deferReply exists, isn't a bool and isn't the correct string, throw an error.
      throw new Error(
        `Command "${commandName}" property "deferReply" exists, isn't a bool and isn't "ephemeral"`
      )
    }
  }
  