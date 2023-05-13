const {bot, users } = require("../config.js");
const getWalletBalance = require("./functions/getWalletBalance");
const getTickers = require("./functions/getTickers");
const getKline = require("./functions/getKline");
const getOrderBook = require("./functions/getOrderBook");

module.exports = () => {
  bot.hears("Get Wallet Balance", (ctx) => {
    users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'walletBalanceDirevatives' } } );
    getWalletBalance(ctx);
  });
  bot.hears("Get Tickers", (ctx) => {
    users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'tickersDirevatives' } } );
    getTickers(ctx);
  })
  bot.hears("Get OrderBook", (ctx) => {
    users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'orderBookDirevatives' } } );
    getOrderBook(ctx);
  })
  bot.hears("Get Kline", (ctx) => {
    users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'klineDirevatives' } } );
    getKline(ctx);
  })
}

