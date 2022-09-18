const {Client, IntentsBitField} = require('discord.js')
const CommandHandler = require('command-handler')
const path = require('path')
require('dotenv/config')

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent],
})

client.on('ready', () => {
  console.log('The bot is ready!')

  new CommandHandler({
    client,
    mongoUri: process.env.MONGO_URI,
    commandsDir: path.join(__dirname, 'commands'),
    testServers: ['1020986581013778472'], // must be an array of strings
  })
})

client.login(process.env.TOKEN)
