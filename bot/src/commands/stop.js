const { ApplicationCommandOptionType, InteractionCollector } = require("discord.js");
require('dotenv/config')

module.exports = {
  description: "Stops the bot",

  type: "SLASH",
  testOnly: true,
  correctSyntax: "{PREFIX}{COMMAND_NAME} {ARGS}",

  deferReply: "ephemeral",

  options: [
    {
      name: "confirm",
      description: "Are you sure you want to stop the bot?",
      type: ApplicationCommandOptionType.Boolean,
    },
  ],

  callback: async ({ args, member, interaction }) => {
    if(member.id === process.env.OWNER_ID){
      if(args[0] === true || args[0].toLowerCase() === "true"){
        interaction.editReply(`The bot is now stopping, Very sad. Please wait a little while for the bot to start back up.`)
        await new Promise(resolve => setTimeout(resolve, 750))
        interaction.client.destroy()
        process.exit()
      } else {
        interaction.editReply("Please confirm stopping the bot.")
      }
    } else {
      interaction.editReply("You are not the bot owner. You cannot stop the bot.")
    }
  }
}
