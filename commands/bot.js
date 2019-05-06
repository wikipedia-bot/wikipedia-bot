const Util = require('./../modules/util')
const requests = require('./../modules/requests')

/**
 * Command: bot
 * Description: Gives you some information about the bot.
 * */
module.exports = {
  name: 'bot',
  description: 'Gives you some information about the bot.',
  execute(message, args, config) {
    Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)

    message.delete().catch(e => {
      // TODO: How to handle this properly and user-friendly?
    })
    message.author.send('If you want to use the bot on your own server, just click on the Discord Bot Invite link -> https://discordapp.com/oauth2/authorize?client_id=554751047030013953&scope=bot&permissions=3467328')
  }
}