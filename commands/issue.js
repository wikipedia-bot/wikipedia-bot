const Util = require('./../modules/util')
const requests = require('./../modules/requests')

/**
 * Command: issue
 * Description: Sends a link to the Issues section of the repository.
 * */
module.exports = {
  name: 'issue',
  description: 'Will send you a link to the issues section of the repository of the bot to give feedback or report an error.',
  execute(message, args, config) {
    // Check in what type of channel the command was executed
    if(message.channel.type === "dm" || message.channel.type === "group"){
      // If it was in a dm or in a group dm, then log only that it was used in a DM channel without logging anything related to the user.
      Util.log(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
    }else{
      // If it was somewhere else, then log normally like before.
      Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)
    }

    message.delete().catch(e => {
      // TODO: How to handle this properly and user-friendly?
    })

    message.author.send("You found an error? Please write an issue in our repository: https://github.com/julianYaman/wikipedia-bot/issues/new\n" +
      "Write exactly what you did when the error occurred (e.g. send wiki command). With your help, we can fix this issue and improve the bot!")
  }
}