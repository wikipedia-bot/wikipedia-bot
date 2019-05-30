// TODO: wiki-sources, sources or references as the command name?

const Util = require('./../modules/util')
const requests = require('./../modules/requests')

/**
 * Command: sources
 * Description: Sends you a full list of all sources of a Wikipedia article
 * */
module.exports = {
  name: 'sources',
  description: 'Sends you a full list of all sources of a Wikipedia article',
  execute(message, args, config){
    // Log the command
    // Check in what type of channel the command was executed
    if(message.channel.type === "dm" || message.channel.type === "group"){
      // If it was in a dm or in a group dm, then log only that it was used in a DM channel without logging anything related to the user.
      Util.log(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
    }else{
      // If it was in a dm or in a group dm, then log only that it was used in a DM channel without logging anything related to the user.
      Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)
    }

    if(!args[1]){

      // Send an embed which explains this command
      message.channel.send({
        embed: {
          color: 3447003,
          author: {
            icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
            name: 'Wikipedia'
          },
          title: `Sources Command 101`,
          timestamp: new Date(),
          description: "This helps to understand how this command works.",
          fields: [
            {
              name: "Generally the command works like this:",
              value: '`' + config.PREFIX + this.name + ' "<search argument>" <range>` \n\n' +
                '**Example:** ' + '`' + config.PREFIX + this.name + ' "Elon Musk" 1-5`\n ' +
                'You give a search term and a specific range from which \nto which reference you want to get the link of.'
            },
            {
              name: "\nYou can also get some information about the references\nof a Wikipedia article with setting range to *info*",
              value: '**Example:** ' + '`' + config.PREFIX + this.name + ' "Elon Musk" info`\n '
            },
            {
              name: "\nIf you leave the range empty or write *all* as the range, \nyou'll get the link to the Wikipedia article references",
              value: '**Example:** ' + '`' + config.PREFIX + this.name + ' "Elon Musk" all`\n '
            }
          ]
        }
      })

    }else {
      // Get the command arguments
      let commandArgs = message.content.replace(`${config.PREFIX}${this.name} `, "")
      // https://regex101.com/r/qa3KxQ/1/ and https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
      commandArgs = commandArgs.match(/[^\s"']+|"([^"]*)"+|'([^']*)'/gmi)

      // Search value -> "search"
      let searchValue = commandArgs[0].replace(/["']/g, "")
      // Range -> e.g.: 1-30 or 30-40 or all
      let range = commandArgs[1]

      // Do the request!
      requests.getWikipediaReferences(message, searchValue, range)
    }

  }
}