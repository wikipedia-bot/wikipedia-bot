/**
 * @fileoverview Module with functions to request data from a page or an API.
 * @version 1.0.0
 * */

// Modules needed for requests
const Util = require('./util')
const wiki = require('wikijs').default
const _ = require('lodash')
const got = require('got')
const cheerio = require('cheerio')

const Logger = new Util.Logger()

// All languages supported by the bot.
// Before adding any additional API URLs, add an alias for this new language in commands/wiki.js.
const apiUrl = {
	// german
	'de': 'https://de.wikipedia.org/w/api.php',
	// english
	'en': 'https://en.wikipedia.org/w/api.php',
	// spanish
	'es': 'https://es.wikipedia.org/w/api.php',
	// french
	'fr': 'https://fr.wikipedia.org/w/api.php',
	// russian
	'ru': 'https://ru.wikipedia.org/w/api.php',
	// slovak
	'sl': 'https://sl.wikipedia.org/w/api.php',
	// turkish
	'tr': 'https://tr.wikipedia.org/w/api.php',
	// yiddish
	'yi': 'https://yi.wikipedia.org/w/api.php',
}

/**
 * Function which gets data from Wikipedia to send a short summary into the channel.
 *
 * @param {Message} msg - Message class of Discord.js
 * @param {String} argument - Argument sent by the user (!wiki [argument])
 * @param {String} lang - Language in which the result should be sent.
 *
 * */
exports.getWikipediaShortSummary = async (msg, argument, lang) => {

	// Get all search result when searching the argument
	const search = await wiki({
		apiUrl: apiUrl[lang],
		headers: {
			'User-Agent': 'wikipedia-bot-requests (https://julianyaman.de; julianyaman@posteo.eu) requests.js',
		},
	}).search(argument)
	// Get the wiki page of the first result
	const wikiPage = await wiki({
		apiUrl: apiUrl[lang],
		headers: {
			'User-Agent': 'wikipedia-bot-requests (https://julianyaman.de; julianyaman@posteo.eu) requests.js',
		},
	}).page(search.results[0]).catch(e => {
		Logger.error(e)
		msg.react('👎').catch(err => Logger.error(err))
		msg.channel.send({
			embed: {
				color: 0xe74c3c,
				description: 'Sorry, there was an error while trying to get the wiki page. ' +
					'Please check your spelling or try another keyword.\n\n' +
					'*Is the command still not working after many attempts?* \n' +
					'*Please write an issue on GitHub or contact us on Discord! **(!info)***',
			},
		})
	})

	// Adding all information into one single array - all requests are now donw
	const results = await Promise.all([
		wikiPage.raw.title,
		wikiPage.raw.fullurl,
		wikiPage.mainImage(),
		wikiPage.summary(),
	])

	// Shorten the summary to 768 chars...
	let shortedSummary = results[3].split('\n')
	shortedSummary = _.take(shortedSummary, 2)
	shortedSummary = shortedSummary.toString().substring(0, 768) + '...'

	// Sending the embed
	await msg.channel.send({
		embed: {
			color: 3447003,
			author: {
				icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
				name: 'Wikipedia',
			},
			thumbnail: {
				url: results[2],
			},
			title: results[0],
			url: results[1],
			description: shortedSummary,
			timestamp: new Date(),
			footer: {
				icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
				text: 'Content by wikipedia.org - Do you like the bot? You can promote the bot with !vote or donate with !donate.',
			},
		},
	})

}

/**
 * Function which gets data from Wikipedia to send a short summary into the channel.
 *
 * @param {Message} msg - Message class of Discord.js
 * @param {String} argument - Argument sent by the user (!wiki-info [info] [argument])
 *
 * */
exports.getWikipediaShortInformation = (msg, argument) => {

	wiki().search(argument).then(data => {
		// Getting the first result of the search results
		// TODO: Find a way to handle disambiguation pages
		const bestResult = data.results[0]
		wiki().page(bestResult).then(page => {

			page.fullInfo().then(info => console.log(info))

		}).catch(e => {
			Logger.error(`[2] An error occurred while requesting the data from Wikipedia - Searched for: '${argument}' - Best Result: '${bestResult}'`)
			Logger.errorChat(msg, e)
			msg.reply('sorry, an error occurred while trying to execute your command. Please check your spelling or try another keyword.')
		})
	}).catch(e => {
		Logger.error(`[1] An error occurred while requesting the data from Wikipedia - Searched for: '${argument}' - no result`)
		Logger.errorChat(msg, e)
		msg.reply('sorry, an error occurred while trying to execute your command. Please check your spelling or try another keyword.')
	})

}

/**
 * Function to get the references of a Wikipedia article
 *
 * @param {Message} msg - Message class of Discord.js
 * @param {String} search - Search value written by the user
 * @param range - The range of how many sources the user want
 *
 * */
