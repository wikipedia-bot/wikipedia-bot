// Startup file
const { ShardingManager } = require('discord.js')
require('dotenv').config()

// Manager
const manager = new ShardingManager('./bot.js', { totalShards: 'auto', token: process.env.DISCORD_TOKEN })

// Logger
const Util = require('./modules/util')
const Logger = new Util.Logger()

// top.gg AutoPoster
const AutoPoster = require('topgg-autoposter')
// eslint-disable-next-line no-unused-vars
if (process.env.NODE_ENV === 'production') {
	const poster = AutoPoster(process.env.TOPGG_TOKEN, manager)
}

// Spawning
manager.on('shardCreate', shard => Logger.info(`Launched shard ${shard.id}!`))
manager.spawn().catch(console.error)
