const Util = require('./../modules/util')
const requests = require('./../modules/requests')

/**
 * Command: wiki-number
 * Description: It helps you to get specific information about a specific topic (e.g. dates, numbers, etc.)
 * */
module.exports = {
	name: 'wiki-info',
	description: 'It helps you to get specific information about a specific topic (e.g. dates, numbers, etc.)',
	execute(message, args, config) {

		// Check in what type of channel the command was executed
		if(message.channel.type === 'dm' || message.channel.type === 'group') {
			// If it was in a dm or in a group dm, then log only that it was used in a DM channel without logging anything related to the user.
			Util.log(`${config.PREFIX + this.name} used in a private ${message.channel.type}.`)
		}
		else{
			// If it was somewhere else, then log normally like before.
			Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)
		}

		// USAGE: !wiki-info [TYPE OF INFORMATION] [ARGUMENT]
		if (!args[1]) {
			message.react('👎').catch((e) => {
				Util.log(`wiki-info Command -> !args[0] -> message.react -> catch e: ${e}`, `${message.guild.name} (${message.guild.id})`, 'err')
			})
			message.reply('you forgot to search for something. -> ``' + config.PREFIX + 'wiki-info [argument] | Example ' + config.PREFIX + 'wiki-info "Rocket League"``')
		}
		else {

			let informationArguments = message.content.replace(`${config.PREFIX}${this.name} `, '')
			// https://regex101.com/r/qa3KxQ/1/ and https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
			informationArguments = informationArguments.match(/[^\s"']+|"([^"]*)"+|'([^']*)'/gmi)

			const searchValue = informationArguments[0].replace(/["']/g, '')
			const informationType = informationArguments[1]

			// message, search value, type of information (optional)
			// requests.getWikipediaShortInformation(message, searchValue)
		}

	},
}