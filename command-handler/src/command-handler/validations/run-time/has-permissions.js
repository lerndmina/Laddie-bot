const { PermissionFlagsBits } = require("discord.js");
const requiredPermissions = require("../../../models/permissions-schema");
const replyHandler = require("../../../util/reply-handler");

const keys = Object.keys(PermissionFlagsBits);

module.exports = async (command, usage) => {
  const { permissions = [], deferReply } = command.commandObject;
  const { member, message, interaction, guild } = usage;

  if (!member) return true;

  const document = await requiredPermissions.findById(
    `${guild.id}-${command.commandName}`
  );
  if (document) {
    for (const permission of document.permissions) {
      if (!permissions.includes(permission)) {
        permissions.push(permission);
      }
    }
  }

  if (permissions.length) {
    const missingPermissions = [];
    for (const permission of permissions) {
      if (!member.permissions.has(permission)) {
        const permissionName = keys.find(
          (key) => key === permission || PermissionFlagsBits[key] === permission
        );
        missingPermissions.push(permissionName);
      }
    }
    if (missingPermissions.length) {
      const text = `**__No Permissions__**\`\`\`You are missing the following permissions required for this command\n\n${missingPermissions.join(
        "\n"
      )} \`\`\``;

      replyHandler(message, interaction, text, deferReply);

      return false;
    }
  }
  return true;
};
