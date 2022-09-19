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
  const ownerIDs = (process.env.OWNER_ID).split(',')
  console.log(`Logged into discord as ${client.user.tag}`)
  console.log(`Owners set as ${ownerIDs}`)
  
  // client.application.commands.set([]) 
  //! Use this to delete all commands if a mistake has been made

  new CommandHandler({
    client,
    mongoUri: process.env.MONGO_URI,
    commandsDir: path.join(__dirname, 'commands'),
    testServers: ["1020986581013778472"], // must be an array of strings
    botOwners: ownerIDs,
    cooldownConfig:{
      errorMessage: "Please wait {TIME}",
      botOwnersBypass: false,
      dbRequired: 300 // in seconds / 5 mins
    }
  })
})

client.login(process.env.TOKEN)
