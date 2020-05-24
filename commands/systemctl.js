// Any module required will be written up here
const Util = require('./../modules/util')
const Logger = new Util.Logger();
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://data/guilddata.sqlite')

/**
 * Command: systemctl
 * Description: Central settings command to show and edit your guildsettings.
 * */
module.exports = {
	name: 'systemctl',
	description: 'Central settings command to show and edit your guildsettings.',
	execute(message, args, config) {
        Logger.info(`${config.prefix + this.name} used on ${message.guild.name} (${message.guild.id})`)
        const PREFIX = config.prefix

        if (!args[1]) return message.channel.send(`Wrong usage. Please use the command like this: \`${PREFIX}systemctl view\` to show the current settings for your guild. \nOr use \`${PREFIX}systemctl set prefix <newprefix>\` to change the prefix.`)
        
        if (args[1] === "view") {

            keyv.get(`${message.guild.id}`).then(prefixsetting => {
                
                if (!prefixsetting) {
                    keyv.set(`${message.guild.id}`, `${PREFIX}`)
                    message.channel.send(`Your current prefix is: \`${PREFIX}\``)
                }

                message.channel.send(`Your current prefix is: \`${prefixsetting}\``)
            
            })

           

        } else if (args[1] === "set") {
            if (args[2] !== "prefix") return message.channel.send(`Wrong usage! Use \`${PREFIX}systemctl set prefix <newprefix>\` to change the prefix.`)

            if (!args[3]) return message.channel.send(`Please specify a new prefix for your guild!`)

            // set prefix to db here
            keyv.set(`${message.guild.id}`, `${args[3]}`)

            message.channel.send(`Successfully updated your prefix to \`${args[3]}\`!`)

        }
        
	},
}