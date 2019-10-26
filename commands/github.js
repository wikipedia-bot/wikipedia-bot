const Util = require('./../modules/util')

/**
 * Command: github
 * Description: Sends a link to the GitHub repository of this bot
 * */
module.exports = {
	name: 'github',
	description: 'DESCRIPTION',
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
			// What to do here?
		})

		message.author.send('Here\'s the link to the GitHub repository: https://github.com/julianYaman/wikipedia-bot')
	},
}