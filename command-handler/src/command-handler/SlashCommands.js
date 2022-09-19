const { ApplicationCommandOptionType } = require("discord.js");

class SlashCommands {
  constructor(client) {
    this.client = client;
  }

  async getCommands(guildId) {
    // Guild-based, instant
    // Global, can take an hour to update
    let commands;

    if (guildId) {
      const guild = await this.client.guilds.fetch(guildId);
      commands = guild.commands;
    } else {
      commands = this.client.application.commands;
    }

    await commands.fetch();

    return commands;
  }

  areOptionsDifferent(options, existingoptions) {
    for (let a = 0; a < options.length; ++a) {
      const option = options[a];
      const existing = existingoptions[a];

      if (
        option.name == !existing.name ||
        option.type !== existing.type ||
        option.description !== existing.description
      ) {
        return true;
      }
    }
    return false;
  }

  async create(name, description, options, guildId) {
    const commands = await this.getCommands(guildId);

    const existingCommand = commands.cache.find((cmd) => cmd.name === name);
    if (existingCommand) {
      const { description: existingDescription, options: existingOptions } =
        existingCommand;

      if (
        description !== existingDescription ||
        options.length !== existingOptions.length ||
        this.areOptionsDifferent(options, existingOptions)
      ) {
        console.log(`Command "${name}" has changed, updating...`);

        await commands.edit(existingCommand.id, {
            description,
            options
        })
      } else {
        console.log(`Command "${name}" loaded.`);
      }
      return;
    }

    await commands.create({
      name,
      description,
      options,
    });
    console.log(`Command "${name}" is new, registering...`);
  }

  async delete(commandName, guildID) {
    const commands = await this.getCommands(guildID);

    const existingCommand = commands.cache.find(
      (cmd) => cmd.name === commandName
    );
    if (!existingCommand) {
      return;
    }

    await existingCommand.delete();
    console.log(`Command "${commandName}" is being deleted...`);
  }

  createOptions({ expectedArgs = "", minArgs = 0 }) {
    //<num1> <num2>
    const options = [];

    if (expectedArgs) {
      const split = expectedArgs
        .substring(1, expectedArgs.length - 1)
        .split(/[>\]] [<\[]/);

      for (let a = 0; a < split.length; ++a) {
        const arg = split[a];

        options.push({
          name: arg.toLowerCase().replace(/\s+/g, "-"),
          description: arg,
          type: ApplicationCommandOptionType.String,
          required: a < minArgs,
        });
      }
    }

    return options;
  }
}

module.exports = SlashCommands;
