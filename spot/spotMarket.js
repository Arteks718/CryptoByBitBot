const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");
const { users } = require("../config.js");
const { callMainMenu } = require("../mainMenu.js")

const spotMarketScene = new Scenes.BaseScene('spotMarket');

spotMarketScene.on(message("text"), async ctx => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    status: "spotMarket",
  });
  if(user) {
    switch(ctx.message.text) {
      case 'Get Tickers': {
        ctx.scene.leave();
        await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'tickersSpot'}})
        ctx.scene.enter('getTickersSpot')
        break;
      }
      case 'Get OrderBook': {
        ctx.scene.leave();
        await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'orderBookSpot' }})
        ctx.scene.enter('getOrderBookSpot')
        break;
      }
      case 'Get Kline': {
        ctx.scene.leave();
        await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'klineSpot' }})
        ctx.scene.enter("getKlineSpot")
        break;
      }
      case 'Place Order': {
        ctx.scene.leave();
        await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'placeOrderSpot'}})
        ctx.scene.enter('placeOrderSpot')
        break;
      }
      case 'Cancel Order': {
        ctx.scene.leave();
        await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'cancelOrderSpot'}})
        ctx.scene.enter('cancelOrderSpot')
        break;
      }
      case 'Cancel All Orders': {
        ctx.scene.leave();
        await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'cancelAllOrdersSpot'}})
        ctx.scene.enter('cancelAllOrdersSpot')
        break;
      }
      case 'Get Open Orders': {
        ctx.scene.leave();
        await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'getOpenOrdersSpot' }});
        await ctx.scene.enter('getOpenOrdersSpot')
        break;
      }
      case 'Get Orders History': {
        ctx.scene.leave();
        await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'getOrdersHistorySpot' }});
        await ctx.scene.enter('getOrdersHistorySpot')
        break;
      }
      case 'Get Wallet Balance': {
        ctx.scene.leave();
        await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'walletBalanceSpot' }});
        await ctx.scene.enter("walletBalanceSpot")
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

module.exports = { spotMarketScene }