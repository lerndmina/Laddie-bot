const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");
const requiredPermissions = require("../../models/setpermissions-schema");

module.exports = {
  description: "Set the required permissions for a command.",
  expectedArgs: "<command> <permissions>",
  type: "SLASH",
  guildOnly: true,
  testOnly: true,

  permissions: [PermissionFlagsBits.ADMINISTRATOR],

  options: [
    {
      name: "command",
      description: "The command to set permissions for.",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: "permission",
      description: "The permission to set for the command",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],

  autocomplete: (instance, _, arg) => {
    return ["sum", "BanMembers"];
  },

  callback: async ({ instance, guild, args }) => {
    const [commandName, permission] = args;

    console.log(instance.commandHandler.commands.get(commandName))

    const command = instance.commandHandler.commands.get(commandName);

    if (!command) {
      return `Command "${commandName}" not found.`;
    }

    const _id = `${guild.id}-${command.commandName}`;

    // TODO If the permission doesn't exist list all avaliable
    // TODO If permission is "clear" clear all permission requirements

    await requiredPermissions.findOneAndUpdate(
      {
        _id,
      },
      {
        _id,
        $addToSet: {
            permissions: permission
        }
      },
      {
        upsert: true,
      }
    );

    return `The command "${commandName} now requires the permission "${permission}"`;
  },
};
