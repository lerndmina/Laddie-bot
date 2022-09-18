const mongoose = require('mongoose')

const CommandHandler = require('./command-handler/CommandHandler')

class Main {
  constructor({ client, mongoUri, commandsDir }) {
    if (!client) {
      throw new Error('A client is required.')
    }

    if (mongoUri) {
      this.connectToMongo(mongoUri)
    }

    if (commandsDir) {
      new CommandHandler(commandsDir, client)
    }
  }

  connectToMongo(mongoUri) {
    mongoose.connect(mongoUri, {
      keepAlive: true,
    })
  }
}

module.exports = Main
