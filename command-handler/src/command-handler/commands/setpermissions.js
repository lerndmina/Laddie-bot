const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");
const requiredPermissions = require("../../models/setpermissions-schema");

const clear = "Clear";

module.exports = {
  description: "Set the required permissions for a command.",
  expectedArgs: "<command> <permissions>",
  type: "SLASH",
  guildOnly: true,
  testOnly: true,

  permissions: [PermissionFlagsBits.ADMINISTRATOR],

  cooldowns:{
    perGuild: "15 s",
    errorMessage: "This command interacts with a database.\n Please wait {TIME} before trying that again.",
  },

  

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

  autocomplete: (_, command, arg) => {
    if (arg === "command") {
      // return all commands
      return [...command.instance.commandHandler.commands.keys()];
    } else if (arg === "permission") {
      // return all permissions
      return [clear, ...Object.keys(PermissionFlagsBits)];
    }
  },

  callback: async ({ instance, guild, args }) => {
    const [commandName, permission] = args;

    const command = instance.commandHandler.commands.get(commandName);

    if (!command) {
      return `Command "${commandName}" not found.`;
    }

    const _id = `${guild.id}-${command.commandName}`;

    // TODO If the permission doesn't exist list all avaliable
    if(permission === clear) {
      await requiredPermissions.deleteOne({ _id });

      return `Cleared permissions for command "${command.commandName}"`;
    }

    const alreadySet = await requiredPermissions.findOne({
      _id,
      permissions: {
        $in: [permission],
      },
    });

    if (alreadySet) {
      await requiredPermissions.findOneAndUpdate(
        {
          _id,
        },
        {
          _id,
          $pull: {
            permissions: permission,
          },
        }
      );

      return `The command "${command.commandName}" no longer requires "${permission}".`;
    }

    await requiredPermissions.findOneAndUpdate(
      {
        _id,
      },
      {
        _id,
        $addToSet: {
          permissions: permission,
        },
      },
      {
        upsert: true,
      }
    );

    return `The command "${commandName} now requires the permission "${permission}"`;
  },
};
