/**
 * @fileoverview Collection of functions to make the project development and features easier.
 * */

const colors = require('colors')

colors.setTheme({
  info: 'green',
  data: 'gray',
  warn: 'yellow',
  error: 'red',
  debug: 'cyan',
})

/**
 * Returns a rounded number.
 *
 * @param value - The number you want to round.
 * @param precision - Precision of the decimal number.
 * @since masterAfter-1.3
 *
 * @private
 */
// Thanks Billy Moon for giving the answer how to make a more precise round function: https://stackoverflow.com/a/7343013
exports.roundNumber = (/** Number */ value, /** Integer */ precision) => {
  let multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Returns a formatted time string with a millisecond timestamp.
 *
 * @param date - The Date() Object.
 * @since 1.0.0
 *
 * @public
 */
exports.getDate = function (/** Date */date) {
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + " " + hours + ":" + minutes + ":" + seconds
}

/**
 * Better solution for logging Discord-related errors
 *
 * @param msg - Message object
 * @param text - Text which should be sent in the console
 * @since master
 *
 * @public
 *
 */
exports.betterError = (/**Message*/msg, /**String*/text) => {
  console.log(`[${this.getDate(new Date())}] (${msg.guild.name} | ${msg.guild.id}) [ERROR] -> ${text}`.error)
}

// TODO: Creating a function which logs normal information for checking if everything runs good and
//  for logging errors which are not related to Discord but e.g. to requests.

// Beginning of such an normal information log
exports.log = (/**String*/text, optionalInput = "info log", type = 0) => {

  // Types:
  // 0 - information
  // 1 - warning
  // err - error -> use Util.betterError
  // 2 - debug

  switch (type) {
    case 0:
      console.log(`[INFO] [${this.getDate(new Date())}] (${optionalInput}) -> ${text}`.info)
      break
    case 1:
      console.log(`[WARN] [${this.getDate(new Date())}] (${optionalInput}) -> ${text}`.warn)
      break
    case 2:
      console.log(`[DEBUG] [${this.getDate(new Date())}] (${optionalInput}) -> ${text}`.debug)
      break
    case "err":
      console.log(`[ERR] [${this.getDate(new Date())}] (${optionalInput}) -> ${text}`.error)
      break
    default:
      console.log(`[??] [${this.getDate(new Date())}] (${optionalInput}) -> ${text}`)
  }


}