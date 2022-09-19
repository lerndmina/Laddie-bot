const { cooldownTypes } = require("../../../util/Cooldowns")

module.exports = (command) => {
    const {instance, commandName, commandObject } = command

    if(!commandObject.cooldowns){
        return
    }

    let counter = 0
    for(const type of cooldownTypes){
        if(commandObject.cooldowns[type]){
            counter++
        }
    }
  
    if (counter === 0) {
        throw new Error(
            `Command "${commandName}" has a cooldown object but no cooldown types. Please add at least one of the following cooldown types. ${cooldownTypes.join(", ")}`
        )
    }
    if (counter > 1) {
        throw new Error(
            `Command "${commandName}" has multiple cooldown types. Please only use ONLY one of the following cooldown types. ${cooldownTypes.join(", ")}`
        )
    }
  }
  