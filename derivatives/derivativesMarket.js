const {bot, users } = require("../config.js");
const getWalletBalance = require("./functions/getWalletBalance");
const getTickers = require("./functions/getTickers");
const getKline = require("./functions/getKline");
const getOrderBook = require("./functions/getOrderBook");
const getOpenOrders = require("./functions/getOpenOrders");
const cancelOrder = require("./functions/cancelOrder");
const cancelAllOrders = require("./functions/cancelAllOrders");

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
  bot.hears("Get Open Orders", (ctx) => {
    users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'getOpenOrdersDirevatives' } } );
    getOpenOrders(ctx);
  })
  bot.hears("Get Orders History", (ctx) => {
    users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'getOrdersHistoryDirevatives' } } );
    // getKline(ctx);
  })
  bot.hears("Place Order", (ctx) => {
    users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'placeOrderDirevatives' } } );
    // getKline(ctx);
  })
  bot.hears("Cancel Order", (ctx) => {
    users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'cancelOrderDirevatives' } } );
    cancelOrder(ctx);
  })
  bot.hears("Cancel All Orders", (ctx) => {
    users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'cancelAllOrdersDirevatives' } } );
    cancelAllOrders(ctx);
  })
  bot.hears("Amend Order", (ctx) => {
    users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'amendOrderDirevatives' } } );
    // getKline(ctx);
  })
}

