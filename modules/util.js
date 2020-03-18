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
 *
 * @private
 */
// Thanks Billy Moon for giving the answer how to make a more precise round function: https://stackoverflow.com/a/7343013
exports.roundNumber = (/** Number */ value, /** Integer */ precision) => {
	const multiplier = Math.pow(10, precision || 0)
	return Math.round(value * multiplier) / multiplier
}

/**
 * Better solution for logging Discord-related errors
 *
 * @param msg - Message object
 * @param text - Text which should be sent in the console
 *
 * @public
 *
 */
exports.betterError = (/** Message*/msg, /** String*/text) => {
	if(msg.channel.type === 'dm' || msg.channel.type === 'group') {
		// If it was in a dm or in a group dm, then log only that it was used in a DM channel without logging anything related to the user.
		console.log(`[ERR] [${dateTime({ local: true, showTimeZone: true })}] Private Direct Message Channel -> ${text}`.error)
	}
	else{
		// If it was somewhere else, then log normally like before.
		console.log(`[ERR] [${dateTime({ local: true, showTimeZone: true })}] (${msg.guild.name} | ${msg.guild.id}) -> ${text}`.error)
	}
	console.log('Raw error log:'.underline.error)
	console.log(text)
}

// TODO: Creating a function which logs normal information for checking if everything runs good and
//  for logging errors which are not related to Discord but e.g. to requests.

// Beginning of such an normal information log
exports.log = (/** String*/text, optionalInput = 'info', type = 0, rawOutput = undefined) => {

	// Types:
	// 0 - information
	// 1 - warning
	// err - error -> use Util.betterError
	// 2 - debug

	switch (type) {
	case 0:
		console.log(`[INFO] [${dateTime({ local: true, showTimeZone: true })}] (${optionalInput}) -> ${text}`.info)
		break
	case 1:
		console.log(`[WARN] [${dateTime({ local: true, showTimeZone: true })}] (${optionalInput}) -> ${text}`.warn)
		break
	case 2:
		console.log(`[DEBUG] [${dateTime({ local: true, showTimeZone: true })}] (${optionalInput}) -> ${text}`.debug)
		break
	case 'err':
		console.log(`[ERR] [${dateTime({ local: true, showTimeZone: true })}] (${optionalInput}) -> ${text}`.error)
		if(rawOutput !== undefined) {
			console.log(rawOutput)
		}
		break
	default:
		console.log(`[??] [${dateTime({ local: true, showTimeZone: true })}] (${optionalInput}) -> ${text}`)
	}


}