const Util = require('./../modules/util')
const requests = require('./../modules/requests')

/**
 * Command: wiki
 * Description: The normal wiki command used for getting short summaries of something the user searched for.
 * */
module.exports = {
	name: 'wiki',
	alias: ['wiki-de', 'wiki-es', 'wiki-fr', 'wiki-ru', 'wiki-sl'],
	description: 'Search something on Wikipedia with this command and get a short summary of it.',
	execute(message, args, config) {

		const command = args[0].slice(config.PREFIX.length)

		let requestLang = 'en';
		// Checking if the main command was used.
		// When not, it will check what language you want to use.
		// Otherwise, it will just skip the for loop.
		if(command !== this.name) {
			for (const lang of this.alias) {
				if (command === lang) {
					requestLang = lang.replace('wiki-', '')
				}
			}
		}

		// Check in what type of channel the command was executed
		if(message.channel.type === 'dm' || message.channel.type === 'group') {
			// If it was in a dm or in a group dm, then log only that it was used in a DM channel without logging anything related to the user.
			Util.log(`${config.PREFIX + command} (args: [${args}]) used in a private ${message.channel.type}.`, 'Feature: Wiki cmd')
		}
		else{
			// If it was somewhere else, then log normally like before.
			Util.log(`${config.PREFIX + command} (args: [${args}]) used on ${message.guild.name} (${message.guild.id})`, 'Feature: Wiki cmd')
		}

		if (!args[1]) {
			message.react('👎').catch((e) => {
				Util.log(`Wiki Command -> !args[0] -> message.react -> catch e: ${e}`, `${message.guild.name} (${message.guild.id})`, 'err')
			})
			message.reply('you forgot to search for something. -> \n``' + config.PREFIX + command + ' [topic] | Example ' + config.PREFIX + 'wiki Rocket League``')
		}
		else {
			let searchValue = args.toString().replace(/,/g, ' ')
			searchValue = searchValue.replace(config.PREFIX + command + ' ', '')
			// console.log('search value -> ' + searchValue)
			// searchValue = _.startCase(searchValue)
			// console.log('search value -> ' + searchValue)

			// console.log('search value: ' + searchValue)
			requests.getWikipediaShortSummary(message, searchValue, requestLang)
		}

	},
}