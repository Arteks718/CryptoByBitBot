require("dotenv").config();
const { MongoClient } = require("mongodb");
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const client = new MongoClient(process.env.URL)
const users = client.db("cryptobybitbot").collection("users");

module.exports = { bot, client, users };
