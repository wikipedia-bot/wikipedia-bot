// Startup file
const { ShardingManager } = require('discord.js')
const { TOKEN } = require('./config')
// Manager
const manager = new ShardingManager('./bot.js', { token: TOKEN })
// Logger
const Util = require('./modules/util')
const Logger = new Util.Logger()

// Spawning
manager.on('shardCreate', shard => Logger.info(`Launched shard ${shard.id}!`))
manager.spawn().catch(console.error)
