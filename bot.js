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

var {PREFIX, VERSION, TOKEN, DEVELOPMENT, DISCORDBOTS_TOKEN} = require("./config")

// Modules
const requests = require('./modules/requests')
const Util = require('./modules/util')

// DiscordBots.org API
const DBL = require("dblapi.js");
const dbl = new DBL(DISCORDBOTS_TOKEN, client);

const _ = require('lodash')

// Handling client events
client.on('warn', console.warn)

client.on('error', console.error)

client.on('ready', async () => {
  Util.log('\nStarting Bot...\nNode version: ' + process.version + '\nDiscord.js version: ' + Discord.version + '\n', 'READY LOG')
  Util.log('\nThis Bot is online! Running on version: ' + VERSION + '\n', 'READY LOG')

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

    setInterval(() => {
      dbl.postStats(client.guilds.size);
    }, 1800000);

  }

  Util.log(`Ready to serve on ${client.guilds.size} servers for a total of ${client.users.size} users.`)
})

client.on('disconnect', () => console.log('I disconnected currently but I will try to reconnect!'))

client.on('reconnecting', () => console.log('Reconnecting...'))

// This event will be triggered when the bot joins a guild.
client.on('guildCreate', guild => {

  Util.log(`Joined a new guild -> ${guild.name}. (id: ${guild.id}) This guild has ${guild.memberCount} members!`, 'BOT EVENT')
  Util.log(`Send a message to the owner of ${guild.name} ${guild.owner.username + '#' + guild.owner.discriminator}.`, 'BOT EVENT -> Guild Owner Message')
  client.user.setPresence({
    game: {
      name: `on ${client.guilds.size} servers! ${PREFIX}help`
    }
  }).catch(e => {
    console.error(e)
  })

  guild.owner.send('Thank you for using Wikipedia Bot. The bot is in an early stage of development. If there are any problems with the bot, just write: ``' + PREFIX + 'issue`` in a channel.')


})

// This event will be triggered when the bot is removed from a guild.
client.on('guildDelete', guild => {
  Util.log(`I have been removed from -> ${guild.name}. (id: ${guild.id})`, 'BOT EVENT')
  client.user.setPresence({
    game: {
      name: `on ${client.guilds.size} servers! ${PREFIX}help`
    }
  }).catch(e => {
    console.error(e)
  })
})

// TODO: Adding a !github command

// We're logging some commands or messages to make the bot better and to fix more bugs. This will be only the case
// for the beginning of the development. After the main bugs are fixed (see Issues e.g. #1), logging may be turned off for
// the main features and commands. The data will only be used for analysis and to know what we may need to change and to fix.

