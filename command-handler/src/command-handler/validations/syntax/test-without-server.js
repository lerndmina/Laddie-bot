module.exports = (command) => {
    const { instance, commandName, commandObject } = command

    if(commandObject.testOnly !== true || instance.testServers.length){
        return
    }
    // testOnly is true and there are no test servers provided, so we throw an error
    throw new Error(`=-=-=-=-=-=-=\nThe command "${commandName}" is set to testOnly, but no test servers were provided.\nPlease provide test servers "./bot/src/index.js" or set testOnly to false.\n=-=-=-=-=-=-=`)
}