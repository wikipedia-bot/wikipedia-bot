/**
 * @fileoverview Module with functions to request data from a page or an API.
 * @version 1.0.0
 * */

// Modules needed for requests
const got = require('got')
const Util = require('./util')

/**
 * Function which gets data from Wikipedia to send a short summary into the channel.
 *
 * @param {Message} msg - Message class of Discord.js
 * @param {String} argument - Argument sent by the user (!wiki [argument])
 *
 * */
exports.getWikipediaShortSummary = (msg, argument) => {

  // Beginning with the sequence of requests for the wikipedia article
  got("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&exsentences=2&titles=" + argument).then(res => {
    try {
      let pageContent = JSON.parse(res.body).query.pages
      let keys = Object.keys(pageContent)

      let summary

      // Replacing all HTML Tags included in the text
      summary = pageContent[keys[0]].extract.replace(/<(?:.|\n)*?>/gm, '')

      // HTTPS Request for receiving the URL of the article by giving the page ID as the value for the pageids parameter in the API request to Wikipedia
      got('https://en.wikipedia.org/w/api.php?action=query&prop=info&format=json&inprop=url&pageids=' + pageContent[keys[0]].pageid).then(pageres => {
        try {
          // JSON data of the page with the page id pageid
          let pageObject = JSON.parse(pageres.body).query.pages

          let key = Object.keys(pageObject)

          // Get the value of the fullurl parameter
          let wikipediaArticleLink = pageObject[key[0]].fullurl

          // console.log(pageObject)

          // Finalizing the result and now requesting the thumbnail of the wikipedia article by the Media Wikipedia API.
          got("https://en.wikipedia.org/api/rest_v1/page/media/" + argument).then(res => {
            try {

              let mediaJSON = JSON.parse(res.body).items[0]
              let thumbnailSource = mediaJSON.thumbnail.source

              // console.log(mediaJSON)

              // Sending the final result of the two requests as an embed to the channel where the command
              // was executed.
              msg.channel.send({
                embed: {
                  color: 3447003,
                  author: {
                    icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
                    name: 'Wikipedia'
                  },
                  title: pageContent[keys[0]].title + ' (wikipedia article)',
                  url: wikipediaArticleLink,
                  description: summary,
                  timestamp: new Date(),
                  thumbnail: {
                    url: thumbnailSource
                  },
                  footer: {
                    icon_url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
                    text: 'Information by Wikipedia. wikipedia.org'
                  }
                }
              })

            }catch (e) {
              msg.react('⛔')
              msg.channel.send(
                'You got a very rare error here, how did you get that? Write it to our GitHub Repository\n' +
                'https://github.com/julianYaman/wikipedia-bot')
              Util.betterError(msg, e)
            }

          })
        } catch (e) {
          msg.react('⛔')
          msg.channel.send(
            'You got a very rare error here, how did you get that? Write it to our GitHub Repository\n' +
            'https://github.com/julianYaman/wikipedia-bot')
          Util.betterError(msg, e)
        }
      })
    } catch (e) {
      msg.react('⛔')
      msg.channel.send(
        'Cannot get data from Wikipedia. Maybe your search term was not properly. If you did nothing wrong, write the command `!issue`.\n' +
        '```You´ve sent the value: ' + argument + '```')
      Util.betterError(msg, e)
    }
  }).catch(error => {
    console.log(error.response.body)
  })

}