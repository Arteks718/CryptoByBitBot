const { bot, users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { directivesAPI } = require("../../keyboards");
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const amendOrderScene = new Scenes.BaseScene('amendOrderDirevatives');

let user;

amendOrderScene.enter(async ctx => {
  user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "amendOrderDirevatives",
  })
  amendOrderDirevatives(ctx, user);
})

const amendOrderDirevatives = async (ctx, user) => {
  if(user) {
    ctx.replyWithHTML(`Введіть запит за такими параметрами:\n\n<i>symbol:orderId:qty:price:takeProfit:stopLoss</i>\n<b>symbol</b> (обов'язковий) - це символ криптовалюти за яким буде додаватись нове замовлення (наприклад BTCUSD, ethusdt)\n<b>orderId</b> (обов'язковий) - це номер замовлення, побачити його можна за командою Get Open Orders\n<b>qty</b> - кількість замовлення\n<b>price</b> - ціна замовлення\n<b>takeProfit</b> - ціна отримання прибутку\n<b>stopLoss</b> - ціна зупинки збитків\n\nПоля qty, price, takeProfit та stopLoss є не обов'язковими, тому якщо не якийсь з них не бажаєте вводити, будь ласка, заповніть значенням 0\n\n<b>Ось приклад введення запиту</b>\n<i>BTCUSDT:bfd222dd-d17a-4a9e-90f3-7b081dfee319:0.001:27000:27200:26800</i>`);
    amendOrderScene.on(message("text"), async ctx =>{
      let otherButton;
      chooseOtherButton(ctx, ctx.message.text, otherButton)
      if(false) {
        const clientByBit = new RestClientV5({
          key: user.apiKey,
          secret: user.apiSecret,
          testnet: false,
          recv_window: 5000,
        });
        const arrayOfStrings = ctx.message.text.split(":");
        // if(arrayOfStrings.length == 6) {
          let symbol = arrayOfStrings[0].toUpperCase();
          let orderId = arrayOfStrings[1];
      
          let amendOrderObj = {
            category: 'linear',
            symbol: symbol,
            orderId: orderId,
          }
      
          let qty = arrayOfStrings[2];
            if(qty != "0") amendOrderObj.qty = qty;
          let price = arrayOfStrings[3];
            if(price != "0") amendOrderObj.price = price;
          const takeProfit = arrayOfStrings[4]
            if(takeProfit!= "0") amendOrderObj.takeProfit = takeProfit;
          let stopLoss = arrayOfStrings[5]
            if(stopLoss!= "0") amendOrderObj.stopLoss = stopLoss;
          clientByBit.amendOrder(amendOrderObj)
            .then(async result => {
              if(result.retCode == 0) {
                await users.updateOne(
                  { idTelegram: ctx.chat.id },
                  { $set: { status: "directivesMarket"}}  
                )
                await ctx.reply("✅Операція зміни замовлення успішна✅", directivesAPI);
                let resultString = '';
                resultString += `<b>Ідентифікатор замовлення:</b> ${result.result.orderId}`
                if(result.result.orderLinkId) resultString += `\n<b>Користувацький ідентифікатор замовлення:</b> ${result.result.orderLinkId}`
                await ctx.replyWithHTML(resultString)
                ctx.scene.leave();
              }
              else 
                throw new Error(result.retMsg);
            })
            .catch((err) => {
              ctx.reply("❌Помилка оновлення замовленняdd");
              console.log(err)
            });
      }
      // }else ctx.reply("❌Помилка, неправильно введені параметрdsadи. Будь ласка, спробуйте ще раз.") 
    })
  } else{
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
    ctx.scene.leave();
  }
}

