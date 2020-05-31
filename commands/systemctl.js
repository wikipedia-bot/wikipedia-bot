const Util = require('../modules/util')
const Logger = new Util.Logger();
const Keyv = require('keyv');
const prefixcache = new Keyv('sqlite://data/prefixes.sqlite')
const Discord = require('discord.js')


function embedder(desc) {
    return new Discord.MessageEmbed()
        .setTitle('Wikipedia Bot Settings')
        .setDescription(desc)
        .setColor('BLUE')
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
        // eslint-disable-next-line no-mixed-spaces-and-tabs

        Logger.info(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id}; ${message.guild.memberCount} users).`)

        // eslint-disable-next-line no-mixed-spaces-and-tabs
        if (args[1] === 'view') {
            // show current prefix here
            const p = await prefixcache.get(message.guild.id)
            if (p) {
                await message.channel.send(embedder(`Your current prefix is: \`${p}\`\n\nChange it by using the \`${p}systemctl set\` command.`))
            }
            else {
                await message.channel.send(embedder(`Your current prefix is: \`${config.PREFIX}\`\n\nChange it by using the \`${config.PREFIX}systemctl set\` command.`))
            }


        }
        else if (args[1] === 'set') {
            // set prefix to db here
            if (!args[2]) return message.channel.send(embedder('You didnt provide a new prefix. Please use the command like this: \n> `systemctl set $` -> sets `$` as your new prefix.'))

            await prefixcache.set(message.guild.id, args[2])
            await message.channel.send(embedder(`Success, I saved \`${args[2]}\` as your new prefix.`))
            Logger.info(`${config.PREFIX + this.name} used on ${message.guild.name} (${message.guild.id}; ${message.guild.memberCount} users)`)
        }
        else {
            return message.channel.send(embedder(`This command offers the following subcommands: \n> ${config.PREFIX}config view | Shows your current prefix. \n> ${config.PREFIX}config set <NEWPREFIX> | Change your prefix.`))
        }


    },
}
