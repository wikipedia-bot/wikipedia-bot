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

    if(message.channel.type === 'dm'){
      Util.log(`${config.PREFIX + this.name} (args: [${args}]) used by ${message.author.username + '#' + message.author.discriminator}`, `Check log for any incoming errors for fixing new bugs!`)
    }else{
      Util.log(`${config.PREFIX + this.name} (args: [${args}]) used on ${message.guild.name} (${message.guild.id})`, `Check log for any incoming errors for fixing new bugs!`)
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