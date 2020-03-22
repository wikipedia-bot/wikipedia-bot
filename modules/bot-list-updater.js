const config = require('./../config')
const got = require('got')
const Util = require('./util')
const Logger = new Util.Logger()

exports.BotListUpdater = class {
	constructor() {
		this.DBL = require('dblapi.js')
		this.dbl = new this.DBL(config.DISCORDBOTS_TOKEN, this.client)
	}

	/**
	 * Updates the numbers on top.gg
	 *
	 * @param {Number} guildSize - Amount of guilds where the server is on.
	 *
	 * */
	updateTopGg(guildSize) {
		this.dbl.postStats(guildSize)
		this.dbl.on('error', e => {
			if (config.DEVELOPMENT !== true) {
				Logger.error('Error occurred while trying to update the server amount on top.gg!')
				console.error(e)
			}
		})
	}

	/**
	 * Updates the numbers on bots.ondiscord.xyz
	 *
	 * @param {Number} guildSize - Amount of guilds where the server is on.
	 *
	 * */
	updateBotsXyz(guildSize) {
		got.post(`https://bots.ondiscord.xyz/bot-api/bots/${config.ONDISCORDXYZ_BOTID}/guilds`, {
			headers: {
				'Authorization': config.ONDISCORDXYZ_TOKEN,
			},
			json: true,
			method: 'POST',
			body: {
				'guildCount': guildSize,
			},
		}).then(res => {
			if(res.statusCode !== 204) {
				Logger.error('Error occurred when trying to update the server amount on bots.ondiscord.xyz! Code: ' + res.statusCode)
				console.error(res)
			}
		}).catch(e => {
			console.log(e)
		})
	}

	/**
	 * Updates the numbers on discordbotlist.com
	 *
	 * @param {Number} guildSize - Amount of guilds where the server is on.
	 * @param {Number} memberAmount - Amount of members which can use the bot.
	 * @param {Number} voiceConnectionSize - Amount of voice connections.
	 *
	 * */
	updateDiscordBotList(guildSize, memberAmount, voiceConnectionSize) {
		got.post(`https://discordbotlist.com/api/bots/${config.ONDISCORDXYZ_BOTID}/stats`, {
			headers: {
				'Authorization': 'Bot ' + config.DISCORDBOTLIST_TOKEN,
			},
			json: true,
			method: 'POST',
			body: {
				'guilds': guildSize,
				'users': memberAmount,
				'voice_connections': voiceConnectionSize,
			},
		}).then(res => {
			if(res.statusCode !== 204) {
				Logger.error('Error occurred when trying to update the server amount on discordbotlist.com! Code: ' + res.statusCode)
				console.error(res)
			}
		}).catch(e => {
			console.log(e)
		})
	}

}
