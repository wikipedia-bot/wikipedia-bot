/**
 * @fileoverview Module with functions to request data from a page or an API.
 * @version 1.0.0
 * */

// Modules needed for requests
const Util = require('./util')
const wiki = require('wikijs').default
const _ = require('lodash')
const cheerio = require('cheerio')

const rp = require('request-promise')
const Logger = new Util.Logger()

// All languages supported by the bot.
// Before adding any additional API URLs, add an alias for this new language in commands/wiki.js.
const apiUrl = {
	'de': 'https://de.wikipedia.org/w/api.php',
	'en': 'https://en.wikipedia.org/w/api.php',
	'es': 'https://es.wikipedia.org/w/api.php',
	'fr': 'https://fr.wikipedia.org/w/api.php',
	'ru': 'https://ru.wikipedia.org/w/api.php',
	'sl': 'https://sl.wikipedia.org/w/api.php',
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
				text: 'Content by wikipedia.org - Do you like the bot? Please use !vote to vote or !donate to donate',
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

		// TODO: SET A MAXIMUM RANGE!!

		// What to do when a number is not in the allowed range
		if((minRange < 0 || maxRange < 1) && minRange !== maxRange && range !== 'info') {
			minRange = 0
			maxRange = 1
			msg.reply('you can\'t set the minimum range under or equal 0 and the maximum range under 2.')
		}

		// Search for the results
		wiki().search(search).then(data => {
			// Getting the first result of the search results
			const bestResult = data.results[0]
			wiki().page(bestResult).then(page => {

				// Getting the references / sources of a Wikipedia article with WikiJS
				page.references().then(async references => {

					// How many references exists?
					const referencesAmount = references.length

					// If range is equal to "info" then just send the information, how many references exists for this Wikipedia article
					if(ranges[0] === 'info') {
						// Sending a link to the reference list of the wikipedia Article
						const formattedURI = 'https://en.wikipedia.org/wiki/' + search.replace(' ', '_') + '#References'

						// Sending an embed with the reference the user wanted
						msg.channel.send({
							embed: {
								color: 3447003,
								author: {
									icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
									name: 'Wikipedia',
								},
								title: `References of ${bestResult} - Check out this list: ${formattedURI}`,
								timestamp: new Date(),
								description: `There are a total of ${referencesAmount} references for the Wikipedia article about ${bestResult}.`,
							},
						})
						return;
					}

					// Check if the range numbers are the same
					if (minRange === maxRange) {
						// Since it takes some time to create the array, just let the user know the bot is working with starting the 'type' thing
						msg.channel.startTyping();

						const source = references[minRange]
						// console.log(sources)

						if (source !== undefined) {
							const sourceToUser = []

							// getting the title of the reference
							await this.parseTitleFromWebsite(source).then(($) => {
								// add the data to the array which will be then send to the user
								sourceToUser[0] = {
									name: `Reference ${minRange + 1}`,
									value: `${$('title').text()}\n${source}`,
								}
							}).catch(err => {
								if(err.statusCode) {
									Logger.error(`References command: ${err.name} ${err.statusCode} Error while trying to access: ${source}`)
								}
								else{
									Logger.errorChat(msg, err)
								}

								sourceToUser[0] = {
									name: `Reference ${minRange + 1}`,
									value: `*Cannot get the title from the page...*\n${source}`,
								}

							})

							// Sending an embed with the reference the user wanted
							msg.channel.send({
								embed: {
									color: 3447003,
									author: {
										icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
										name: 'Wikipedia',
									},
									title: `References of ${bestResult}`,
									timestamp: new Date(),
									fields: sourceToUser,
								},
							})

							// Then we should stop typing since we do nothing lol
							msg.channel.stopTyping();

						}
						else {
							msg.channel.send({
								embed: {
									color: 3447003,
									author: {
										icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
										name: 'Wikipedia',
									},
									title: `References of ${bestResult}`,
									timestamp: new Date(),
									description: `Cannot send any information because the given reference number is not valid. (Max references for *${search}:* **${referencesAmount}**)`,
								},
							})
						}

					}
					else {
						// if not, then get the sources the user want with his given range..
						const sources = references.slice(minRange, maxRange + 1)

						// Create an array as the value for the embed fields key
						const sourcesSendToUser = [];

						// Since it takes some time to create the array, just let the user know the bot is working with starting the 'type' thing
						await msg.channel.startTyping();

						// for loop for every reference
						for (let i = 0; i < sources.length; i++) {

							// getting the title of any reference
							await this.parseTitleFromWebsite(sources[i]).then(($) => {
								// add the data to the array which will be then send to the user
								sourcesSendToUser[i] = {
									name: `Reference ${minRange + i + 1}`,
									value: `${$('title').text()}\n${sources[i]}`,
								}
							}).catch(err => {
								// any errors?
								if(err.statusCode) {
									Logger.error(`References command: ${err.name} ${err.statusCode} Error while trying to access: ${sources[i]}`)
								}
								else{
									Logger.errorChat(msg, err)
								}

								// Write into the embed field value that there was an error
								sourcesSendToUser[i] = {
									name: `Reference ${minRange + i + 1}`,
									value: `*Cannot get the title from the page...*\n${sources[i]}`,
								}

							})

						}

						// Sending an embed with all the sources the user wanted
						msg.channel.send({
							embed: {
								color: 3447003,
								author: {
									icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
									name: 'Wikipedia',
								},
								title: `References of ${bestResult}`,
								timestamp: new Date(),
								fields: sourcesSendToUser,
							},
						})

						// Then we should stop typing since we do nothing lol
						msg.channel.stopTyping();

					}

				}).catch(e => {
					Logger.error(`[3] References command: An error occurred while requesting references from a Wikipedia - Searched for: '${search}' - Best Result: '${bestResult}'`)
					Logger.errorChat(msg, e)
					msg.reply('sorry, an error occurred while trying to execute your command. Please check your spelling or try another keyword.')
				})

			}).catch(e => {
				Logger.error(`[2] References command: An error occurred while getting the page content from a Wikipedia - Searched for: '${search}' - Best Result: '${bestResult}'`)
				Logger.errorChat(msg, e)
				msg.reply('sorry, an error occurred while trying to execute your command. Please check your spelling or try another keyword.')
			})
		}).catch(e => {
			Logger.error(`[1] References command: An error occurred while searching for '${search}'`)
			Logger.errorChat(msg, e)
			msg.reply('sorry, an error occurred while trying to execute your command. Please check your spelling or try another keyword.')
		})

	}
	else{
		// Sending a link to the reference list of the wikipedia Article
		const formattedURI = 'https://en.wikipedia.org/wiki/' + search.replace(' ', '_') + '#References'
		msg.channel.send({
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

/**
 * Get data from a web page. Yeah, that's everything...
 *
 * @param {String} uri - URI from a website of your choice.
 * @since 1.4 (development version)
 * */
exports.parseTitleFromWebsite = (uri) => {

	const options = {
		uri: uri,
		transform: function(body) {
			return cheerio.load(body)
		},
	}
	// Do the request!
	return rp(options)

}