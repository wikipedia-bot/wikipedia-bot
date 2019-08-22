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

    // Check in what type of channel the command was executed
    if(message.channel.type === "dm" || message.channel.type === "group"){
      // If it was in a dm or in a group dm, then log only that it was used in a DM channel without logging anything related to the user.
      Util.log(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
    }else{
      // If it was somewhere else, then log normally like before.
      Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)
    }

    message.delete().catch(e => {
      // TODO: How to handle this properly?
      // console.error(e)
      // message.channel.send('❌ Message to the owner of the server: **Please give the right permissions to me so I can delete this message.**')
    })

    message.author.send({
      embed: {
        color: 0xffffff,
        title: message.client.user.username,
        fields: [
          {
            name: "Commands",
            value: "[Click here](https://www.julianyaman.de/) to see all commands."
          },
          {
            name: "Invite",
            value: "[Click here](https://discordapp.com/oauth2/authorize?client_id=554751047030013953&scope=bot&permissions=3467328) to add the bot to your server."
          },
          {
            name: "Donate",
            value: "You can [donate on Patreon](https://www.patreon.com/user?u=23070184). Thank you very much for your help :)"
          },
          {
            name: "Feedback & Support",
            value: "Join the [Discord Server](https://discord.gg/yAUmDNb) to get support if you're having problems with using the bot."
          }
        ]
      }
    })
  }
}