const { bot, users } = require("../../config");
const { RestClientV5 } = require("bybit-api");

module.exports = async (ctx) => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    status: "getOpenOrdersDirevatives",
  });
  if (user) {
    ctx.reply("Введіть символ або номер замовлення")
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 10000,
    });

    bot.on("message", async (ctx) => {
      if(/^[a-zA-Z0-9]{8}-(?:[a-zA-Z0-9]{4}-){3}[a-zA-Z0-9]{12}$/.test(ctx.message.text)){
        console.log("first")
        clientByBit.getActiveOrders({category: 'linear', orderId: ctx.message.text},)
          .then(result => {
            if(result.retCode == 0 ){
              ctx.reply("✅Операція успішна✅");
              infoOutput(ctx, result.result)
            } 
            else 
              throw new Error(result.retMsg);
          })
          .catch(error => {
            console.log(error)
          })
      }
      else if (/^[A-Za-z]+/) {
        clientByBit.getActiveOrders({category: 'linear', symbol: ctx.message.text.toUpperCase()}, )
        .then(result => {
          if(result.retCode == 0){
            if(result.result.list.length != 0){
              ctx.reply("✅Операція успішна✅");
              console.log(result.result)
              result.result.list.forEach(order => infoOutput(ctx, order))
            } else ctx.reply("Немає активних замовлень на дану криптовалюту")
          }
        })
        .catch(error => {
          console.log(error)
        })
      }

    })
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