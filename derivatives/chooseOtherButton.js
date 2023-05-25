const { users } = require("../config.js");
const { callMainMenu } = require("../mainMenu.js")

module.exports = async (ctx, text) => {
  // const arrayButtons = ['Get Tickers', 'Get OrderBook', 'Get Kline', 'Amend Order', 'Place Order', 'Cancel Order', ]
  let other;
  switch(text) {
    case 'Get Tickers': {
      ctx.scene.leave();
      await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'tickersDirevatives'}})
      ctx.scene.enter('getTickersDirevatives')
      other = true;
      break;
    }
    case 'Get OrderBook': {
      ctx.scene.leave();
      await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'orderBookDirevatives' }})
      ctx.scene.enter('getOrderBookDirevatives')
      other = true;
      break;
    }
    case 'Get Kline': {
      ctx.scene.leave();
      await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'klineDirevatives' }})
      ctx.scene.enter("getKlineDirevatives")
      other = true;
      break;
    }
    case 'Amend Order': {
      ctx.scene.leave();
      await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'amendOrderDirevatives'}})
      ctx.scene.enter('amendOrderDirevatives')
      other = true;
      break;
    }
    case 'Place Order': {
      ctx.scene.leave();
      await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'placeOrderDirevatives'}})
      ctx.scene.enter('placeOrderDirevatives')
      other = true;
      break;
    }
    case 'Cancel Order': {
      ctx.scene.leave();
      await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'cancelOrderDirevatives'}})
      ctx.scene.enter('cancelOrderDirevatives')
      other = true;
      break;
    }
    case 'Cancel All Orders': {
      ctx.scene.leave();
      await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'cancelAllOrdersDirevatives'}})
      ctx.scene.enter('cancelAllOrdersDirevatives')
      other = true;
      break;
    }
    case 'Get Open Orders': {
      ctx.scene.leave();
      await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'getOpenOrdersDirevatives' }});
      await ctx.scene.enter('getOpenOrdersDirevatives')
      other = true;
      break;
    }
    case 'Get Orders History': {
      ctx.scene.leave();
      await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'getOrdersHistoryDirevatives' }});
      await ctx.scene.enter('getOrdersHistoryDirevatives')
      other = true;
      break;
    }
    case 'Get Wallet Balance': {
      ctx.scene.leave();
      await users.updateOne({ idTelegram: ctx.chat.id }, { $set: { status: 'walletBalanceDirevatives' }});
      await ctx.scene.enter("walletBalanceDirevatives")
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
      console.log("asdasd123")
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

// const chooseOtherButton = async (ctx, text) => {
//   // const arrayButtons = ['Get Tickers', 'Get OrderBook', 'Get Kline', 'Amend Order', 'Place Order', 'Cancel Order', ]
//   let other;
//   switch(text) {
//     case 'Get Tickers': {
//       ctx.scene.leave();
//       await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'tickersDirevatives'}})
//       ctx.scene.enter('getTickersDirevatives')
//       other = true;
//       break;
//     }
//     case 'Get OrderBook': {
//       ctx.scene.leave();
//       other = true;
//       break;
//     }
//     case 'Get Kline': {
//       ctx.scene.leave();
//       other = true;
//       break;
//     }
//     case 'Amend Order': {
//       ctx.scene.leave();
//       await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'amendOrderDirevatives'}})
//       ctx.scene.enter('amendOrderDirevatives')
//       other = true;
//       break;
//     }
//     case 'Place Order': {
//       ctx.scene.leave();
//       other = true;
//       break;
//     }
//     case 'Cancel Order': {
//       ctx.scene.leave();
//       other = true;
//       break;
//     }
//     case 'Cancel All Orders': {
//       ctx.scene.leave();
//       other = true;
//       break;
//     }
//     case 'Get Open Orders': {
//       ctx.scene.leave();

//       other = true;
//       break;
//     }
//     case 'Get Orders History': {
//       ctx.scene.leave();
//       other = true;
//       break;
//     }
//     case 'Get Wallet Balance': {
//       ctx.scene.leave();
//       other = true;
//       break;
//     }
//     default: {
//       other = false;
//       break;
//     }
//   }
//   return other
// }