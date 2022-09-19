const {Client, IntentsBitField, Partials} = require('discord.js')
const CommandHandler = require('command-handler')
const path = require('path')
require('dotenv/config')

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
  ],
  partials: [Partials.Channel]
})

client.on('ready', () => {
  console.log(`Logged into discord as ${client.user.tag}`)

  new CommandHandler({
    client,
    mongoUri: process.env.MONGO_URI,
    commandsDir: path.join(__dirname, 'commands'),
    testServers: ["1020986581013778472"], // must be an array of strings
    botOwners: ["234439833802637313"],
  })
})

client.login(process.env.TOKEN)
