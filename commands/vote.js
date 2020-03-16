const Util = require('./../modules/util')
const requests = require('./../modules/requests')

/**
 * Command: bot
 * Description: Sends a link for voting the bot on DiscordBots.org.
 * */
module.exports = {
	name: 'vote',
	description: '**SUPPORT US WITH A VOTE:** Vote for the bot on DiscordBots.org.',
	execute(message, args, config) {
		// Check in what type of channel the command was executed
		if(message.channel.type === 'dm' || message.channel.type === 'group') {
			// If it was in a dm or in a group dm, then log only that it was used in a DM channel without logging anything related to the user.
			Util.log(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
		}
		else{
			// If it was somewhere else, then log normally like before.
			Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)
		}

		message.delete().catch(e => {
			// TODO: How to handle this properly and user-friendly?
		})

		message.author.send('Hi, I\'m the developer of this bot you are using right now! Thank you for supporting the effort behind this project.\n\n' +
      'With your help, the bot will reach a much greater popularity and will be used by more people.\n' +
      'Please vote on one or on all of the three sites:\n* https://top.gg/bot/554751047030013953/vote **(recommended)** \n* https://discordbotlist.com/bots/554751047030013953/upvote \n* https://bots.ondiscord.xyz/bots/554751047030013953  \n\n' +
      'Thank you very much! :)\n***~Julian | yaman#8901***')

	},
}