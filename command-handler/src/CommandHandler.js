const getAllFiles = require('./util/get-all-files')

class CommandHandler {
  // <commandName, commandObject>
  commands = new Map()

  constructor(commandsDir, client) {
    this.commandsDir = commandsDir
    this.readFiles()
    this.messageListener(client)
  }

  readFiles() {
    const files = getAllFiles(this.commandsDir)

    for (let file of files) {
      const commandObject = require(file)

      let commandName = file.split(/[/\\]/)
      commandName = commandName.pop()
      commandName = commandName.split('.')[0]

      if (!commandObject.callback) {
        throw new Error(
          `Command "${commandName}" does not have a callback function.`
        )
      }

      this.commands.set(commandName.toLowerCase(), commandObject)
    }

    console.log(this.commands)
  }

  messageListener(client) {
    client.on('messageCreate', (message) => {
      if (message.author.bot){
        return
      }
      const { content } = message
      console.log(`Message detected: ${content}`)
      if (!content.startsWith('!')) {
        return
      }

      const args = content.split(/\s+/)
      const commandName = args.shift().substring(1).toLowerCase()

      const commandObject = this.commands.get(commandName)
      if (!commandObject) {
        return
      }

      const { callback } = commandObject

      callback({ message })
    })
  }
}

module.exports = CommandHandler
