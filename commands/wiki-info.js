const Util = require('./../modules/util')
const requests = require('./../modules/requests')

/**
 * Command: wiki-number
 * Description: It helps you to get specific information about a specific topic (e.g. dates, numbers, etc.)
 * */
module.exports = {
  name: 'wiki-info',
  description: 'It helps you to get specific information about a specific topic (e.g. dates, numbers, etc.)',
  execute(message, args, config){

    // USAGE: !wiki-info [TYPE OF INFORMATION] [ARGUMENT]
    if (!args[1]) {
      message.react('👎').catch((e) => {
        Util.log(`wiki-info Command -> !args[0] -> message.react -> catch e: ${e}`, `${message.guild.name} (${message.guild.id})`, 'err')
      })
      message.reply('you forgot to search for something. -> ``' + config.PREFIX + 'wiki-info [argument] | Example ' + config.PREFIX + 'wiki-info Rocket League``')
    } else {

      let informationArguments = message.content.replace(`${config.PREFIX}${this.name} `, "")
      // https://regex101.com/r/qa3KxQ/1/ and https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
      informationArguments = informationArguments.match(/[^\s"']+|"([^"]*)"+|'([^']*)'/gmi)

      let searchValue = informationArguments[0].replace(/["']/g, "")
      let informationType = informationArguments[1]

      // message, search value, type of information (optional)
      // requests.getWikipediaShortInformation(message, searchValue)
    }

  }
}