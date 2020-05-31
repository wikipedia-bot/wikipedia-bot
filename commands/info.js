const Util = require('./../modules/util')
const Logger = new Util.Logger();
const bot = require('../bot')

/**
 * Command: info
 * Description: Gives you some information about the bot.
 * */
module.exports = {
	name: 'info',
	description: 'Gives you some information about the bot.',
	async execute(message, args, config) {
		// Check in what type of channel the command was executed
		if(message.channel.type === 'dm' || message.channel.type === 'group') {
			Logger.info(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
		}
		else{
			Logger.info(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id}; ${message.guild.memberCount} users)`)
		}

		await message.channel.send({
			embed: {
				author: {
					name: message.client.user.username,
					icon_url: 'https://cdn.discordapp.com/avatars/554751047030013953/29bda61e7319dd2b49961313b1256231.png',
					url: 'https://julianyaman.de',
				},
				description: `Need help? Type **${config.PREFIX}help**`,
				color: 3447003,
				fields: [
					{
						name: 'Servers',
						value: await bot.guildCount(),
						inline: true,
					},
					{
						name: 'Users',
						value: await bot.totalMembers(),
						inline: true,
					},
					{
						name: 'Website',
						value: '[julianyaman.de](https://www.julianyaman.de/)',
						inline: true,
					},
					{
						name: 'Owner',
						value: 'yaman#8901',
						inline: true,
					},
					{
						name: 'Version',
						value: config.VERSION,
						inline: true,
					},
					{
						name: 'Discord',
						value: '[Join](https://discord.gg/ccpgH3b)',
						inline: true,
					},
					{
						name: 'Library',
						value: 'discord.js',
						inline: true,
					},
					{
						name: 'Invite the bot',
						value: '[here](https://discordapp.com/oauth2/authorize?client_id=554751047030013953&scope=bot&permissions=3467328)',
						inline: true,
					},
					{
						name: 'GitHub',
						value: '[Repository](https://github.com/julianYaman/wikipedia-bot)',
						inline: true,
					},
					{
						name: 'Donate',
						value: '[via PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SJHABMNBYCTBC&source=url)',
						inline: true,
					},
				],
			},
		})
	},
}
