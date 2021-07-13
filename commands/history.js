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
		Logger.info(`${config.PREFIX + this.name} was used.`)

		if(message.deletable) message.delete();

		message.author.send('You are interested in history? You would like to know more about historic events? \nThen **The History Discord** is ' +
      'the perfect place for you! -> https://discord.gg/XSG3YZ9 \nhttps://discordbots.org/servers/463373602687942667')
	},
}
