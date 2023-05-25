const { users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { directivesAPI } = require("../../keyboards")
const chooseOtherButton = require('../chooseOtherButton.js')
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const cancelOrderDirevativesScene = new Scenes.BaseScene('cancelOrderDirevatives')

cancelOrderDirevativesScene.enter(async ctx => {
    let user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "cancelOrderDirevatives",
  });
  cancelOrderDirevatives(ctx, user)
})

const cancelOrderDirevatives = async (ctx, user) => {
  if(user) {
    ctx.replyWithHTML(`Введіть запит за наступим виклядом:\n<i>symbol:orderId</i>\n\nsymbol - це символ пошуку(наприклад BTCUSD, ethusdt)\norderId - це ідентифікатор замовлення, отримати його можна за командою "Get Open Orders"\nОсь приклад введення запиту:\n<i>BTCUSDT:bfd222dd-d17a-4a9e-90f3-7b081dfee319</i>`);
    let clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    cancelOrderDirevativesScene.on(message("text"), async ctx => {
      let otherButton;
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) {
        if(ctx.message.text.match(/^[A-Za-z]+:[a-fA-F0-9]{8}-(?:[a-fA-F0-9]{4}-){3}[a-fA-F0-9]{12}$/)) {
          const arrayOfStrings = ctx.message.text.split(":");
          const symbol = arrayOfStrings[0];
          const orderId = arrayOfStrings[1];
          clientByBit.cancelOrder({ category: 'linear', symbol: symbol.toUpperCase(), orderId: orderId })
            .then(async result => {
              if(result.retCode == 0) {
                await users.updateOne(
                  { idTelegram: ctx.chat.id },
                  { $set: { status: "directivesMarket"}}  
                )
                ctx.reply("✅Операція видалення замовлення успішна✅", directivesAPI);
                ctx.scene.leave();
              }
              else 
                throw new Error(result.retCode);
            })
            .catch((err) => {
              ctx.reply("❌Помилка видалення замовлення");
              console.log(err)
            });
        }
        else
          ctx.reply("❌Помилка, неправильно введено запит cancelOrder")
      }
    })
  } 
  else {
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
    ctx.scene.leave()
  }
}

module.exports = { cancelOrderDirevativesScene }

// module.exports = async (ctx) => {
//   const user = await users.findOne({
//     idTelegram: ctx.chat.id,
//     chooseButtonAPI: true,
//     apiKey: { $exists: true },
//     status: "cancelOrderDirevatives",
//   });
//   if(user) {
//     ctx.replyWithHTML(`Введіть запит за наступим виклядом:
//       \n<i>symbol:orderId</i>
//       \n\nsymbol - це символ пошуку(наприклад BTCUSD, ethusdt)
//       \norderId - це ідентифікатор замовлення, отримати його можна за командою "Get Open Orders"
//       \nОсь приклад введення запиту:
//       \n<i>BTCUSDT:bfd222dd-d17a-4a9e-90f3-7b081dfee319</i>`);
//     const clientByBit = new RestClientV5({
//       key: user.apiKey,
//       secret: user.apiSecret,
//       testnet: false,
//       recv_window: 5000,
//     });

//     bot.hears(/^[A-Za-z]+:[a-fA-F0-9]{8}-(?:[a-fA-F0-9]{4}-){3}[a-fA-F0-9]{12}$/, (ctx) => {
//       const arrayOfStrings = ctx.message.text.split(":");
//       const symbol = arrayOfStrings[0];
//       const orderId = arrayOfStrings[1];
//       clientByBit.cancelOrder({ category: 'linear', symbol: symbol.toUpperCase(), orderId: orderId })
//         .then(async result => {
//           if(result.retCode == 0) {
//             await users.updateOne(
//               { idTelegram: ctx.chat.id },
//               { $set: { status: "directivesMarket"}}  
//             )
//             ctx.reply("✅Операція видалення замовлення успішна✅", directivesAPI);
//           } 
//           else 
//             throw new Error(result.retCode);
//         })
//         .catch((err) => {
//           ctx.reply("❌Помилка видалення замовлення");
//           console.log(err)
//         });
//     })
//   } 
//   else
//     ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
// }