client.on('message', async message => {
  if (message.isMentioned(client.user)) {
    message.delete().catch(e => {
      // TODO: How to handle this properly?
      // console.error(e)
      // message.channel.send('❌ Message to the owner of the server: **Please give the right permissions to me so I can delete this message.**')
    })

    Util.log(`Got mentioned on ${message.guild.name} (${message.guild.id})`)

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
          },
          {
            name: `${PREFIX}info`,
            value: "Gives you some information about the bot."
          },
          {
            name: `${PREFIX}bot / ${PREFIX}bot-invite / ${PREFIX}invite`,
            value: "Sends you a link where you can invite the bot to your own server!"
          },
          {
            name: `${PREFIX}vote`,
            value: "**SUPPORT US WITH A VOTE:** Vote for the bot on DiscordBots.org."
          },
          {
            name: `${PREFIX}history / ${PREFIX}history-discord`,
            value: "**PROMOTION:** Sends you an invite link to The History Discord as a private link."
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

    // TODO: Instead of sending an embed, send a link to a good looking commands page.
    Util.log(`${PREFIX + command} used on ${message.guild.name} (${message.guild.id})`)

    message.delete().catch(e => {
      // TODO: How to handle this properly?
      // console.error(e)
      // message.channel.send('❌ Message to the owner of the server: **Please give the right permissions to me so I can delete this message.**')
    })

    message.author.send({
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
          },
          {
            name: `${PREFIX}info`,
            value: "Gives you some information about the bot."
          },
          {
            name: `${PREFIX}bot / ${PREFIX}bot-invite / ${PREFIX}invite`,
            value: "Sends you a link where you can invite the bot to your own server!"
          },
          {
            name: `${PREFIX}vote`,
            value: "**SUPPORT US WITH A VOTE:** Vote for the bot on DiscordBots.org."
          },
          {
            name: `${PREFIX}history / ${PREFIX}history-discord`,
            value: "**PROMOTION:** Sends you an invite link to The History Discord as a private link."
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

    if(message.channel.type === 'dm'){
      Util.log(`${PREFIX + command} (args: [${args}]) used by ${message.author.username + '#' + message.author.discriminator}`, `Check log for any incoming errors for fixing new bugs!`)
    }else{
      Util.log(`${PREFIX + command} (args: [${args}]) used on ${message.guild.name} (${message.guild.id})`, `Check log for any incoming errors for fixing new bugs!`)
    }

    if (!args[1]) {
      message.react('👎').catch((e) => {
        Util.log(`Wiki Command -> !args[0] -> message.react -> catch e: ${e}`, `${message.guild.name} (${message.guild.id})`, 'err')
      })
      message.reply('you forgot to search for something. -> ``' + PREFIX + 'wiki [argument] | Example ' + PREFIX + 'wiki Rocket League``')
    } else {
      let searchValue = args.toString().replace(/,/g, ' ')
      searchValue = searchValue.replace(PREFIX + command + ' ', "")
      // console.log('search value -> ' + searchValue)
      // searchValue = _.startCase(searchValue)
      // console.log('search value -> ' + searchValue)

      // console.log('search value: ' + searchValue)
      requests.getWikipediaShortSummary(message, searchValue)
    }

  }

  /**
   * Command: issue
   * Description: Sends a link to the Issues section of the repository.
   * */
  if (command === 'issue'){

    Util.log(`${PREFIX + command} used on ${message.guild.name} (${message.guild.id})`)

    message.delete().catch(e => {
      // TODO: How to handle this properly and user-friendly?
    })
    message.author.send("You found an error? Please write an issue in our repository: https://github.com/julianYaman/wikipedia-bot/issues/new\n" +
      "Write exactly what you did when the error occurred (e.g. send wiki command). With your help, we can fix this issue and improve the bot!")

  }

  /**
   * Command: info
   * Description: Sends an embed with information about the bot.
   * */
  if (command === 'info'){

    Util.log(`${PREFIX + command} used on ${message.guild.name} (${message.guild.id})`)

    message.channel.send({
      embed: {
        title: "Information about the Wikipedia Bot",
        color: 3447003,
        fields: [
          {
            name: "Repository",
            value: "https://github.com/julianYaman/wikipedia-bot",
            inline: false
          },
          {
            name: "Serving on .. servers in total",
            value: client.guilds.size,
            inline: true
          },
          {
            name: "Serving for .. members in total",
            value: client.users.size,
            inline: true
          },
          {
            name: "Version",
            value: VERSION,
            inline: false
          }
        ],
        timestamp: new Date()
      }
    })

  }

  /**
   * Command: history & history-discord
   * Description: Sends an invite to the featured and promoted The History Discord server.
   * */
  if (command === 'history' || command === 'history-discord'){

    Util.log(`${PREFIX + command} used on ${message.guild.name} (${message.guild.id})`)

    message.delete().catch(e => {
      // TODO: How to handle this properly and user-friendly?
    })
    message.author.send('You are interested in history? You would like to know more about historic events? \nThen **The History Discord** is ' +
      'the perfect place for you! -> https://discord.gg/XSG3YZ9 \nhttps://discordbots.org/servers/463373602687942667')
  }

  /**
   * Command: bot & bot-invite & invite
   * Description: Sends a link to invite the bot to your server.
   * */
  if (command === 'bot' || command === 'bot-invite' || command === 'invite'){

    Util.log(`${PREFIX + command} used on ${message.guild.name} (${message.guild.id})`)

    message.delete().catch(e => {
      // TODO: How to handle this properly and user-friendly?
    })
    message.author.send('If you want to use the bot on your own server, just click on the Discord Bot Invite link -> https://discordapp.com/oauth2/authorize?client_id=554751047030013953&scope=bot&permissions=3467328')
  }

  /**
   * Command: vote
   * Description: Sends a link for voting the bot on DiscordBots.org.
   * */
  if (command === 'vote'){

    Util.log(`${PREFIX + command} used on ${message.guild.name} (${message.guild.id})`)

    message.delete().catch(e => {
      // TODO: How to handle this properly and user-friendly?
    })
    message.author.send('Here is the link to the bot on DiscordBots.org. With your vote, the bot will become more and more popular and used by more servers. We appreciate it very much! -> https://discordbots.org/bot/554751047030013953')
  }

})

client.login(TOKEN);