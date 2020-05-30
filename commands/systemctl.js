const Util = require('../modules/util')
const Logger = new Util.Logger();
const Keyv = require('keyv');
const prefixcache = new Keyv('sqlite://modules/data/prefixes.sqlite')
const Discord = require('discord.js')


function embedder(desc) {
    const embed = new Discord.MessageEmbed()
    .setTitle("Wikipedia Bot Settings")
    .setDescription(desc)
    .setColor("BLUE")
    return embed
}



/**
 * Command: systemctl/config
 * Description: shows the current settings ans allows to set a new prefix
 * */

module.exports = {
	name: 'systemctl',
	alias: ['config'],
	description: 'Displays your current settings and allows you to update your settings.',
	async execute(message, args, config) {
        
        if (args[1] === "view") {
            // show current prefix here
            let p = await prefixcache.get(message.guild.id)
            if (p) {
                let thisprefix = p
                message.channel.send(embedder(`Your current prefix is: \`${thisprefix}\`\n\nChange it by using the \`${thisprefix}systemctl set\` command.`))
            } else {
                message.channel.send(embedder(`Your current prefix is: \`${config.PREFIx}\`\n\nChange it by using the \`${config.PREFIx}systemctl set\` command.`))
            }


        } else if (args[1] === "set") {
            // set prefix to db here
            if (!args[2]) return message.channel.send(embedder(`You didnt provide a new prefix. Please use the command like this: \n> \`systemctl set $\` -> sets \`$\` as your new prefix.`))

            await prefixcache.set(message.guild.id, args[2])

            message.channel.send(embedder(`Success, I saved \`${args[2]}\` as your new prefix.`))
        } else {
            return message.channel.send(embedder(`This command offers the following subcommands: \n> ${config.PREFIx}config view | Shows your current prefix. \n> ${config.PREFIx}config set <NEWPREFIX> | Change your prefix.`))
        }


	},
}