const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  ActivityType,
} = require("discord.js");

module.exports = {
  description: "Give and take user roles",

  type: "SLASH",
  testOnly: true,
  guildOnly: true,

  ownerOnly: true,

  deferReply: "ephemeral",

  permissions: [PermissionFlagsBits.ManageRoles],

  expectedArgs: "<User> <Role>",
  correctSyntax: "{PREFIX}{COMMAND_NAME} {ARGS}",

  options: [
    {
      name: "role",
      description: "The role to give or take",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "user",
      description: "The user to give or take the role from",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  callback: async ({ client, command, args, guild }) => {
    var [role, user] = args;

    role = guild.roles.cache.get(role);
    user = guild.members.cache.get(user);

    // give user role
    if (!user.roles.cache.has(role.id)) {
      user.roles.add(role);
      return `Gave user ${user} the role ${role}`;
    } else {
      // take user role
      user.roles.remove(role);
      return `Took role <@&${role.id}> from user <@${user.id}>`;
    }
  },
};
