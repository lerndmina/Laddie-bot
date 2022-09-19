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
    cooldownConfig = {},
  }) {
    if (!client) {
      throw new Error("A client is required.");
    }

    this._testServers = testServers;
    this._botOwners = botOwners;
    this._cooldowns = new Cooldowns({
      instanceL: this,
      ...cooldownConfig,
    });

    if (mongoUri) {
      this.connectToMongo(mongoUri);
    }

    if (commandsDir) {
      new CommandHandler(this, commandsDir, client);
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

  connectToMongo(mongoUri) {
    mongoose.connect(mongoUri, {
      keepAlive: true,
    });
  }
}

module.exports = Main;
