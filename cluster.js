// Startup file
const Cluster = require('discord-hybrid-sharding')
require('dotenv').config()

// Manager
const manager = new Cluster.Manager('./bot.js', { totalShards: 'auto', token: process.env.DISCORD_TOKEN })

// Logger
const Util = require('./modules/util')
const Logger = new Util.Logger()

// Spawning
manager.on('clusterCreate', cluster => Logger.info(`Launched Cluster ${cluster.id}!`))
manager.spawn(undefined, undefined, -1).catch(console.error)
