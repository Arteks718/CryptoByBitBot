require("dotenv").config();
const { MongoClient } = require("mongodb");
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const client = new MongoClient(process.env.URL)

module.exports = { bot, client };
