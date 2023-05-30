const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");
const { users } = require("../config.js");
const { callMainMenu } = require("../mainMenu.js")

const direvativesMarketScene = new Scenes.BaseScene('direvativesMarket');

direvativesMarketScene.on(message("text"), async ctx => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    status: "direvativesMarket",
  });
  if(user) {
    switch(ctx.message.text) {
      case 'Get Tickers': {
        ctx.scene.leave();
        await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'tickersDirevatives'}})
        ctx.scene.enter('getTickersDirevatives')
        break;
      }
      case 'Get OrderBook': {
        ctx.scene.leave();
        await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'orderBookDirevatives' }})
        ctx.scene.enter('getOrderBookDirevatives')
        break;
      }
      case 'Get Kline': {
        ctx.scene.leave();
        await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'klineDirevatives' }})
        ctx.scene.enter("getKlineDirevatives")
        break;
      }
      case 'Amend Order': {
        ctx.scene.leave();
        await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'amendOrderDirevatives'}})
        ctx.scene.enter('amendOrderDirevatives')
        break;
      }
      case 'Place Order': {
        ctx.scene.leave();
        await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'placeOrderDirevatives'}})
        ctx.scene.enter('placeOrderDirevatives')
        break;
      }
      case 'Cancel Order': {
        ctx.scene.leave();
        await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'cancelOrderDirevatives'}})
        ctx.scene.enter('cancelOrderDirevatives')
        break;
      }
      case 'Cancel All Orders': {
        ctx.scene.leave();
        await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'cancelAllOrdersDirevatives'}})
        ctx.scene.enter('cancelAllOrdersDirevatives')
        break;
      }
      case 'Get Open Orders': {
        ctx.scene.leave();
        await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'getOpenOrdersDirevatives' }});
        await ctx.scene.enter('getOpenOrdersDirevatives')
        break;
      }
      case 'Get Orders History': {
        ctx.scene.leave();
        await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'getOrdersHistoryDirevatives' }});
        await ctx.scene.enter('getOrdersHistoryDirevatives')
        break;
      }
      case 'Get Wallet Balance': {
        ctx.scene.leave();
        await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'walletBalanceDirevatives' }});
        await ctx.scene.enter("walletBalanceDirevatives")
        break;
      }
      case '/info': {
        ctx.scene.leave();
        await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'info' }})
        await ctx.scene.enter('info')
        break;
      }
      case '/settings': {
        ctx.scene.leave();
        await users.updateOne({ idTelegram: ctx.chat.id}, { $set: { status: 'settings'}})
        await ctx.scene.enter('settings')
        break;
      }
      case 'Повернутись на головну': {
        ctx.scene.leave();
        callMainMenu(ctx)
        break;
      }
      default: {
        break;
      }
    }
  }
})

module.exports = { direvativesMarketScene }