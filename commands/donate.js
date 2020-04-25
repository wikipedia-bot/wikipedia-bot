const Util = require('./../modules/util')
const Logger = new Util.Logger();

/**
 * Command: donate
 * Description: Sending an embed with links to PayPal Donation and Patreon
 * */
module.exports = {
	name: 'donate',
	alias: ['patreon'],
	description: '',
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
				title: 'Support the developer with a donation',
				fields: [
					{
						name: 'Donate',
						value: 'You can [donate here via PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SJHABMNBYCTBC&source=url).',
					},
					{
						name: 'Patreon',
						value: 'Become a Patron [here](https://www.patreon.com/yaman071).',
					},
				],
			},
		})


	},
}