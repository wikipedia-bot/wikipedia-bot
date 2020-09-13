const Util = require('./../modules/util')
const Logger = new Util.Logger();

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
			Logger.info(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
		}
		else{
			Logger.info(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id}; ${message.guild.memberCount} users)`)
		}

		if(message.deletable) message.delete();

		message.author.send('Here\'s the link to the GitHub repository: https://github.com/julianYaman/wikipedia-bot')
	},
}
