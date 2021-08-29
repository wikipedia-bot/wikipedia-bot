const Util = require('./../modules/util')
const Logger = new Util.Logger();
const requests = require('./../modules/requests')
const Topgg = require('@top-gg/sdk')

const topgg_api = new Topgg.Api(process.env.TOPGG_TOKEN)
const translations = require('./../translations.json')

/**
 * Command: wiki
 * Description: The normal wiki command used for getting short summaries of something the user searched for.
 * */
module.exports = {
	name: 'wiki',
	alias: ['wiki-de', 'wiki-es', 'wiki-fr', 'wiki-ru', 'wiki-sl', 'wiki-tr', 'wiki-yi'],
	description: 'Search something on Wikipedia with this command and get a short summary of it.',
	async execute(message, args, config, clusterId) {

		const command = args[0].slice(config.PREFIX.length)

		let requestLang = 'en';
		// Checking if the main command was used.
		// When not, it will check what language you want to use.
		// Otherwise, it will just skip the for loop.
		if (command !== this.name) {
			if (await topgg_api.hasVoted(message.author.id)) {
				for (const lang of this.alias) {
					if (command === lang) {
						requestLang = lang.replace('wiki-', '')
					}
				}
			}
			else {
				for (const lang of this.alias) {
					if (command === lang) {
						requestLang = lang.replace('wiki-', '')
					}
				}

				let embedBody;
				let embedFooter;

				switch (requestLang) {
				case 'de':
					embedBody = translations['wiki_language_command_embed']['de'].embedBody
					embedFooter = translations['wiki_language_command_embed']['de'].embedFooter + ' (Command: ' + config.PREFIX + 'info)'
					break;
				case 'fr':
					embedBody = translations['wiki_language_command_embed']['fr'].embedBody
					embedFooter = translations['wiki_language_command_embed']['fr'].embedFooter + ' (Command: ' + config.PREFIX + 'info)'
					break;
				case 'es':
					embedBody = translations['wiki_language_command_embed']['es'].embedBody
					embedFooter = translations['wiki_language_command_embed']['es'].embedFooter + ' (Command: ' + config.PREFIX + 'info)'
					break;
				case 'ru':
					embedBody = translations['wiki_language_command_embed']['ru'].embedBody
					embedFooter = translations['wiki_language_command_embed']['ru'].embedFooter + ' (Command: ' + config.PREFIX + 'info)'
					break;
				case 'sl':
					embedBody = translations['wiki_language_command_embed']['sl'].embedBody
					embedFooter = translations['wiki_language_command_embed']['sl'].embedFooter + ' (Command: ' + config.PREFIX + 'info)'
					break;
				case 'tr':
					embedBody = translations['wiki_language_command_embed']['tr'].embedBody
					embedFooter = translations['wiki_language_command_embed']['tr'].embedFooter + ' (Command: ' + config.PREFIX + 'info)'
					break;
				case 'yi':
					embedBody = translations['wiki_language_command_embed']['yi'].embedBody
					embedFooter = translations['wiki_language_command_embed']['yi'].embedFooter
					break;
				default:
					embedBody = translations['wiki_language_command_embed']['en'].embedBody
					embedFooter = translations['wiki_language_command_embed']['en'].embedFooter + ' (Command: ' + config.PREFIX + 'info)'
				}

				return await message.channel.send({
					embed: {
						color: 0xe74c3c,
						description: embedBody,
						footer: {
							text: embedFooter,
						},
					},
				})

			}
		}

		Logger.info(`${config.PREFIX + this.name} was used. (Cluster ${clusterId})`)

		if (!args[1]) {
			message.react('👎').catch(e => Logger.error(e))
			await message.channel.send({
				embed: {
					color: 0xe74c3c,
					description: 'It seems like you forgot something!\n' +
						'Please use the command like this:\n\n' +
						'``' + config.PREFIX + command + ' [topic] | Example ' + config.PREFIX + 'wiki Rocket League``',
				},
			})
		}
		else {
			// let searchValue = args.toString().replace(/,/g, ' ')
			// searchValue = searchValue.replace(config.PREFIX + command + ' ', '')
			let searchValue = args.join(' ').slice(config.PREFIX.length + command.length + 1)

			requests.getWikipediaShortSummary(message, searchValue, requestLang).catch(e => Logger.error(e))
		}

	},
}
