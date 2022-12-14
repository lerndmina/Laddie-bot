const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  description: "Set your device type",

  type: "SLASH",
  testOnly: true,
  correctSyntax: "{PREFIX}{COMMAND_NAME} {ARGS}",

  options: [
    {
      name: "type",
      description: "Devices",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],

  autocomplete: ( interaction, command, arg ) => { // interaction only

    return ["Desktop", "Laptop", "Mobile", "Other"]
  },

  callback: ({ args, instance }) => {
    return `Command works!`
  }
};
