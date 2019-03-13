/**
 * @fileoverview Module with functions to request data from a page or an API.
 * @version 1.0.0
 * */

// Modules needed for requests
const got = require('got')

/**
 * Function which gets data from Wikipedia to send a short summary into the channel.
 *
 * @param {Message} msg - Message class of Discord.js
 * @param {String} argument - Argument sent by the user (!wiki [argument])
 *
 * */
exports.getWikipediaShortSummary = (msg, argument) => {

  got("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=" + argument).then(res => {
    try {
      let pageContent = JSON.parse(res.body).query.pages
      let keys = Object.keys(pageContent)

      let summary

      console.log(pageContent[keys[0]])

      if (pageContent[keys[0]].extract.split('.', 2).length <= 1) {
        summary = 'Click on the Link above to see the Wikipedia article about ' + pageContent[keys[0]].title
      } else {
        // First lines of the Wikipedia article
        summary = pageContent[keys[0]].extract.toString().match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g)

        summary = summary[0] + summary[1]

        // console.log(summary);
        // console.log("-----");
        // let stringSplitting = pageContent[keys[0]].extract.toString().match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);
        // console.log(stringSplitting[0] + stringSplitting[1]);

        // Replacing all HTML Tags included in the text
        summary = summary.replace(/<(?:.|\n)*?>/gm, '')
        console.log(summary)
      }

    }catch (e) {
      console.log(e)
      msg.react('👎').catch((e) => {
        console.log(e)
        // Util.betterError(message, `Wiki Command -> !args[0] -> message.react -> catch e: ${e}`)
      })
    }
  }).catch(error => {
    console.log(error.response.body)
  })

}