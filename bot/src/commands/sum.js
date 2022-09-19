const { ApplicationCommandOptionType } = require("discord.js")
module.exports = {
  description: "Adds 2+ numbers together.",

  minArgs: 2, // default 0
  maxArgs: 2,
  correctSyntax: '{PREFIX}{COMMAND_NAME} {ARGS}',
  expectedArgs: "<num1> <num2>",

  // delete: true,

  type: "SLASH", // Valid types = LEGACY, SLASH, BOTH
  testOnly: true, // default false

  reply: false, // replies will @ mention on Discord

  // guildOnly: true,
  // ownerOnly: true,

  deferReply: "ephemeral", // true, false "ephemeral"

  aliases: ["add", "plus"],

  // init: async (client, instance) => { // run once
  //   console.log("Hello world from add command")
  // },

  callback: async ({ args }) => { // run on execute
    let sum = 0

    for(const arg of args){
      sum += parseInt(arg)
    }

    if(isNaN(sum)){
      return("Please provide numbers only")
      
    }

    await new Promise(resolve => setTimeout(resolve, 3000)) // Quick timeout to test defer

    return(`The sum is ${sum}`)
    
  },
}
