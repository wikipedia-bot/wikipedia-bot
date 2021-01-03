require('dotenv').config()
const config = {
	BOT_ID: process.env.BOT_ID,
	ONDISCORDXYZ_TOKEN: process.env.ONDISCORDXYZ_TOKEN,
	DISCORDBOTLIST_TOKEN: process.env.DISCORDBOTLIST_TOKEN,
}
const got = require('got')
const Util = require('./util')
const Logger = new Util.Logger()

exports.BotListUpdater = class {
	constructor(shardId) {
		this.shardId = shardId;
	}

	/**
	 * Updates the numbers on bots.ondiscord.xyz
	 *
	 * @param {Number} guildSize - Amount of guilds where the server is on.
	 *
	 * */
	updateBotsXyz(guildSize) {
		if (this.shardId === 0) {
			got.post(`https://bots.ondiscord.xyz/bot-api/bots/${config.BOT_ID}/guilds`, {
				json: {
					guildCount: guildSize,
				},
				headers: {
					Authorization: config.ONDISCORDXYZ_TOKEN.toString()
				},
				responseType: 'json',
			}).then(res => {
				if (res.statusCode !== 204) {
					Logger.error('Error occurred when trying to update the server amount on bots.ondiscord.xyz! Code: ' + res.statusCode)
					console.error(res)
				}
				else {
					Logger.info('Updated guild amount on bots.ondiscord.xyz')
				}
			}).catch(e => {
				console.log(e)
			})
		}
	}

	/**
	 * @deprecated
	 * Updates the numbers on discordbotlist.com
	 *
	 * @param {Number} guildSize - Amount of guilds where the server is on.
	 * @param {Number} memberAmount - Amount of members which can use the bot.
	 * @param {Number} voiceConnectionSize - Amount of voice connections.
	 *
	 * */
	updateDiscordBotList(guildSize, memberAmount, voiceConnectionSize) {
		got.post(`https://discordbotlist.com/api/v1/bots/${config.BOT_ID}/stats`, {
			headers: {
				'Authorization': 'Bot ' + config.DISCORDBOTLIST_TOKEN,
			},
			json: {
				'guilds': guildSize,
				'users': memberAmount,
				'voice_connections': voiceConnectionSize,
			},
			responseType: 'json',
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
