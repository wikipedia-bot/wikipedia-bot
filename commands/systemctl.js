const Util = require('../modules/util')
const Logger = new Util.Logger();
const Keyv = require('keyv');
const prefixcache = new Keyv('sqlite://data/prefixes.sqlite')
const Discord = require('discord.js')


function embedder(desc) {
	return new Discord.MessageEmbed()
		.setTitle('Wikipedia Bot Settings')
		.setDescription(desc)
		.setColor('BLUE')
}


/**
 * Command: systemctl/config
 * Description: shows the current settings ans allows to set a new prefix
 * */

module.exports = {
	name: 'systemctl',
	alias: ['config'],
	description: 'Displays your current settings and allows you to update your settings.',
	async execute(message, args, config) {
		// eslint-disable-next-line no-mixed-spaces-and-tabs

		Logger.info(`${config.PREFIX + this.name} used.`)

		// eslint-disable-next-line no-mixed-spaces-and-tabs
		if (!args[1] || args[1] !== 'set') {
			// show current prefix here
			const p = await prefixcache.get(message.guild.id)
			await message.channel.send(embedder(`Your current prefix is: \`${p || config.PREFIX}\`\n\nChange it by using the \`${config.PREFIX}systemctl set\` command.`))
		}
		else {
			// set prefix to db here
			if (!args[2]) return message.channel.send(embedder('You didnt provide a new prefix. Please use the command like this: \n> `systemctl set $` -> sets `$` as your new prefix.'))

			await prefixcache.set(message.guild.id, args[2])
			await message.channel.send(embedder(`Success, I saved \`${args[2]}\` as your new prefix.`))
			Logger.info(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id}; ${message.guild.memberCount} users)`)
		}


	},
}
