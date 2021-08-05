const Util = require('./../modules/util')
const Logger = new Util.Logger();

/**
 * Command: help
 * Description: The help command. Shows a full list of commands.
 * */
module.exports = {
	name: 'help',
	alias: ['invite', 'bot'],
	description: 'The help command shows a full list of all commands.',
	execute(message, args, config, clusterId) {
		Logger.info(`${config.PREFIX + this.name} was used. (Cluster ${clusterId})`)

		message.channel.send({
			embed: {
				color: 0xffffff,
				title: message.client.user.username,
				fields: [
					{
						name: 'Get Started',
						value: 'Start by typing `' + config.PREFIX + 'wiki <keyword>`.',
					},
					{
						name: 'Commands',
						value: '[Click here](https://wikipediabot.yaman.pro/commands) to see all commands.',
					},
					{
						name: 'Invite',
						value: '[Click here](https://discordapp.com/oauth2/authorize?client_id=554751047030013953&scope=bot&permissions=3467328) to add the bot to your server.',
					},
					{
						name: 'Donate on Buy Me A Coffee',
						value: 'Type ' + config.PREFIX + 'donate .',
					},
					{
						name: 'Feedback & Support',
						value: 'Join the [Discord Server](https://discord.gg/yAUmDNb) to get support if you\'re having problems with using the bot.',
					},
				],
			},
		})


	},
}
