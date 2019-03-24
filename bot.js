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

var {PREFIX, VERSION, TOKEN, DEVELOPMENT} = require("./config")

// Modules
const requests = require('./modules/requests')
const Util = require('./modules/util')

const _ = require('lodash')

// Handling client events
client.on('warn', console.warn)

client.on('error', console.error)

client.on('ready', async () => {
  console.log('Starting Bot...\nNode version: ' + process.version + '\nDiscord.js version: ' + Discord.version + '\n')
  console.log('This Bot is online! Running on version ' + VERSION)

  // Different user presences for different development stages
  // TRUE -> Active development / debugging
  // FALSE -> Production usage

  if (DEVELOPMENT === true){
    client.user.setPresence({
      status: "idle",
      game: {
        name: `on ${VERSION} | ${PREFIX}help`,
        type: 'WATCHING'
      }
    }).catch(e => {
      console.error(e)
    })
    Util.log("Bot is currently set on DEVELOPMENT = true", "Bot -> Warning", 1)

  } else {
    client.user.setPresence({
      status: "online",
      game: {
        name: `on ${client.guilds.size} servers | ${PREFIX}help`,
        type: 'WATCHING'
      }
    }).catch(e => {
      console.error(e)
    })
  }

  Util.log(`Ready to serve on ${client.guilds.size} servers for a total of ${client.users.size} users.`)
})

client.on('disconnect', () => console.log('I disconnected currently but I will try to reconnect!'))

client.on('reconnecting', () => console.log('Reconnecting...'))

// This event will be triggered when the bot joins a guild.
client.on('guildCreate', guild => {
  Util.log(`Joined a new guild -> ${guild.name}. (id: ${guild.id}) This guild has ${guild.memberCount} members!`)
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
  Util.log(`I have been removed from -> ${guild.name}. (id: ${guild.id})`)
  client.user.setPresence({
    game: {
      name: `on ${client.guilds.size} servers! ${PREFIX}help`
    }
  }).catch(e => {
    console.error(e)
  })
})

client.on('message', async message => {
  if (message.isMentioned(client.user)) {
    message.delete().catch(e => {
      // console.error(e)
      // message.channel.send('❌ Message to the owner of the server: **Please give the right permissions to me so I can delete this message.**')
    })
    message.author.send({
      embed: {
        color: 3447003,
        author: {
          name: client.user.username
        },
        title: `${client.user.username} / Help command`,
        description: "A full list of commands you can use with this bot",
        timestamp: new Date(),
        fields: [
          {
            name: `${PREFIX}help`,
            value: "You get this list of commands with the help command."
          },
          {
            name: `${PREFIX}wiki <search term>`,
            value: "Search something on Wikipedia with this command and get a short summary of it."
          },
          {
            name: `${PREFIX}issue`,
            value: "Will send you a link to the issues section of the repository of the bot to give feedback or report an error."
          }
        ]
      }
    })
  }

  if (message.author.bot) return
  if (!message.content.startsWith(PREFIX)) return undefined

  let args = message.content.split(' ')

  let command = message.content.toLowerCase().split(' ')[0]
  command = command.slice(PREFIX.length)


  /**
   * Command: help
   * Description: The help command. Shows a full list of commands.
   * */
  if (command === "help"){

    message.channel.send({
      embed: {
        color: 3447003,
        title: `${client.user.username} / Help command\nGitHub: https://github.com/julianYaman/wikipedia-bot`,
        description: "A full list of commands you can use with this bot",
        timestamp: new Date(),
        fields: [
          {
            name: `${PREFIX}help`,
            value: "You get this list of commands with the help command."
          },
          {
            name: `${PREFIX}wiki <search term>`,
            value: "Search something on Wikipedia with this command and get a short summary of it."
          },
          {
            name: `${PREFIX}issue`,
            value: "Will send you a link to the issues section of the repository of the bot to give feedback or report an error."
          }
        ]
      }
    })
  }

  /**
   * Command: wiki
   * Description: The normal wiki command used for getting short summaries of something the user searched for.
   * */
  if (command === 'wiki'){

    // console.log(args)

    if (!args[0]) {
      message.react('👎').catch((e) => {
        Util.betterError(message, `Wiki Command -> !args[0] -> message.react -> catch e: ${e}`)
      })
      message.reply('you forgot to search for something. -> ``' + PREFIX + 'wiki [argument] | Example ' + PREFIX + 'wiki Rocket League``')
    } else {
      let searchValue = args.toString().replace(/,/g, ' ')
      searchValue = searchValue.replace(PREFIX + command + ' ', "")
      searchValue = _.startCase(searchValue)

      // console.log('search value: ' + searchValue)
      requests.getWikipediaShortSummary(message, searchValue)
    }

  }

  /**
   * Command: issue
   * Description: Sends a link to the Issues section of the repository.
   * */
  if (command === 'issue'){

    message.delete().catch(e => {
      // TODO: How to handle this properly and user-friendly?
    })
    message.author.send("You found an error? Please write an issue in our repository: https://github.com/julianYaman/wikipedia-bot/issues/new\n" +
      "Write exactly what you did when the error occurred (e.g. send wiki command). With your help, we can fix this issue and improve the bot!")

  }

})

client.login(TOKEN);