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

// const hearsGetWalletBalanceDirevatives = new Scenes.BaseScene('hearsGetWalletBalanceDirevatives');
// const hearsGetTickersDirevatives = new Scenes.BaseScene('hearsGetTickersDirevatives');
// const hearsAmendOrderDirevatives = new Scenes.BaseScene('hearsAmendOrderDirevatives')
// const hearsPlaceOrderDirevatives = new Scenes.BaseScene('hearsPlaceOrderDirevatives')

// hearsGetWalletBalanceDirevatives.hears("Get Wallet Balance", async ctx => {
//   await users.updateOne(
//   { idTelegram: ctx.chat.id },
//   { $set: { status: 'walletBalanceDirevatives' } } );
//   ctx.reply("Test wallet order")
// // ctx.scene.enter("amendOrderDirevatives")
// })

// hearsGetTickersDirevatives.hears("Get Tickers", async ctx => {
//   await users.updateOne(
//   { idTelegram: ctx.chat.id },
//   { $set: { status: 'tickersDirevatives' } } );
//   ctx.reply("Test tickers order")
// // ctx.scene.enter("amendOrderDirevatives")
// })

// hearsAmendOrderDirevatives.hears("Amend Order", async ctx => {
//   await users.updateOne(
//   { idTelegram: ctx.chat.id },
//   { $set: { status: 'amendOrderDirevatives' } } );
//   ctx.reply("Test amend order")
// ctx.scene.enter("amendOrderDirevatives")
// })

// hearsPlaceOrderDirevatives.hears("Place Order", async ctx => {
//   await users.updateOne(
//   { idTelegram: ctx.chat.id },
//   { $set: { status: 'placeOrderDirevatives' } } );
//   ctx.reply("Test place order")
//   // ctx.scene.enter("amendOrderDirevatives")
// })

// module.exports = { hearsGetWalletBalanceDirevatives, hearsGetTickersDirevatives, hearsPlaceOrderDirevatives, hearsAmendOrderDirevatives}


module.exports = async () => {
  bot.hears("Get Wallet Balance", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'walletBalanceDirevatives' } } );
    await getWalletBalance(ctx);
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
    await getOrderBook(ctx);
  })
  bot.hears("Get Kline", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'klineDirevatives' } } );
    await getKline(ctx);
  })
  bot.hears("Get Open Orders", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'getOpenOrdersDirevatives' } } );
    await getOpenOrders(ctx);
  })
  bot.hears("Get Orders History", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'getOrdersHistoryDirevatives' } } );
    await getOrdersHistory(ctx);
  })
  bot.hears("Place Order", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'placeOrderDirevatives' } } );
    await placeOrder(ctx);
  })
  bot.hears("Cancel Order", async (ctx) => {
    await users.updateOne(
    { idTelegram: ctx.chat.id },
      { $set: { status: 'cancelOrderDirevatives' } } );
    await cancelOrder(ctx);
  })
  bot.hears("Cancel All Orders", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'cancelAllOrdersDirevatives' } } );
    await cancelAllOrders(ctx);
  })
  bot.hears("Amend Order", async (ctx) => {
    await users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'amendOrderDirevatives' } } );
    await ctx.scene.enter("amendOrderDirevatives")
  })
}