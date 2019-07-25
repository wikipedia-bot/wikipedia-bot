const Util = require('./../modules/util')
const requests = require('./../modules/requests')

/**
 * Command: wiki
 * Description: The normal wiki command used for getting short summaries of something the user searched for.
 * */
module.exports = {
  name: 'wiki',
  description: 'Search something on Wikipedia with this command and get a short summary of it.',
  execute(message, args, config) {

    // Check in what type of channel the command was executed
    if(message.channel.type === "dm" || message.channel.type === "group"){
      // If it was in a dm or in a group dm, then log only that it was used in a DM channel without logging anything related to the user.
      Util.log(`${config.PREFIX + this.name} (args: [${args}]) used in a private ${message.channel.type}.`, `Feature: Wiki cmd`)
    }else{
      // If it was somewhere else, then log normally like before.
      Util.log(`${config.PREFIX + this.name} (args: [${args}]) used on ${message.guild.name} (${message.guild.id})`, `Feature: Wiki cmd`)
    }

    if (!args[1]) {
      message.react('👎').catch((e) => {
        Util.log(`Wiki Command -> !args[0] -> message.react -> catch e: ${e}`, `${message.guild.name} (${message.guild.id})`, 'err')
      })
      message.reply('you forgot to search for something. -> ``' + config.PREFIX + 'wiki [argument] | Example ' + config.PREFIX + 'wiki Rocket League``')
    } else {
      let searchValue = args.toString().replace(/,/g, ' ')
      searchValue = searchValue.replace(config.PREFIX + this.name + ' ', "")
      // console.log('search value -> ' + searchValue)
      // searchValue = _.startCase(searchValue)
      // console.log('search value -> ' + searchValue)

      // console.log('search value: ' + searchValue)
      requests.getWikipediaShortSummary(message, searchValue)
    }

  }
}