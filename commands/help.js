const Util = require('./../modules/util')
const requests = require('./../modules/requests')

/**
 * Command: help
 * Description: The help command. Shows a full list of commands.
 * */
module.exports = {
  name: 'help',
  description: 'The help command shows a full list of all commands.',
  execute(message, args, config) {
    // TODO: Instead of sending an embed, send a link to a good looking commands page.
    Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)

    message.delete().catch(e => {
      // TODO: How to handle this properly?
      // console.error(e)
      // message.channel.send('❌ Message to the owner of the server: **Please give the right permissions to me so I can delete this message.**')
    })

    message.author.send({
      embed: {
        color: 3447003,
        title: `${message.client.user.username} / Help command\nGitHub: https://github.com/julianYaman/wikipedia-bot`,
        description: "A full list of commands you can use with this bot",
        timestamp: new Date(),
        fields: [
          {
            name: `${config.PREFIX}help`,
            value: "You get this list of commands with the help command."
          },
          {
            name: `${config.PREFIX}wiki <search term>`,
            value: "Search something on Wikipedia with this command and get a short summary of it."
          },
          {
            name: `${config.PREFIX}issue`,
            value: "Will send you a link to the issues section of the repository of the bot to give feedback or report an error."
          },
          {
            name: `${config.PREFIX}info`,
            value: "Gives you some information about the bot."
          },
          {
            name: `${config.PREFIX}github`,
            value: "Sends you a direct link to the GitHub of the repository."
          },
          {
            name: `${config.PREFIX}bot`,
            value: "Sends you a link where you can invite the bot to your own server!"
          },
          {
            name: `${config.PREFIX}vote`,
            value: "**SUPPORT US WITH A VOTE:** Vote for the bot on DiscordBots.org."
          },
          {
            name: `${config.PREFIX}history`,
            value: "**PROMOTION:** Sends you an invite link to The History Discord as a private link."
          }
        ]
      }
    })
  }
}