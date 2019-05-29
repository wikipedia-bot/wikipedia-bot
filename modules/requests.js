/**
 * @fileoverview Module with functions to request data from a page or an API.
 * @version 1.0.0
 * */

// Modules needed for requests
const got = require('got')
const Util = require('./util')
const wiki = require('wikijs').default
const _ = require('lodash')
const cheerio = require('cheerio')

const request = require('request')
const rp = require('request-promise')

var {PREFIX, VERSION, TOKEN, DEVELOPMENT, DISCORDBOTS_TOKEN} = require('./../config')

/**
 * Function which gets data from Wikipedia to send a short summary into the channel.
 *
 * @param {Message} msg - Message class of Discord.js
 * @param {String} argument - Argument sent by the user (!wiki [argument])
 *
 * */
exports.getWikipediaShortSummary = (msg, argument) => {

  wiki().search(argument).then(data => {
    // Getting the first result of the search results
    // TODO: Find a way to handle disambiguation pages
    let bestResult = data.results[0]
    // Getting the summary of the first result's page
    wiki().page(bestResult).then(page => {
      page.summary().then(summary => {
        // Shorten the summary to 768 chars...
        let shortedSummary = summary.split('\n')
        shortedSummary = _.take(shortedSummary, 2)
        shortedSummary = shortedSummary.toString().substring(0,768) + "..."
        // Getting the image of the page
        // TODO: Get the real (svg) thumbnail from some pages
        page.mainImage().then(image => {
          msg.channel.send({
            embed: {
              color: 3447003,
              author: {
                icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
                name: 'Wikipedia'
              },
              thumbnail: {
                url: image
              },
              title: bestResult,
              url: page.raw.fullurl,
              description: shortedSummary,
              timestamp: new Date(),
              footer: {
                icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
                text: 'Information by Wikipedia. wikipedia.org'
              }
            }
          })
        }).catch(e => {
          // TODO: User should get a reply when an error is occuring!
          Util.log("An error occurred while requesting the data from Wikipedia", `page.mainImage() - Searched for: ${argument} - Best Result: ${bestResult}` , 1)
          Util.betterError(msg, e)
        })
      })
    }).catch(e => {
      Util.log("An error occurred while requesting the data from Wikipedia", `page.mainImage() - Searched for: ${argument} - Best Result: ${bestResult}`, 1)
      Util.betterError(msg, e)
    })
  }).catch(e => {
    Util.log("An error occurred while requesting the data from Wikipedia", `page.mainImage() - Searched for: ${argument} - Best Result: failed to do that`, 1)
    Util.betterError(msg, e)
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
    let bestResult = data.results[0]
    wiki().page(bestResult).then(page => {

      page.fullInfo().then(info => console.log(info))

    }).catch(e => {
      Util.log("An error occurred while requesting the data from Wikipedia", ` Searched for: ${argument} - Best Result: ${bestResult}`, 1)
      Util.betterError(msg, e)
    })
  }).catch(e => {
    Util.log("An error occurred while requesting the data from Wikipedia", `Searched for: ${argument} - Best Result: failed to do that`, 1)
    Util.betterError(msg, e)
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
exports.getWikipediaReferences = async (msg, search, range="all") => {
  // check if a range was given
  if(range !== "all"){
    // split range into min and max range
    let ranges = _.split(range, "-")
    let minRange = _.toNumber(ranges[0]) - 1
    let maxRange = _.toNumber(ranges[1]) - 1

    // If no maximum range was given but just one number, then the user should get only the specific reference
    if (_.isNaN(maxRange)) {
      // Set maxRange to the single number
      maxRange = minRange
    }

    // TODO: SET MAX RANGE DISTANCE TO 25!!!
    // TODO: Check for the amount of references which can be accessed!

    // What to do when a number is not in the allowed range
    if((minRange < 0 || maxRange < 1) && minRange!==maxRange){
      minRange = 0
      maxRange = 1
      msg.reply("you can't set the minimum range under or equal 0 and the maximum range under 2.")
    }

    // "debugging" :D
    console.log(search, ranges, minRange, maxRange)

    // Search for the results
    wiki().search(search).then(data => {
      // Getting the first result of the search results
      // TODO: Find a way to handle disambiguation pages
      let bestResult = data.results[0]
      wiki().page(bestResult).then(page => {

        // Getting the references / sources of a Wikipedia article with WikiJS
        page.references().then( async references => {

          let referencesAmount = references.length

          // Check if the range numbers are the same
          if (minRange === maxRange) {
            let sources = references[minRange]
            // console.log(sources)

            if (sources !== undefined) {
              // Sending an embed with the reference the user wanted
              msg.channel.send({
                embed: {
                  color: 3447003,
                  author: {
                    icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
                    name: 'Wikipedia'
                  },
                  title: `References of ${search}`,
                  timestamp: new Date(),
                  fields: [
                    {
                      name: `Reference ${minRange + 1}`,
                      value: sources
                    }
                  ]
                }
              })
            } else {
              msg.channel.send({
                embed: {
                  color: 3447003,
                  author: {
                    icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
                    name: 'Wikipedia'
                  },
                  title: `References of ${bestResult}`,
                  timestamp: new Date(),
                  description: `Cannot send any information because the given reference number is not valid. (Max references for *${search}:* **${referencesAmount}**)`
                }
              })
            }

          } else {
            // if not, then get the sources the user want with his given range..
            let sources = references.slice(minRange, maxRange + 1)

            // Create an array as the value for the embed fields key
            let sourcesSendToUser = [];

            // Since it takes some time to create the array, just let the user know the bot is working with starting the 'type' thing
            msg.channel.startTyping();

            // for loop for every reference
            for (let i = 0; i < sources.length; i++) {

              // getting the title of any reference
              await this.parseTitleFromWebsite(sources[i]).then(($) => {
                // add the data to the array which will be then send to the user
                sourcesSendToUser[i] = {
                  name: `Reference ${minRange + i + 1}`,
                  value: `${$('title').text()}\n${sources[i]}`
                }
              }).catch(err => {
                // any errors?
                Util.betterError(msg, err)
              })

            }

            // Sending an embed with all the sources the user wanted
            msg.channel.send({
              embed: {
                color: 3447003,
                author: {
                  icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
                  name: 'Wikipedia'
                },
                title: `References of ${bestResult}`,
                timestamp: new Date(),
                fields: sourcesSendToUser
              }
            })

            msg.channel.stopTyping();

          }

        }).catch(e => {
          Util.log("[3] An error occurred while requesting the sources from a Wikipedia article", ` Searched for: ${search} - Best Result: ${bestResult}`, 1)
          Util.betterError(msg, e)

          // Error handling 101
          msg.reply("sorry, an error occurrred while trying to execute your command. Please check your spelling or try another keyword.")
        })

      }).catch(e => {
        Util.log("[2] An error occurred before requesting the sources from a Wikipedia article while getting the page content",
          ` Searched for: ${search} - Best Result: ${bestResult}`, 1)
        Util.betterError(msg, e)

        // Error handling 101
        msg.reply("sorry, an error occurrred while trying to execute your command. Please check your spelling or try another keyword.")
      })
    }).catch(e => {
      Util.log("[1] An error occurred before requesting the sources from a Wikipedia article while searching for the article the user wanted",
        `Searched for: ${search} - Best Result: failed to do that`, 1)
      Util.betterError(msg, e)

      // Error handling 101
      msg.reply("sorry, an error occurrred while trying to execute your command. Please check your spelling or try another keyword.")
    })

  }else{
    let formattedURI = "https://en.wikipedia.org/wiki/" + search.replace(" ", "_") + "#References"
    msg.reply("here is a full list of all references to your keyword: " + formattedURI)
  }
}

/**
 * Get data from a web page. Yeah, that's everything...
 *
 * @param {String} uri - URI from a website of your choice.
 * @since 1.4 (development version)
 * */
exports.parseTitleFromWebsite = (uri) => {

  let options = {
    uri: uri,
    transform: function (body) {
      return cheerio.load(body)
    }
  }
  // Do the request!
  return rp(options)

}