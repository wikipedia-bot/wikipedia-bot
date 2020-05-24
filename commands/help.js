const Util = require('./../modules/util')
const Logger = new Util.Logger();

/**
 * Command: help
 * Description: The help command. Shows a full list of commands.
 * */
module.exports = {
	name: 'help',
	alias: ['invite', 'bot', 'donate'],
	description: 'The help command shows a full list of all commands.',
	execute(message, args, config) {
		// Check in what type of channel the command was executed
		if(message.channel.type === 'dm' || message.channel.type === 'group') {
			Logger.info(`${config.prefix + this.name} used in a private ${message.channel.type}.`)
		}
		else{
			Logger.info(`${config.prefix + this.name} used on ${message.guild.name} (${message.guild.id}; ${message.guild.memberCount} users)`)
		}

		message.channel.send({
			embed: {
				color: 0xffffff,
				title: message.client.user.username,
				fields: [
					{
						name: 'Commands',
						value: '[Click here](https://www.julianyaman.de/#commands) to see all commands.',
					},
					{
						name: 'Invite',
						value: '[Click here](https://discordapp.com/oauth2/authorize?client_id=554751047030013953&scope=bot&permissions=3467328) to add the bot to your server.',
					},
					{
						name: 'Donate',
						value: 'You can [donate here via PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SJHABMNBYCTBC&source=url). Thank you very much for your help :)',
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