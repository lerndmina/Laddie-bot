module.exports = (command, usage, prefix) => {
    const { instance, commandObject } = command
    const { guild } = usage

    if(commandObject.testOnly !== true){
        return true // the command can run
    }

    // the command can run if in the correct guild
    return instance.testServers.includes(guild?.id)
}