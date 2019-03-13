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

var {PREFIX, VERSION, TOKEN} = require("./config")

// Modules
const requests = require('./modules/requests')


// Handling client events
client.on('warn', console.warn)

client.on('error', console.error)

client.on('ready', async () => {
  console.log('Starting Bot...\nNode version: ' + process.version + '\nDiscord.js version: ' + Discord.version + '\n')
  console.log('This Bot is online! Running on version ' + VERSION)
  client.user.setPresence({
    status: "online",
    game: {
      name: `on ${client.guilds.size} servers! ${PREFIX}help`
    }
  }).catch(e => {
    console.error(e)
  })
  console.log(`Ready to serve on ${client.guilds.size} servers for a total of ${client.users.size} users.`)
})

client.on('disconnect', () => console.log('I disconnected currently but I will try to reconnect!'))

client.on('reconnecting', () => console.log('Reconnecting...'))

// This event will be triggered when the bot joins a guild.
client.on('guildCreate', guild => {
  console.log(`Joined a new guild -> ${guild.name}. (id: ${guild.id}) This guild has ${guild.memberCount} members!`)
  client.user.setPresence({
    game: {
      name: `on ${client.guilds.size} servers! ${PREFIX}help`
    }
  }).catch(e => {
    console.error(e)
  })
})

// This event will be triggered when the bot is removed from a guild.
client.on('guildDelete', guild => {
  console.log(`I have been removed from -> ${guild.name}. (id: ${guild.id})`)
  client.user.setPresence({
    game: {
      name: `on ${client.guilds.size} servers! ${PREFIX}help`
    }
  }).catch(e => {
    console.error(e)
  })
})

client.on('message', async msg => {
  if (msg.isMentioned(client.user)) {
    msg.delete().catch(e => {
      // console.error(e)
      msg.channel.send('❌ Message to the owner of the server: **Please give the right permissions to me so I can delete this message.**')
    })
    msg.author.send({
      embed: {
        color: 3447003,
        title: 'Wikipedia -> Commands',
        fields: [
          {
            name: PREFIX + 'help',
            value: 'You´ll see this here'
          }
        ],
        timestamp: new Date()
      }
    })
  }

  if (msg.author.bot) return
  if (!msg.content.startsWith(PREFIX)) return undefined

  let args = msg.content.split(' ')

  let command = msg.content.toLowerCase().split(' ')[0]
  command = command.slice(PREFIX.length)

  // Command: wiki
  if (command === 'wiki'){

    // console.log(args)

    if (!args[0]) {
      message.react('👎').catch((e) => {
        // Util.betterError(message, `Wiki Command -> !args[0] -> message.react -> catch e: ${e}`)
      })
      message.reply('you forgot to send us something to get data.``' + PREFIX + 'wiki [argument] | Example ' + PREFIX + 'wiki Rocket League``')
    } else {
      let searchValue = args.toString().replace(/,/g, ' ')
      searchValue = searchValue.replace(PREFIX + command + ' ', "")
      // console.log('search value: ' + searchValue)
      requests.getWikipediaShortSummary(msg, searchValue)
    }

  }

})

client.login(TOKEN);