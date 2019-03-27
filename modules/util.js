/**
 * @fileoverview Collection of functions to make the project development and features easier.
 * */

const colors = require('colors')
const dateTime = require('date-time')

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
  console.log(`[${dateTime({local: true, showTimeZone: true})}] (${msg.guild.name} | ${msg.guild.id}) [ERROR] -> ${text}`.error)
}

// TODO: Creating a function which logs normal information for checking if everything runs good and
//  for logging errors which are not related to Discord but e.g. to requests.

// Beginning of such an normal information log
exports.log = (/**String*/text, optionalInput = "info log", type = 0, logInFile=false) => {

  // Types:
  // 0 - information
  // 1 - warning
  // err - error -> use Util.betterError
  // 2 - debug

  switch (type) {
    case 0:
      console.log(`[INFO] [${dateTime({local: true, showTimeZone: true})}] (${optionalInput}) -> ${text}`.info)
      break
    case 1:
      console.log(`[WARN] [${dateTime({local: true, showTimeZone: true})}] (${optionalInput}) -> ${text}`.warn)
      break
    case 2:
      console.log(`[DEBUG] [${dateTime({local: true, showTimeZone: true})}] (${optionalInput}) -> ${text}`.debug)
      break
    case "err":
      console.log(`[ERR] [${dateTime({local: true, showTimeZone: true})}] (${optionalInput}) -> ${text}`.error)
      break
    default:
      console.log(`[??] [${dateTime({local: true, showTimeZone: true})}] (${optionalInput}) -> ${text}`)
  }


}