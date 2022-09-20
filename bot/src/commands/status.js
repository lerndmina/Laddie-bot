const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  ActivityType,
} = require("discord.js");

module.exports = {
  description: "Sets the bot status",

  type: "SLASH",
  testOnly: true,

  ownerOnly: true,

  deferReply: "ephemeral",

  expectedArgs: "<type> <status> <message>",
  correctSyntax: "{PREFIX}{COMMAND_NAME} {ARGS}",

  options: [
    {
      name: "status", // online, idle, dnd, invisible
      description: "The bot's online status",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: "type", // PLAYING, STREAMING, LISTENING, WATCHING
      description: "The bot's activity type",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },

    {
      name: "message",
      description: "The message",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  autocomplete: (_, command, arg) => {
    if (arg === "status") {
      return ["online", "idle", "dnd", "invisible"];
    } else if (arg === "type") {
      return ["playing", "streaming", "listening", "watching"];
    }
  },

  callback: async ({ client, command, args }) => {
    var [status, type, message] = args;
    if (!type || !status || !message) return `Please provide all the arguments.`;

    type = type.toLowerCase()
    var activityType
    status = status.toLowerCase()

    console.log(`"${status}" "${type}" "${message}"`);

    if (type === "playing") activityType = ActivityType.Playing;
    else if (type === "streaming") activityType = ActivityType.Streaming;
    else if (type === "listening") activityType = ActivityType.Listening;
    else if (type === "watching") activityType = ActivityType.Watching;
    else return `Please provide a valid type.`;

      client.user.setPresence({
        activities: [
          {
            name: message,
            type: activityType,
          },
        ],
      });

      client.user.setStatus(status);

      return `Status set to ${status.toUpperCase()}, "${type} ${message}"`;
  },
};
