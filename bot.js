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

var {PREFIX, VERSION, TOKEN, DEVELOPMENT, DISCORDBOTS_TOKEN, ONDISCORDXYZ_BOTID, ONDISCORDXYZ_TOKEN} = require("./config")

// Modules
const requests = require('./modules/requests')
const Util = require('./modules/util')

// DiscordBots.org API
const DBL = require("dblapi.js");
const dbl = new DBL(DISCORDBOTS_TOKEN, client);

const _ = require('lodash')
const got = require('got')
const fs = require('fs');

// Creating a collection for the commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}


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
      Util.betterError(e)
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
      Util.betterError(e)
    })

    // Interval for updating the amount of servers the bot is used on on DiscordBots.org every 30 minutes
    setInterval(() => {
      dbl.postStats(client.guilds.size);
    }, 1800000);

    // Interval for updating the amount of servers the bot is used on on bots.ondiscord.xyz every 10 minutes
    setInterval(() => {
      got.post(`https://bots.ondiscord.xyz/bot-api/bots/${ONDISCORDXYZ_BOTID}/guilds`, {
        headers: {
          'Authorization': ONDISCORDXYZ_TOKEN
        },
        json: true,
        method: 'POST',
        body: {
          "guildCount": client.guilds.size
        }
      }).then(res => {
        res.statusCode === 204 ?
          Util.log("Server amount updated on bots.ondiscord.xyz!", `Bot List - bots.ondiscord.xyz / statusCode: ${res.statusCode}`) :
          Util.log("Error occured when trying to update the server amount on bots.ondiscord.xyz!", "Bot List - bots.ondiscord.xyz", "err", res)
      }).catch(e => {
        console.log(e)
      })
    }, 600000);


  }

  Util.log(`Ready to serve on ${client.guilds.size} servers for a total of ${client.users.size} users.`)
})

// DiscordBots.org events
dbl.on('posted', () => {
  Util.log("Server amount updated on discordbots.org!", `Bot List - discordbots.org`)
})

dbl.on('error', e => {
  Util.log("Error occurred while trying to update the server amount on discordbots.org!", `Bot List - discordbots.org`, "err", e)
})

// Continuing with Discord client events
client.on('disconnect', () => Util.log('I disconnected currently but I will try to reconnect!'))

client.on('reconnecting', () => Util.log('Reconnecting...'))

// This event will be triggered when the bot joins a guild.
client.on('guildCreate', guild => {

  // Logging the event
  Util.log(`Joined a new guild -> ${guild.name}. (id: ${guild.id}) This guild has ${guild.memberCount} members!`, 'BOT EVENT')
  Util.log(`Send a message to the owner of ${guild.name} ${guild.owner.user.username + '#' + guild.owner.user.discriminator}.`, 'BOT EVENT -> Guild Owner Message')
  // Updating the presence of the bot with the new server amount
  client.user.setPresence({
    game: {
      name: `on ${client.guilds.size} servers! ${PREFIX}help`
    }
  }).catch(e => {
    console.error(e)
  })
  // Sending a "Thank you" message to the owner of the guild
  guild.owner.send('Thank you for using Wikipedia Bot. The bot is in an early stage of development. If there are any problems with the bot, just write: ``' + PREFIX + 'issue`` in a channel.')


})

// This event will be triggered when the bot is removed from a guild.
client.on('guildDelete', guild => {

  // Logging the event
  Util.log(`I have been removed from -> ${guild.name}. (id: ${guild.id})`, 'BOT EVENT')
  // Updating the presence of the bot with the new server amount
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

/* COMMANDS */

client.on('message', async message => {
  if (message.isMentioned(client.user)) {
    message.delete().catch(e => {
      // TODO: How to handle this properly?
      // console.error(e)
      // message.channel.send('❌ Message to the owner of the server: **Please give the right permissions to me so I can delete this message.**')
    })

    Util.log(`Got mentioned on ${message.guild.name} (${message.guild.id})`)

    // Send the message of the help command as a response to the user
    client.commands.get('help').execute(message, null, {PREFIX, VERSION})
  }

  if (message.author.bot) return
  if (!message.content.startsWith(PREFIX)) return undefined

  let args = message.content.split(' ')

  let command = message.content.toLowerCase().split(' ')[0]
  command = command.slice(PREFIX.length)

  // What should the bot do with an unknown command?
  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args, {PREFIX, VERSION});
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }

})

client.login(TOKEN);