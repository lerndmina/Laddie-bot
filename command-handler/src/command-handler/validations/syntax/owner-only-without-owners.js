module.exports = (command) => {
    module.exports = (command) => {
        const { instance, commandName, commandObject } = command
    
        if(commandObject.ownerOnly !== true || instance.botOwners.length){
            return
        }
        throw new Error(`=-=-=-=-=-=-=\nThe command "${commandName}" is set to ownerOnly, but no owners provided.\nPlease provide owners "./bot/src/index.js" or set ownerOnly to false.\n=-=-=-=-=-=-=`)
    }
}