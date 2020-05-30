/**
 * Beginning of the main file
 * */
const Discord = require('discord.js')
if (process.version.slice(1).split('.')[0] < 12) {
	console.error('Node 12.0.0 or higher is required. Please upgrade Node.js on your computer / server.')
	process.exit(1)
}

const Keyv = require('keyv');
const prefixcache = new Keyv('sqlite://modules/data/prefixes.sqlite')

const client = new Discord.Client({ disableMentions: 'everyone' });
const { PREFIX, VERSION, TOKEN, DEVELOPMENT } = require('./config')
const BotListUpdater = require('./modules/bot-list-updater').BotListUpdater

// Modules
const Util = require('./modules/util')
const Logger = new Util.Logger();
const fs = require('fs');


// Creating a collection for the commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
	// Check if any alias does exist and add if they do
	if(command.alias) {
		for(const alias of command.alias) {
			client.commands.set(alias, command)
		}
	}
}

// Handling prefixcache errors.
prefixcache.on('error', e => console.log('There was an error with the keyv package, trace: ', e))

// Handling client events
client.on('warn', console.warn)

client.on('error', console.error)

client.on('ready', async () => {

	Logger.info('\nStarting Bot...\nNode version: ' + process.version + '\nDiscord.js version: ' + Discord.version + '\n')
	Logger.info('\nThis Bot is online! Running on version: ' + VERSION + '\n')

	// Different user presences for different development stages
	// TRUE -> Active development / debugging
	// FALSE -> Production usage

	if (DEVELOPMENT === true) {

		client.user.setPresence({
			status: 'idle',
			activity: {
				name: `${PREFIX}help | ${await this.guildCount()} servers`,
			},
		}).catch(e => {
			console.error(e)
		})
		Logger.warn('Bot is currently set on DEVELOPMENT = true')

	}
	else {
		client.user.setPresence({
			status: 'online',
			activity: {
				name: `${PREFIX}help | ${await this.guildCount()} servers`,
			},
		}).catch(e => {
			console.error(e)
		})

		// Creating a new updater
		const updater = new BotListUpdater()

		// Interval for updating the amount of servers the bot is used on on top.gg every 30 minutes
		setInterval(async () => {
			updater.updateTopGg(await this.guildCount())
		}, 1800000);

		// Interval for updating the amount of servers the bot is used on on bots.ondiscord.xyz every 10 minutes
		setInterval(async () => {
			updater.updateBotsXyz(await this.guildCount())
		}, 600000);

		// Interval for updating the amount of servers the bot is used on on discordbotlist.com every 5 minutes
		setInterval(async () => {
			updater.updateDiscordBotList(await this.guildCount(), await this.totalMembers(), 0)
		}, 300000);

	}

	Logger.info(`Ready to serve on ${await this.guildCount()} servers for a total of ${await this.totalMembers()} users.`)
})


// Continuing with Discord client events
client.on('disconnect', () => Logger.info('Disconnected!'))

client.on('reconnecting', () => Logger.info('Reconnecting...'))

// This event will be triggered when the bot joins a guild.
client.on('guildCreate', async guild => {

	// Logging the event
	Logger.info(`Joined server ${guild.name} with ${guild.memberCount} users. Total servers: ${await this.guildCount()}`)

	//saving guild to the database with standard prefix
	await prefixcache.set(guild.id, PREFIX)
	// Updating the presence of the bot with the new server amount
	client.user.setPresence({
		activity: {
			name: `${PREFIX}help | ${await this.guildCount()} servers`,
		},
	}).catch(e => {
		console.error(e)
	})
	// Sending a "Thank you" message to the owner of the guild
	await guild.owner.send('Thank you for using Wikipedia Bot. :) Please help promoting the bot by voting. Write **' + PREFIX + 'vote** in this channel.')


})

// This event will be triggered when the bot is removed from a guild.
// eslint-disable-next-line no-unused-vars
client.on('guildDelete', async guild => {

	// Logging the event
	Logger.info(`Left a server. Total servers: ${await this.guildCount()}`)

	// remove guild from database cause we dont need no junk
	prefixcache.delete(guild.id)
	// Updating the presence of the bot with the new server amount
	client.user.setPresence({
		activity: {
			name: `${PREFIX}help | ${await this.guildCount()} servers`,
		},
	}).catch(e => {
		console.error(e)
	})
})

/**
 * Returns the total amount of users who use the bot.
 * */
exports.totalMembers = async () => {
	return client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
		.then(res => {
			return res.reduce((prev, memberCount) => prev + memberCount, 0)
		}).catch(console.error)
}

/**
 * Counting all guilds.
 * */
exports.guildCount = async () => {
	return client.shard.fetchClientValues('guilds.cache.size')
		.then(res => {
			return res.reduce((prev, count) => prev + count, 0)
		}).catch(console.error)
}

// We're logging some commands or messages to make the bot better and to fix more bugs. This will be only the case
// for the beginning of the development. Logging may be turned off for
// the main features and commands. The data will only be used for analysis and to know what we may need to change and to fix.

/* COMMANDS */

client.on('message', async message => {

	if (message.channel.type === "dm") return
	
	let PREFIx = await prefixcache.get(message.guild.id) || PREFIX
	
	
	if (message.mentions.everyone === false && message.mentions.has(client.user)) {
		// Send the message of the help command as a response to the user
		client.commands.get('help').execute(message, null, { PREFIx, VERSION })
	}

	if (message.author.bot) return
	if (!message.content.startsWith(PREFIx)) return undefined

	const args = message.content.split(' ')

	let command = message.content.toLowerCase().split(' ')[0]
	command = command.slice(PREFIx.length)

	// What should the bot do with an unknown command?
	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args, { PREFIx, VERSION });
	}
	catch (error) {
		console.error(error);
		await message.reply('there was an error trying to execute that command!');
	}

})

client.login(TOKEN).then(r => console.log('Successfully logged in!'));

process.on('unhandledRejection', PromiseRejection => {
	console.error(PromiseRejection)
})