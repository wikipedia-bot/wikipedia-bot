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
    Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)

    message.delete().catch(e => {
      // TODO: How to handle this properly and user-friendly?
    })

    message.author.send("You found an error? Please write an issue in our repository: https://github.com/julianYaman/wikipedia-bot/issues/new\n" +
      "Write exactly what you did when the error occurred (e.g. send wiki command). With your help, we can fix this issue and improve the bot!")
  }
}