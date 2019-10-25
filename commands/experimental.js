const Util = require('./../modules/util')
const requests = require('./../modules/requests')

/**
 * Command: help
 * Description: The help command. Shows a full list of commands.
 * */
module.exports = {
  name: 'experimental',
  alias: ['test', 'beta'],
  description: 'The help command shows a full list of all commands.',
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
        color: 0x1abc9c,
        title: message.client.user.username + ' - Beta features for testers!',
        fields: [
          {
            name: "Register to the Beta program.",
            value: "Register now to get access to new experimental features which will be released in future updates. " +
              "Help the developers to make the bot better by giving feedback directly to them with your suggestions and critic.\n\n" +
              "*Coming soon*"
          }
        ]
      }
    })
  }
}