const Util = require('./../modules/util')
const Logger = new Util.Logger();

/**
 * Command: bot
 * Description: Sends a link for voting the bot on DiscordBots.org.
 * */
module.exports = {
	name: 'vote',
	description: '**SUPPORT US WITH A VOTE:** Vote for the bot on top.gg.',
	execute(message, args, config, clusterId) {
		Logger.info(`${config.PREFIX + this.name} was used. (Cluster ${clusterId})`)

		if(message.deletable) message.delete();

		message.author.send('With your help, the bot will reach a much greater popularity and will be used by more people.\n' +
      'Please vote on one or on all of the three sites:\n* https://top.gg/bot/554751047030013953/vote **(recommended)**\n* https://bots.ondiscord.xyz/bots/554751047030013953  \n* https://discordbotlist.com/bots/554751047030013953/upvote \n\n' +
      'Thank you very much! :)\n**~yaman#0001**')

	},
}
