// Load up the discord.js library. Else throw an error.
try {
  var Discord = require('discord.js')
  if (process.version.slice(1).split('.')[0] < 8) {
    throw new Error('Node 8.0.0 or higher is required. Please upgrade / update Node.js on your computer / server.')
  }
} catch (e) {
  console.error(e.stack)
  console.error('Current Node.js version: ' + process.version)
  console.error("In case you´ve not installed any required module: \nPlease run 'npm install' and ensure it passes with no errors!")
  process.exit()
}
const client = new Discord.Client();

const config = require("./config")

client.on('warn', console.warn)

client.on('error', console.error)

client.on('ready', async () => {
  console.log('Starting Bot...\nNode version: ' + process.version + '\nDiscord.js version: ' + Discord.version + '\n')
  console.log('This Bot is online! Running on version ' + config.version)
  client.user.setPresence({
    status: "online",
    game: {
      name: `on ${client.guilds.size} servers! ${config.prefix}help`
    }
  }).catch(e => {
    console.error(e)
  })
  console.log(`Ready to serve on ${client.guilds.size} servers for a total of ${client.users.size} users.`)
})

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login(config.token);