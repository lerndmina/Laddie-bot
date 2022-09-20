const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  description: "Adds 2+ numbers together.",

  minArgs: 2, // default 0
  maxArgs: 2,
  correctSyntax: "{PREFIX}{COMMAND_NAME} {ARGS}",
  expectedArgs: "<num1> <num2>",

  // delete: true,

  type: "BOTH", // Valid types = LEGACY, SLASH, BOTH
  testOnly: true, // default false
  guildOnly: true,

  reply: true, // replies will @ mention on Discord

  cooldowns: {
    // Pick one of
    // perUser, perUserPerGuild, perGuild, global
    // s m h d
    global: "30 m",

    errorMessage: "Please wait {TIME} before trying that again.",
  },

  // permissions: [
  //   PermissionFlagsBits.Administrator,
  //   PermissionFlagsBits.KickMembers,
  //   PermissionFlagsBits.BanMembers,
  //   PermissionFlagsBits.ManageChannels,
  //   PermissionFlagsBits.ManageGuild,
  //   PermissionFlagsBits.AddReactions,
  //   PermissionFlagsBits.ViewAuditLog,
  //   PermissionFlagsBits.PrioritySpeaker,
  //   PermissionFlagsBits.Stream,
  // ],

  deferReply: false, // true, false "ephemeral"

  // init: async (client, instance) => { // run once
  //   console.log("Hello world from add command")
  // },

  callback: async ({ args, cancelCooldown, updateCooldown }) => {
    // run on execute

    let sum = 0;

    for (const arg of args) {
      sum += parseInt(arg);
    }

    if (isNaN(sum)) {
      return "Please provide numbers only";
    }

    if (this.deferReply === "ephemeral" || this.deferReply === true) {
      // Quick timeout to test defer
      await new Promise((resolve) => setTimeout(resolve, 750));
    }

    return `The sum is ${sum}`;
  },
};
