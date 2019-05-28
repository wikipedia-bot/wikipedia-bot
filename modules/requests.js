/**
 * @fileoverview Module with functions to request data from a page or an API.
 * @version 1.0.0
 * */

// Modules needed for requests
const got = require('got')
const Util = require('./util')
const wiki = require('wikijs').default
const _ = require('lodash')
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
exports.getWikipediaReferences = (msg, search, range="all") => {
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

    // What to do when a number is not in the allowed range
    if((minRange < 0 || maxRange < 1) && minRange!==maxRange){
      minRange = 0
      maxRange = 1
      msg.reply("you can't set the minimum range under or equal 0 and the maximum range under 2.")
    }


    console.log(search, ranges, minRange, maxRange)

    // Search for the results
    wiki().search(search).then(data => {
      // Getting the first result of the search results
      // TODO: Find a way to handle disambiguation pages
      let bestResult = data.results[0]
      wiki().page(bestResult).then(page => {

        // page.references().then(console.log)

      }).catch(e => {
        Util.log("An error occurred while requesting the sources from a Wikipedia article", ` Searched for: ${search} - Best Result: ${bestResult}`, 1)
        Util.betterError(msg, e)
      })
    }).catch(e => {
      Util.log("An error occurred while requesting the sources from a Wikipedia article", `Searched for: ${search} - Best Result: failed to do that`, 1)
      Util.betterError(msg, e)
    })

  }else{

    console.log(search, range)

  }
}