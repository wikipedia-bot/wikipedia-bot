const Util = require('./../modules/util')
const bot = require('../bot')

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
        title: "Wikipedia Bot Information",
        color: 3447003,
        fields: [
          {
            name: "Serving on .. servers in total",
            value: message.client.guilds.size,
            inline: true
          },
          {
            name: "Serving for .. members in total",
            value: bot.totalMembers(),
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