const path = require('path')
const { InteractionType } = require('discord.js')

const getAllFiles = require('../util/get-all-files')
const Command = require('./Command')
const SlashCommands = require('./SlashCommands')

class CommandHandler {
  // <commandName, instance of the Command class>
  _commands = new Map()
  _validations = this.getValidations('run-time')
  _prefix = '!'

  constructor(instance, commandsDir, client) {
    this._instance = instance
    this._commandsDir = commandsDir
    this._slashCommands = new SlashCommands(client)
    this.readFiles()
    this.messageListener(client)
    this.interactionListener(client)
  }

  readFiles() {
    const files = getAllFiles(this._commandsDir)
    const validations = this.getValidations('syntax')

    for (let file of files) {
      const commandObject = require(file)

      let commandName = file.split(/[/\\]/)
      commandName = commandName.pop()
      commandName = commandName.split('.')[0]

      const command = new Command(this._instance, commandName, commandObject)

      for (const validation of validations) {
        validation(command)
      }

      const { description, options = [], type, testOnly } = commandObject

      this._commands.set(command.commandName, command)

      if(type === "SLASH" || type === "BOTH"){
        if(testOnly){
          for (const guildID of this._instance.testServers){
            this._slashCommands.create(
              command.commandName, 
              description,
              options,
              guildID)
          }
        } else{
          this._slashCommands.create(
            command.commandName, 
            description,
            options)
        }
      }
    }
  }

  async runCommand(commandName, args, message, interaction){
    const command = this._commands.get(commandName)
      if (!command) {
        return
      }

      const { callback, type } = command.commandObject

      if(message && type === "SLASH"){
        return
      }

      const usage = {
        message,
        interaction,
        args,
        text: args.join(' '),
        guild: message ? message.guild : interaction.guild,
      }

      for (const validation of this._validations) {
        if (!validation(command, usage, this._prefix)) {
          return
        }
      }

      callback(usage)
  }

  messageListener(client) {
    

    client.on('messageCreate', async (message) => {
      const { content } = message

      if (!content.startsWith(this._prefix)) {
        return
      }

      const args = content.split(/\s+/)
      const commandName = args.shift().substring(this._prefix.length).toLowerCase()

      await this.runCommand(commandName, args, message)
    })
  }

  interactionListener(client){
    client.on('interactionCreate', (interaction) => {
      console.log("Interaction happened")
      if(interaction.type !== InteractionType.ApplicationCommand){
        return
      }

      console.log(`Command Name ${interaction.commandName}`)
    })
  }

  getValidations(folder) {
    const validations = getAllFiles(
      path.join(__dirname, `./validations/${folder}`)
    ).map((filePath) => require(filePath))

    return validations
  }
}

module.exports = CommandHandler