const chooseOtherButton = async (ctx, text, other) => {
  // const arrayButtons = ['Get Tickers', 'Get OrderBook', 'Get Kline', 'Amend Order', 'Place Order', 'Cancel Order', ]
  switch(text) {
    case 'Get Tickers': {
      ctx.scene.leave();
      ctx.scene.enter('getTickersDirevatives')
      await users.updateOne({idTelegram: ctx.chat.id}, { $set: { status: 'tickersDirevatives'}})
      other = true;
      break;
    }
    case 'Get OrderBook': {
      ctx.scene.leave();
      other = true;
      break;
    }
    case 'Get Kline': {
      ctx.scene.leave();
      other = true;
      break;
    }
    case 'Amend Order': {
      ctx.scene.leave();
      ctx.scene.enter('amendOrderDirevatives')
      other = true;
      break;
    }
    case 'Place Order': {
      ctx.scene.leave();
      other = true;
      break;
    }
    case 'Cancel Order': {
      ctx.scene.leave();
      other = true;
      break;
    }
    case 'Cancel All Orders': {
      ctx.scene.leave();
      other = true;
      break;
    }
    case 'Get Open Orders': {
      ctx.scene.leave();

      other = true;
      break;
    }
    case 'Get Orders History': {
      ctx.scene.leave();
      other = true;
      break;
    }
    case 'Get Wallet Balance': {
      ctx.scene.leave();
      other = true;
      break;
    }
    default:
  }
  return other
}


module.exports = { amendOrderScene }

// amendOrderScene.on(message("text"), async ctx => {

// })

// module.exports = async (ctx) => {
//   const user = await users.findOne({
//     idTelegram: ctx.chat.id,
//     chooseButtonAPI: true,
//     apiKey: { $exists: true },
//     status: "amendOrderDirevatives",
//   });
//   if(user) {
//     ctx.replyWithHTML(`Введіть запит за такими параметрами:\n\n<i>symbol:orderId:qty:price:takeProfit:stopLoss</i>\n<b>symbol</b> (обов'язковий) - це символ криптовалюти за яким буде додаватись нове замовлення (наприклад BTCUSD, ethusdt)\n<b>orderId</b> (обов'язковий) - це номер замовлення, побачити його можна за командою Get Open Orders\n<b>qty</b> - кількість замовлення\n<b>price</b> - ціна замовлення\n<b>takeProfit</b> - ціна отримання прибутку\n<b>stopLoss</b> - ціна зупинки збитків\n\nПоля qty, price, takeProfit та stopLoss є не обов'язковими, тому якщо не якийсь з них не бажаєте вводити, будь ласка, заповніть значенням 0\n\n<b>Ось приклад введення запиту</b>\n<i>BTCUSDT:bfd222dd-d17a-4a9e-90f3-7b081dfee319:0.001:27000:27200:26800</i>
//     `);

//     const clientByBit = new RestClientV5({
//       key: user.apiKey,
//       secret: user.apiSecret,
//       testnet: false,
//       recv_window: 5000,
//     });

//     bot.on('message', async (ctx) => {
//       const arrayOfStrings = ctx.message.text.split(":");
//       if(arrayOfStrings.length == 6) {
//         let symbol = arrayOfStrings[0].toUpperCase();
//         let orderId = arrayOfStrings[1];

//         let amendOrderObj = {
//           category: 'linear',
//           symbol: symbol,
//           orderId: orderId,
//         }

//         let qty = arrayOfStrings[2];
//           if(qty != "0") amendOrderObj.qty = qty;
//         let price = arrayOfStrings[3];
//           if(price != "0") amendOrderObj.price = price;
//         const takeProfit = arrayOfStrings[4]
//           if(takeProfit!= "0") amendOrderObj.takeProfit = takeProfit;
//         let stopLoss = arrayOfStrings[5]
//           if(stopLoss!= "0") amendOrderObj.stopLoss = stopLoss;
//         clientByBit.amendOrder(amendOrderObj)
//           .then(async result => {
//             if(result.retCode == 0) {
//               await users.updateOne(
//                 { idTelegram: ctx.chat.id },
//                 { $set: { status: "directivesMarket"}}  
//               )
//               await ctx.reply("✅Операція зміни замовлення успішна✅", directivesAPI);
//               let resultString = '';
//               resultString += `<b>Ідентифікатор замовлення:</b> ${result.result.orderId}`
//               if(result.result.orderLinkId) resultString += `\n<b>Користувацький ідентифікатор замовлення:</b> ${result.result.orderLinkId}`
//               await ctx.replyWithHTML(resultString)
//             }
//             else 
//               throw new Error(result.retMsg);
//           })
//           .catch((err) => {
//             ctx.reply("❌Помилка оновлення замовлення");
//             console.log(err)
//           });
//       }
//       else
//         ctx.reply("❌Помилка, неправильно введені параметри. Будь ласка, спробуйте ще раз.") 
//     })
//   } 
//   else 
//     ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
// }