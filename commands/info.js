const Util = require('./../modules/util')
const requests = require('./../modules/requests')

/**
 * Command: info
 * Description: Gives you some information about the bot.
 * */
module.exports = {
  name: 'info',
  description: 'Gives you some information about the bot.',
  execute(message, args, config) {
    Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)

    message.channel.send({
      embed: {
        title: "Information about the Wikipedia Bot",
        color: 3447003,
        fields: [
          {
            name: "Repository",
            value: "https://github.com/julianYaman/wikipedia-bot",
            inline: false
          },
          {
            name: "Serving on .. servers in total",
            value: message.client.guilds.size,
            inline: true
          },
          {
            name: "Serving for .. members in total",
            value: message.client.users.size,
            inline: true
          },
          {
            name: "Version",
            value: config.VERSION,
            inline: false
          }
        ],
        timestamp: new Date()
      }
    })
  }
}