const mongoose = require("mongoose");

const CommandHandler = require("./command-handler/CommandHandler");

class Main {
  constructor({
    client,
    mongoUri,
    commandsDir,
    testServers = [],
    botOwners = [],
  }) {
    if (!client) {
      throw new Error("A client is required.");
    }

    this._testServers = testServers;
    this._botOwners = botOwners;

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

  connectToMongo(mongoUri) {
    mongoose.connect(mongoUri, {
      keepAlive: true,
    });
  }
}

module.exports = Main;
