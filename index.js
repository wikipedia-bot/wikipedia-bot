// Startup file
const { ShardingManager } = require('discord.js')
const { TOKEN, DISCORDBOTS_TOKEN } = require('./config')

// Manager
const manager = new ShardingManager('./bot.js', { totalShards: 'auto', token: TOKEN })

// Logger
const Util = require('./modules/util')
const Logger = new Util.Logger()

// top.gg AutoPoster
const AutoPoster = require('topgg-autoposter')
// eslint-disable-next-line no-unused-vars
const poster = AutoPoster(DISCORDBOTS_TOKEN, manager)

// Spawning
manager.on('shardCreate', shard => Logger.info(`Launched shard ${shard.id}!`))
manager.spawn().catch(console.error)
