/**
 * @fileoverview Module with functions to request data from a page or an API.
 * @version 1.0.0
 * */

// Modules needed for requests
const got = require('got')

/**
 * Function which gets data from Wikipedia to send a short summary into the channel.
 *
 * @param {Message} message - Message class of Discord.js
 * @param {String} argument - Argument sent by the user (!wiki [argument])
 *
 * */
exports.getWikipediaShortSummary = (message, argument) => {

  got("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=" + argument).then(res => {
    console.log(res)
  })

}