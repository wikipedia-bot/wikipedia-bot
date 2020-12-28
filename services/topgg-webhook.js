const express = require('express');

// Logger
const Util = require('./../modules/util')
const Logger = new Util.Logger()

const Topgg = require('@top-gg/sdk')
require('dotenv').config()

const app = express();

const webhook = new Topgg.Webhook(process.env.WEBHOOK_AUTH);

app.post('/topggwebhook', webhook.middleware(), (req, res) => {
	Logger.info('User ' + req.vote.user + ' voted!')
})

app.listen(process.env.WEBHOOK_PORT)