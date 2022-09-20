const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require("discord.js")

module.exports = {
  description: "Ping the bot for latency",

  minArgs: 0, // default 0
  maxArgs: 0,
  correctSyntax: '{PREFIX}{COMMAND_NAME} {ARGS}',

  // delete: true,

  type: "SLASH", // Valid types = LEGACY, SLASH, BOTH
  testOnly: true, // default false
  guildOnly: true,

  reply: true, // replies will @ mention on Discord

  cooldowns:{
    // Pick one of
    // perUser, perUserPerGuild, perGuild, global
    // s m h d
    perUserPerGuild: "30 s",

    errorMessage: "Please wait {TIME} before trying that again.",
  },

  deferReply: true, // true, false "ephemeral"

  // init: async (client, instance) => { // run once
  //   console.log("Hello world from add command")
  // },

  callback: async ({ args, interaction, instance }) => { // run on execute

    const reply = new EmbedBuilder()

    // calculate ping with Date.now() and emojis
    const ping = interaction.client.ws.ping
    const pingEmoji = ping <= 100 ? ":green_circle:" : ping <= 200 ? ":yellow_circle:" : ":red_circle:";

    await new Promise(resolve => setTimeout(resolve, 500))

    // create ping message
    reply
      .setTitle("Pong!")
      .setDescription(`**Ping:** ${ping}ms ${pingEmoji}`)
      .setColor("de3d7b")
      .setTimestamp()

    interaction.editReply({embeds: [reply] });

    return;

    
  },
}
