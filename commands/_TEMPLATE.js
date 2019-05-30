// Any module required will be written up here
const Util = require("./../modules/util")

/**
 * Command: NAME
 * Description: DESCRIPTION
 * */
module.exports = {
  name: 'NAME',
  description: 'DESCRIPTION',
  execute(message, args, config){
    Util.log(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id})`)

    // Your command...
  }
}