exports.getWikipediaReferences = async (msg, search, range = 'all') => {
	// check if a range was given
	if(range !== 'all') {
		// split range into min and max range
		const ranges = _.split(range, '-')
		let minRange = _.toNumber(ranges[0]) - 1
		let maxRange = _.toNumber(ranges[1]) - 1

		// If no maximum range was given but just one number, then the user should get only the specific reference
		if (_.isNaN(maxRange) && range !== 'info') {
			// Set maxRange to the single number
			maxRange = minRange
		}


		// What to do when a number is not in the allowed range
		if((minRange < 0 || maxRange < 1) && minRange !== maxRange && range !== 'info') {
			minRange = 0
			maxRange = 1
			await msg.reply('you can\'t set the minimum range under or equal 0 and the maximum range under 2.')
			return;
		}

		if (maxRange - minRange + 1 > 10) {
			await msg.reply('the maximum amount of references you can get is 10.')
			return;
		}

		const sourceSearch = await wiki({
			headers: {
				'User-Agent': 'wikipedia-bot-ref-req (https://julianyaman.de; julianyaman@posteo.eu) requests.js/ref',
			},
		}).search(search)

		const wikiPageSources = await wiki({
			headers: {
				'User-Agent': 'wikipedia-bot-ref-req (https://julianyaman.de; julianyaman@posteo.eu) requests.js/ref',
			},
		}).page(sourceSearch.results[0]).catch(e => {
			Logger.error(e)
			msg.react('👎👎').catch(err => Logger.error(err))
			msg.channel.send({
				embed: {
					color: 0xe74c3c,
					description: 'Sorry, there was an error while trying to get the wiki page. ' +
						'Please check your spelling or try another keyword.\n\n' +
						'*Is the command still not working after many attempts?* \n' +
						'*Please write an issue on GitHub or contact us on Discord! **(!info)***',
				},
			})
		})

		const sourceResults = await Promise.all([
			wikiPageSources.raw.title,
			wikiPageSources.raw.fullurl,
			wikiPageSources.mainImage(),
			wikiPageSources.references(),
		])

		const referencesAmount = sourceResults[3].length

		if(ranges[0] === 'info') {
			// Sending a link to the reference list of the wikipedia Article
			const formattedURI = 'https://en.wikipedia.org/wiki/' + sourceSearch.results[0].replace(' ', '_') + '#References'

			// Sending an embed with the reference the user wanted
			await msg.channel.send({
				embed: {
					color: 3447003,
					author: {
						icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
						name: 'Wikipedia',
					},
					title: `References of ${sourceSearch.results[0]} - Check out this list: ${formattedURI}`,
					timestamp: new Date(),
					description: `There are a total of ${referencesAmount} references for the Wikipedia article about ${sourceSearch.results[0]}.`,
				},
			})
		}


		// Check if the range numbers are the same
		if (minRange === maxRange) {
			// Since it takes some time to create the array, just let the user know the bot is working with starting the 'type' thing
			msg.channel.startTyping().catch(err => console.error(err));

			const source = sourceResults[3][minRange]
			// console.log(sources)

			if (source !== undefined) {
				const sourceToUser = []

				// getting the title of the reference
				try {
					const response = await got(source)
					// eslint-disable-next-line prefer-const
					let $ = cheerio.load(response.body)
					// eslint-disable-next-line prefer-const
					let title = $('title').text()

					sourceToUser[0] = {
						name: `Reference ${minRange + 1}`,
						value: `${title}\n${source}`,
					}
				}
				catch (err) {
					if(err.statusCode) {
						Logger.error(`References command: ${err} ${err.statusCode} Error while trying to access: ${source}`)
					}
					else{
						Logger.errorChat(msg, err)
					}

					sourceToUser[0] = {
						name: `Reference ${minRange + 1}`,
						value: `*Cannot get the title from the page...*\n${source}`,
					}
				}

				// Sending an embed with the reference the user wanted
				await msg.channel.send({
					embed: {
						color: 3447003,
						author: {
							icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
							name: 'Wikipedia',
						},
						title: `References of ${sourceSearch.results[0]}`,
						timestamp: new Date(),
						fields: sourceToUser,
					},
				})

				// Then we should stop typing since we do nothing lol
				msg.channel.stopTyping();

			}
			else {
				await msg.channel.send({
					embed: {
						color: 3447003,
						author: {
							icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
							name: 'Wikipedia',
						},
						title: `References of ${sourceSearch.results[0]}`,
						timestamp: new Date(),
						description: `Cannot send any information because the given reference number is not valid. (Max references for *${search}:* **${referencesAmount}**)`,
					},
				})
			}

		}
		else {
			// if not, then get the sources the user want with his given range..
			const sources = sourceResults[3].slice(minRange, maxRange + 1)

			// Create an array as the value for the embed fields key
			const sourcesSendToUser = [];

			// Since it takes some time to create the array, just let the user know the bot is working with starting the 'type' thing
			msg.channel.startTyping().catch(err => console.error(err));

			// for loop for every reference
			for (let i = 0; i < sources.length; i++) {

				// getting the title of the reference
				try {
					const response = await got(sources[i])
					// eslint-disable-next-line prefer-const
					let $ = cheerio.load(response.body)
					// eslint-disable-next-line prefer-const
					let title = $('title').text()

					sourcesSendToUser[i] = {
						name: `Reference ${minRange + i + 1}`,
						value: `${title}\n${sources[i]}`,
					}
				}
				catch (err) {
					if(err.statusCode) {
						Logger.error(`References command: ${err} ${err.statusCode} Error while trying to access: ${sources[i]}`)
					}
					else{
						Logger.errorChat(msg, err)
					}

					sourcesSendToUser[i] = {
						name: `Reference ${minRange + i + 1}`,
						value: `*Cannot get the title from the page...*\n${sources[i]}`,
					}
				}


			}

			// Sending an embed with all the sources the user wanted
			await msg.channel.send({
				embed: {
					color: 3447003,
					author: {
						icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
						name: 'Wikipedia',
					},
					title: `References of ${sourceSearch.results[0]}`,
					timestamp: new Date(),
					fields: sourcesSendToUser,
				},
			})

			// Then we should stop typing since we do nothing lol
			msg.channel.stopTyping();

		}
	}
	else{
		// Sending a link to the reference list of the wikipedia Article
		const formattedURI = 'https://en.wikipedia.org/wiki/' + search.replace(' ', '_') + '#References'
		await msg.channel.send({
			embed: {
				color: 3447003,
				author: {
					icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
					name: 'Wikipedia',
				},
				title: `References of ${_.startCase(search)}`,
				timestamp: new Date(),
				description: `${formattedURI}`,
			},
		})
	}
}
