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
	execute(message, args, config) {
		// Check in what type of channel the command was executed
		if(message.channel.type === 'dm' || message.channel.type === 'group') {
			Logger.info(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
		}
		else{
			Logger.info(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id}; ${message.guild.memberCount} users)`)
		}

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
						value: '[Click here](https://www.notion.so/wikipediabot/Commands-37fa263b9af14332baf70197e4f33e3f) to see all commands.',
					},
					{
						name: 'Invite',
						value: '[Click here](https://discordapp.com/oauth2/authorize?client_id=554751047030013953&scope=bot&permissions=3467328) to add the bot to your server.',
					},
					{
						name: 'Donate',
						value: 'Type ' + config.PREFIX + 'donate .',
					},
					{
						name: 'Patreon',
						value: 'Become a Patron [here](https://www.patreon.com/yaman071).',
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
