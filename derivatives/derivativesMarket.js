const { Scenes } = require("telegraf");
const {bot, users } = require("../config.js");
const getWalletBalance = require("./functions/getWalletBalance");
const getTickers = require("./functions/getTickers");
const getKline = require("./functions/getKline");
const getOrderBook = require("./functions/getOrderBook");
const getOpenOrders = require("./functions/getOpenOrders");
const cancelOrder = require("./functions/cancelOrder");
const cancelAllOrders = require("./functions/cancelAllOrders");
const placeOrder = require("./functions/placeOrder");
const amendOrder = require("./functions/amendOrder");
const getOrdersHistory = require("./functions/getOrdersHistory");

module.exports = async () => {
  bot.hears("Get Wallet Balance", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'walletBalanceDirevatives' } } );
    await ctx.scene.enter("walletBalanceDirevatives")
  });
  bot.hears("Get Tickers", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'tickersDirevatives' } } );
    await ctx.scene.enter("getTickersDirevatives")
  })
  bot.hears("Get OrderBook", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'orderBookDirevatives' } } );
    await ctx.scene.enter("getOrderBookDirevatives")
  })
  bot.hears("Get Kline", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'klineDirevatives' } } );
    await ctx.scene.enter("getKlineDirevatives")
  })
  bot.hears("Get Open Orders", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'getOpenOrdersDirevatives' } } );
    await ctx.scene.enter("getOpenOrdersDirevatives")
  })
  bot.hears("Get Orders History", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'getOrdersHistoryDirevatives' } } );
    await ctx.scene.enter("getOrdersHistoryDirevatives")
  })
  bot.hears("Place Order", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'placeOrderDirevatives' } } );
    await ctx.scene.enter("placeOrderDirevatives")
  })
  bot.hears("Cancel Order", async (ctx) => {
    await users.updateOne(
    { idTelegram: ctx.chat.id },
      { $set: { status: 'cancelOrderDirevatives' } } );
    await ctx.scene.enter("cancelOrderDirevatives")
  })
  bot.hears("Cancel All Orders", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'cancelAllOrdersDirevatives' } } );
    await ctx.scene.enter("cancelAllOrdersDirevatives")
  })
  bot.hears("Amend Order", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'amendOrderDirevatives' } } );
    await ctx.scene.enter("amendOrderDirevatives")
  })
}

