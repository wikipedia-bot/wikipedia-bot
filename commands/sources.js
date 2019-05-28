// TODO: wiki-sources, sources or references as the command name?
/**
 * Command: sources
 * Description: Sends you a full list of all sources of a Wikipedia article
 * */
module.exports = {
  name: 'sources',
  description: 'Sends you a full list of all sources of a Wikipedia article',
  execute(message, args, config){

    let commandArgs = message.content.replace(`${config.PREFIX}${this.name} `, "")
    // https://regex101.com/r/qa3KxQ/1/ and https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
    commandArgs = commandArgs.match(/[^\s"']+|"([^"]*)"+|'([^']*)'/gmi)

    // Search value -> "search"
    let searchValue = commandArgs[0].replace(/["']/g, "")
    // Range -> e.g.: 1-30 or 30-40 or all
    let range = commandArgs[1]

  }
}