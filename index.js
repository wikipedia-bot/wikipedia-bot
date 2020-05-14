const { ShardingManager } = require('discord.js')
const { TOKEN } = require('./config')
const manager = new ShardingManager('./bot.js', { token: TOKEN })
const Util = require('./modules/util')
const Logger = new Util.Logger()

manager.spawn()
manager.on('shardCreate', shard => Logger.info(`Launched shard ${shard.id}!`))