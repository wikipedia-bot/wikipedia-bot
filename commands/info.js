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
    // Check in what type of channel the command was executed
    if(message.channel.type === "dm" || message.channel.type === "group"){
      // If it was in a dm or in a group dm, then log only that it was used in a DM channel without logging anything related to the user.
      Util.log(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
    }else{
      // If it was somewhere else, then log normally like before.
      Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)
    }

    message.channel.send({
      embed: {
        title: "Wikipedia Bot Information",
        description: `*If you need help, type **${config.PREFIX}help***`,
        color: 3447003,
        fields: [
          {
            name: "Official website:",
            value: "https://www.julianyaman.de/",
            inline: false
          },
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