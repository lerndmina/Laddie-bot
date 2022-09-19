const mongoose = require("mongoose");

const CommandHandler = require("./command-handler/CommandHandler");
const Cooldowns = require("./util/Cooldowns");

class Main {
  constructor({
    client,
    mongoUri,
    commandsDir,
    testServers = [],
    botOwners = [],
    prefix,
    cooldownConfig = {},
  }) {
    if (!client) {
      throw new Error("A client is required.");
    }

    this._testServers = testServers;
    this._botOwners = botOwners;
    this._prefix = prefix;
    this._cooldowns = new Cooldowns({
      instance: this,
      ...cooldownConfig,
    });

    if (mongoUri) {
      this.connectToMongo(mongoUri);
    }

    if (commandsDir) {
      this._commandHandler = new CommandHandler(this, commandsDir, client, this._botOwners);
    }
  }

  // End of constructor

  get testServers() {
    return this._testServers;
  }

  get botOwners() {
    this._botOwners;
  }

  get cooldowns() {
    return this._cooldowns;
  }

  get commandHandler() {
    return this._commandHandler;
  }

  get prefix() {
    return this._prefix;
  }

  connectToMongo(mongoUri) {
    mongoose.connect(mongoUri, {
      keepAlive: true,
    });
  }
}

module.exports = Main;
