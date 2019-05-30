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
    // Check in what type of channel the command was executed
    if(message.channel.type === "dm" || message.channel.type === "group"){
      // If it was in a dm or in a group dm, then log only that it was used in a DM channel without logging anything related to the user.
      Util.log(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
    }else{
      // If it was in a dm or in a group dm, then log only that it was used in a DM channel without logging anything related to the user.
      Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)
    }

    message.delete().catch(e => {
      // TODO: How to handle this properly and user-friendly?
    })
    message.author.send('If you want to use the bot on your own server, just click on the Discord Bot Invite link -> https://discordapp.com/oauth2/authorize?client_id=554751047030013953&scope=bot&permissions=3467328')
  }
}