const { ApplicationCommandOptionType } = require("discord.js")
module.exports = {
  description: "Adds 2+ numbers together.",

  minArgs: 2, // default 0
  maxArgs: 2,
  correctSyntax: '{PREFIX}{COMMAND_NAME} {ARGS}',
  expectedArgs: "<num1> <num2>",

  // delete: true,

  type: "BOTH", // Valid types = LEGACY, SLASH, BOTH
  testOnly: true, // default false

  callback: ({ args }) => {
    let sum = 0

    for(const arg of args){
      sum += parseInt(arg)
    }

    if(isNaN(sum)){
      return("Please provide numbers only")
      
    }
    return(`The sum is ${sum}`)
    
  },
}
