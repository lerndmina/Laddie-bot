const { ApplicationCommandOptionType } = require("discord.js");
require('dotenv/config')

module.exports = {
  description: "Get various information",

  type: "SLASH",
  testOnly: true,
  correctSyntax: "{PREFIX}{COMMAND_NAME} {ARGS}",

  callback: ({ args, instance }) => {
    return `${process.env.INVITE_URL}`
  }
};
