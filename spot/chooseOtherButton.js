const { users } = require("../config.js");
const { callMainMenu } = require("../mainMenu.js")

module.exports = async (ctx, text) => {
  let other;
  switch(text) {
    case 'Get Tickers': {
      ctx.scene.leave();
      await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'tickersSpot'}})
      ctx.scene.enter('getTickersSpot')
      other = true;
      break;
    }
    case 'Get OrderBook': {
      ctx.scene.leave();
      await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'orderBookSpot' }})
      ctx.scene.enter('getOrderBookSpot')
      other = true;
      break;
    }
    case 'Get Kline': {
      ctx.scene.leave();
      await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'klineSpot' }})
      ctx.scene.enter("getKlineSpot")
      other = true;
      break;
    }
    case 'Place Order': {
      ctx.scene.leave();
      await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'placeOrderSpot'}})
      ctx.scene.enter('placeOrderSpot')
      other = true;
      break;
    }
    case 'Cancel Order': {
      ctx.scene.leave();
      await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'cancelOrderSpot'}})
      ctx.scene.enter('cancelOrderSpot')
      other = true;
      break;
    }
    case 'Cancel All Orders': {
      ctx.scene.leave();
      await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'cancelAllOrdersSpot'}})
      ctx.scene.enter('cancelAllOrdersSpot')
      other = true;
      break;
    }
    case 'Get Open Orders': {
      ctx.scene.leave();
      await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'getOpenOrdersSpot' }});
      await ctx.scene.enter('getOpenOrdersSpot')
      other = true;
      break;
    }
    case 'Get Orders History': {
      ctx.scene.leave();
      await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'getOrdersHistorySpot' }});
      await ctx.scene.enter('getOrdersHistorySpot')
      other = true;
      break;
    }
    case 'Get Wallet Balance': {
      ctx.scene.leave();
      await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'walletBalanceSpot' }});
      await ctx.scene.enter("walletBalanceSpot")
      other = true;
      break;
    }
    case '/info': {
      ctx.scene.leave();
      await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'info' }})
      await ctx.scene.enter('info')
      other = true;
      break;
    }
    case '/settings': {
      ctx.scene.leave();
      await users.updateOne({ idTelegram: ctx.chat.id}, { $set: { status: 'settings'}})
      await ctx.scene.enter('settings')
      other = true;
      break;
    }
    case 'Повернутись на головну': {
      ctx.scene.leave();
      callMainMenu(ctx)
      other = true;
      break;
    }
    default: {
      other = false;
      break;
    }
  }
  return other
}