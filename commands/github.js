const Util = require('./../modules/util')

/**
 * Command: github
 * Description: Sends a link to the GitHub repository of this bot
 * */
module.exports = {
  name: 'github',
  description: 'DESCRIPTION',
  execute(message, args, config){
    Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)

    message.delete().catch(e => {
      // What to do here?
    })

    message.author.send("Here's the link to the GitHub repository: https://github.com/julianYaman/wikipedia-bot")
  }
}