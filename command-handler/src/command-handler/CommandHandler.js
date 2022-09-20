const path = require("path");
const { InteractionType } = require("discord.js");

const getAllFiles = require("../util/get-all-files");
const Command = require("./Command");
const SlashCommands = require("./SlashCommands");
const { cooldownTypes } = require("../util/Cooldowns");

class CommandHandler {
  // <commandName, instance of the Command class>
  _commands = new Map();
  _validations = this.getValidations("run-time");

  // get the prefix from the main instance

  constructor(instance, commandsDir, client, botOwners) {
    this._instance = instance;
    this._commandsDir = commandsDir;
    this._slashCommands = new SlashCommands(client);
    this._client = client;
    this._botOwners = botOwners;
    this.readFiles();
    this.messageListener(client);
    this.interactionListener(client);

    const _prefix = this._instance.prefix;
    // console.log(`The prefix ${_prefix} has been loaded in the command handler`);
    // console.log(`The bot owners ${botOwners} have been loaded in the command handler`);
  }

  get commands() {
    return this._commands;
  }

  async readFiles() {
    const defaultCommands = getAllFiles(path.join(__dirname, "./commands"));
    const files = getAllFiles(this._commandsDir);
    const validations = this.getValidations("syntax");

    for (let file of [...defaultCommands, ...files]) {
      const commandObject = require(file);

      let commandName = file.split(/[/\\]/);
      commandName = commandName.pop();
      commandName = commandName.split(".")[0];

      const command = new Command(this._instance, commandName, commandObject);

      const {
        description,
        type,
        testOnly,
        delete: del,
        aliases = [],
        init = () => {},
      } = commandObject;

      if (del) {
        if (type === "SLASH" || type === "BOTH") {
          if (testOnly) {
            for (const guildID of this._instance.testServers) {
              this._slashCommands.delete(command.commandName, guildID);
            }
          } else {
            this._slashCommands.delete(command.commandName);
          }
        }
        continue;
      }

      for (const validation of validations) {
        validation(command);
      }

      await init(this._client, this._instance);

      const names = [command.commandName, ...aliases];

      for (const name of names) {
        this._commands.set(name, command);
      }

      if (type === "SLASH" || type === "BOTH") {
        const options =
          commandObject.options ||
          this._slashCommands.createOptions(commandObject);

        if (testOnly) {
          for (const guildID of this._instance.testServers) {
            this._slashCommands.create(
              command.commandName,
              description,
              options,
              guildID
            );
          }
        } else {
          this._slashCommands.create(command.commandName, description, options);
        }
      }
    }
  }

  async runCommand(command, args, message, interaction) {
    const { callback, type, cooldowns } = command.commandObject;

    if (message && type === "SLASH") {
      // Oh shit something went very wrong here. 
      // This is a slash command, but it was called as a legacy command
      // If this line is ever reached, something is very wrong
      // Panic and run away
      return;
    }

    const guild = message ? message.guild : interaction.guild;
    const member = message ? message.member : interaction.member;
    const user = message ? message.author : interaction.user;

    const usage = {
      instance: this._instance,
      botOwners: this._botOwners,
      message,
      interaction,
      args,
      text: args.join(" "),
      guild,
      member,
      user,
    };

    // check runtime validations
    for (const validation of this._validations) {
      if (! await(validation(command, usage, this._prefix))) {
        return;
      }
    }

    if (cooldowns) {
      let cooldownType;

      for (const type of cooldownTypes) {
        if (cooldowns[type]) {
          cooldownType = type;
          break;
        }
      }

      // check cooldowns
      const cooldownUsage = {
        cooldownType,
        userID: user.id,
        actionID: `command_${command.commandName}`,
        guildID: guild?.id,
        duration: cooldowns[cooldownType],
        errorMessage: cooldowns.errorMessage,
      };

      const result = await this._instance.cooldowns.canRunAction(cooldownUsage);

      if (typeof result === "string") {
        // this means cooldown returned an error message for the user

        return result;
      }

      await this._instance.cooldowns.startCooldown(cooldownUsage);

      usage.cancelCooldown = () => {
        this._instance.cooldowns.cancelCooldown(cooldownUsage);
      };

      usage.updateCooldown = (expires) => {
        this._instance.cooldowns.updateCooldown(cooldownUsage, expires);
      };
    }

    // Finally, run the command
    return await callback(usage);
  }

  messageListener(client) {
    client.on("messageCreate", async (message) => {
      const { content } = message;

      if (!content.startsWith(this._prefix)) {
        return;
      }

      const args = content.split(/\s+/);
      const commandName = args
        .shift()
        .substring(this._prefix.length)
        .toLowerCase();

      const command = this._commands.get(commandName);
      if (!command) {
        return;
      }

      const { reply, deferReply, type } = command.commandObject;

      if (deferReply && (type === "BOTH" || type === "LEGACY")) {
        message.channel.sendTyping();
      }

      const response = await this.runCommand(command, args, message);
      if (!response) {
        return;
      }
      if (reply) {
        message.reply(response).catch(() => {});
      } else {
        message.channel.send(response).catch(() => {});
      }
    });
  }

  interactionListener(client) {
    client.on("interactionCreate", async (interaction) => {
      if (interaction.type !== InteractionType.ApplicationCommand) {
        this.handleAutocomplete(interaction);
        return;
      }

      const args = interaction.options.data.map(({ value }) => {
        if (
          interaction.type === InteractionType.ApplicationCommandAutocomplete
        ) {
          this.handleAutocomplete(interaction);
          return;
        }

        return String(value);
      });

      const command = this._commands.get(interaction.commandName);
      if (!command) {
        return;
      }

      const { deferReply } = command.commandObject;

      if (deferReply) {
        // post a message informing the user a reply is coming.
        await interaction.deferReply({
          // if deferReply is set to "ephemeral" and the command is an interaction then hide the command from others.
          ephemeral: deferReply === "ephemeral",
        });
      }

      const response = await this.runCommand(command, args, null, interaction);

      if (!response) {
        return;
      }

      if (deferReply) {
        interaction.editReply(response).catch(() => {});
      } else {
        interaction.reply(response).catch(() => {});
      }
    });
  }

  async handleAutocomplete(interaction) {
    const command = this._commands.get(interaction.commandName)
    if (!command) {
      return
    }

    const { autocomplete } = command.commandObject
    if (!autocomplete) {
      return
    }

    const focusedOption = interaction.options.getFocused(true)
    const choices = await autocomplete(interaction, command, focusedOption.name)

    const filtered = choices
      .filter((choice) =>
        choice.toLowerCase().startsWith(focusedOption.value.toLowerCase())
      )
      .slice(0, 25)

    await interaction.respond(
      filtered.map((choice) => ({
        name: choice,
        value: choice,
      }))
    )
  }

  getValidations(folder) {
    const validations = getAllFiles(
      path.join(__dirname, `./validations/${folder}`)
    ).map((filePath) => require(filePath));

    return validations;
  }
}

module.exports = CommandHandler;
