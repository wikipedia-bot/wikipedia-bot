const Util = require('./../modules/util')
const Logger = new Util.Logger();

/**
 * Command: experimental
 * Description: List of all beta features which can be tested by selected testers.
 * */
module.exports = {
	name: 'experimental',
	alias: ['test', 'beta'],
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
				color: 0x1abc9c,
				title: message.client.user.username + ' - Beta features for testers!',
				fields: [
					{
						name: 'Register to the Beta program.',
						value: 'Register now to get access to new experimental features which will be released in future updates. ' +
              'Help the developers to make the bot better by giving feedback directly to them with your suggestions and critic.\n\n' +
              '*Coming soon*',
					},
				],
			},
		})
	},
}
