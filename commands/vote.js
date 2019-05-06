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
    Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)

    message.delete().catch(e => {
      // TODO: How to handle this properly and user-friendly?
    })
    message.author.send('Here is the link to the bot on DiscordBots.org. With your vote, the bot will become more and more popular and used by more servers. We appreciate it very much! -> https://discordbots.org/bot/554751047030013953')
  }
}