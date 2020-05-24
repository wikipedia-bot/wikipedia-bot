const Util = require('./../modules/util')
const Logger = new Util.Logger();

/**
 * Command: history
 * Description: Sends an invite to the featured and promoted The History Discord server.
 * */
module.exports = {
	name: 'history',
	description: 'Sends you an invite link to The History Discord as a private link.',
	execute(message, args, config) {
		// Check in what type of channel the command was executed
		if(message.channel.type === 'dm' || message.channel.type === 'group') {
			Logger.info(`${config.prefix + this.name} used in a private ${message.channel.type}.`)
		}
		else{
			Logger.info(`${config.prefix + this.name} used on ${message.guild.name} (${message.guild.id}; ${message.guild.memberCount} users)`)
		}

		message.delete().catch(e => {
			// TODO: How to handle this properly and user-friendly?
		})
		message.author.send('You are interested in history? You would like to know more about historic events? \nThen **The History Discord** is ' +
      'the perfect place for you! -> https://discord.gg/XSG3YZ9 \nhttps://discordbots.org/servers/463373602687942667')
	},
}