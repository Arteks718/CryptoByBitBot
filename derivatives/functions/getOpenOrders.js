const { users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { directivesAPI } = require("../../keyboards")
const chooseOtherButton = require('../chooseOtherButton.js')
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const getOpenOrdersDirevativesScene = new Scenes.BaseScene('getOpenOrdersDirevatives')

getOpenOrdersDirevativesScene.enter(async ctx => {
  let user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "getOpenOrdersDirevatives",
  });
  getOpenOrdersDirevatives(ctx, user);
})

const getOpenOrdersDirevatives = async(ctx, user) => {
  if (user) {
    ctx.reply("Введіть символ за яким буде пошук активних замовлень, наприклад: BTCUSDT, ethusdt, BitUsDt")
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 10000,
    });

    getOpenOrdersDirevativesScene.on(message("text"), async ctx => {
      let otherButton;
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) {
        if(ctx.message.text.match(/^[A-Za-z]/)) {
          clientByBit.getActiveOrders({category: 'linear', symbol: ctx.message.text.toUpperCase()}, )
            .then(async result => {
              if(result.retCode == 0){
                if(result.result.list.length != 0){
                  await users.updateOne(
                    { idTelegram: ctx.chat.id },
                    { $set: { status: "directivesMarket"}}  
                  )
                  ctx.reply("✅Операція успішна✅", directivesAPI);
                  result.result.list.forEach(order => infoOutput(ctx, order))
                  ctx.scene.leave();
                } 
                else 
                  ctx.reply("Немає активних замовлень на дану криптовалюту")
              } 
              else 
                throw new Error(result.retMsg);
            })
            .catch(error => {
              ctx.reply("❌Помилка виведення активних замовлень");
              console.log(error)
            })
        }
        else
          ctx.reply("❌Помилка, неправильно введено запит getOpenOrders. Будь ласка, спробуйте ще раз.")
      }
    })
  }
  else {
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
    ctx.scene.leave()
  }
}

const infoOutput = (ctx, result) => {
  let resultString = "";
  if(result.symbol)
    resultString += `<b>Криптовалюта:</b> ${result.symbol}\n`
  if(result.side)
    resultString += `<b>Бік замовлення:</b> `;
      (result.side == 'Buy') ? resultString += `купівля\n` : resultString += `продаж\n`
  if(result.price)
    resultString += `<b>Ціна:</b> ${result.price}\n`
  if(result.qty)
    resultString += `<b>Кількість:</b> ${result.qty}\n`
  if(result.orderType)
    resultString += `<b>Тип замовлення:</b> `;
      (result.orderType == 'Limit') ? resultString += `лімітний\n` : resultString += `ринковий\п`
  if(result.orderId)
    resultString += `<b>Номер замовлення:</b> ${result.orderId}\n`
  if(result.orderLinkId)
    resultString += `<b>Налаштований користувачем ідентифікатор замовлення:</b> ${result.orderLinkId}`
  if(result.stopOrderType)
    resultString += `<b>Тип зупинки замовлення:</b> ${result.stopOrderType}\n`;
  if(result.orderStatus)
    resultString += `<b>Статус замовлення:</b> ${result.orderStatus}\n`
  if(result.takeProfit && result.takeProfit!= 0)
    resultString += `<b>Ставка отримання прибутку:</b> ${result.takeProfit}\n`
  if(result.stopLoss && result.stopLoss!= 0)
    resultString += `<b>Ставка зупинки втрати:</b> ${result.stopLoss}\n`
  if(result.triggerPrice && result.triggerPrice != 0)
    resultString += `<b>Тригерна ціна:</b> ${result.triggerPrice}\n`
  
  ctx.replyWithHTML(resultString);
}

module.exports = { getOpenOrdersDirevativesScene }

// module.exports = async (ctx) => {
//   const user = await users.findOne({
//     idTelegram: ctx.chat.id,
//     chooseButtonAPI: true,
//     apiKey: { $exists: true },
//     status: "getOpenOrdersDirevatives",
//   });
//   if (user) {
//     ctx.reply("Введіть символ за яким буде пошук активних замовлень, наприклад: BTCUSDT, ethusdt, BitUsDt")
//     const clientByBit = new RestClientV5({
//       key: user.apiKey,
//       secret: user.apiSecret,
//       testnet: false,
//       recv_window: 10000,
//     });

//     bot.on("message", async (ctx) => {
//       if (/^[A-Za-z]+/.test(ctx.message.text)) {
//         clientByBit.getActiveOrders({category: 'linear', symbol: ctx.message.text.toUpperCase()}, )
//         .then(async result => {
//           if(result.retCode == 0){
//             if(result.result.list.length != 0){
//               await users.updateOne(
//                 { idTelegram: ctx.chat.id },
//                 { $set: { status: "directivesMarket"}}  
//               )
//               ctx.reply("✅Операція успішна✅", directivesAPI);
//               result.result.list.forEach(order => infoOutput(ctx, order))
//             } 
//             else 
//               ctx.reply("Немає активних замовлень на дану криптовалюту")
//           } 
//           else 
//             throw new Error(result.retMsg);
//         })
//         .catch(error => {
//           ctx.reply("❌Помилка виведення активних замовлень");
//           console.log(error)
//         })
//       }

//     })
//   }
//   else
//     ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
// }