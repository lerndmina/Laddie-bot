const { ApplicationCommandOptionType } = require("discord.js")
module.exports = {
  description: "Adds 2+ numbers together.",

  minArgs: 2, // default 0
  maxArgs: 2,
  correctSyntax: '{PREFIX}{COMMAND_NAME} {ARGS}',
  expectedArgs: "<num1> <num2>",

  // delete: true,

  type: "LEGACY", // Valid types = LEGACY, SLASH, BOTH
  testOnly: true, // default false

  reply: true, // replies will @ mention on Discord

  cooldowns:{
    // Pick one of
    // perUser, perUserPerGuild, perGuild, global
    // s m h d
    perUserPerGuild: "30 d",

    errorMessage: "Please wait {TIME} before trying that again.",
  },

  // guildOnly: true,
  // ownerOnly: true,

  deferReply: false, // true, false "ephemeral"

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

    if(this.deferReply === "ephemeral" || this.deferReply === true){
      // Quick timeout to test defer
      await new Promise(resolve => setTimeout(resolve, 750))
    }

    return(`The sum is ${sum}`)
    
  },
}
