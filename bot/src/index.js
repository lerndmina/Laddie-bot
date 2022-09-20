const {Client, IntentsBitField, Partials} = require('discord.js')
const CommandHandler = require('command-handler')
const path = require('path')
require('dotenv/config')

const token = process.env.TOKEN
if(!token){
  console.log('[FATAL!] No TOKEN specified. Please specify an TOKEN in the .env file.')
  process.exit()
}

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
  const OWNER_IDS = process.env.OWNER_ID
  var ownerIDArray = []

  const MONGO_URI_LOADED = process.env.MONGO_URI

  const TEST_SERVERS_LOADED = process.env.TEST_SERVERS
  var testServersArray = []

  const PREFIX_LOADED = process.env.PREFIX
  

  if(!OWNER_IDS){
    console.log('[FATAL!] No OWNER_ID specified. Please specify an OWNER_ID in the .env file.\n')
    process.exit()
  } else{
    ownerIDArray = OWNER_IDS.split(',')
  }
  if(!MONGO_URI_LOADED){
    console.log('[FATAL!] No MONGO_URI specified. Please specify a MONGO_URI in the .env file.\n')
    process.exit()
  }
  if(!TEST_SERVERS_LOADED){
    console.log('Test servers not specified. If you want to test slash commands, please specify a TEST_SERVERS in the .env file.\n')
    TEST_SERVERS_LOADED = []
  } else{
    testServersArray = TEST_SERVERS_LOADED.split(',')
  }
  if(!PREFIX_LOADED){
    console.log('[FATAL!] No PREFIX specified. Please specify a PREFIX in the .env file.\n')
    process.exit()
  }
  
  

  console.log(`Owners set as "${ownerIDArray.join(', ')}"`)
  console.log(`Test servers set as "${testServersArray.join(', ')}"`)
  console.log(`Prefix set as "${PREFIX_LOADED}"`)
  console.log(`MongoDB URI located in .env file.`)
  console.log(`\nLogged into discord as ${client.user.tag}`)


  
  // client.application.commands.set([]) 
  //! Use this to delete all commands if a mistake has been made

  console.log('\nLoading commands & MongoDB\n')

  new CommandHandler({
    client,
    mongoUri: MONGO_URI_LOADED,
    commandsDir: path.join(__dirname, 'commands'),
    testServers: testServersArray, // must be an array of strings
    botOwners: ownerIDArray,
    prefix: PREFIX_LOADED,
    cooldownConfig:{
      errorMessage: "This command is computationally expensive, please wait {time} before using it again.",
      botOwnersBypass: false,
      dbRequired: 300 // in seconds / 5 mins
    }
  })
})

client.login(process.env.TOKEN)
