const { bot, users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { directivesAPI } = require("../../keyboards")

module.exports = async (ctx) => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "placeOrderDirevatives",
  });
  if(user) {
    ctx.replyWithHTML(`Введіть запит за такими параметрами:\n\n<i>symbol:side:orderType:qty:price:takeProfit:stopLoss</i>\n\n<b>symbol</b> (обов'язковий) - це символ криптовалюти за яким буде додаватись нове замовлення (наприклад BTCUSD, ethusdt)\n<b>side</b> (обов'язковий) - це сторона замовлення, вона може бути лише Buy(купівля) або Sell(продаж)\n<b>orderType</b> (обов'язковий) - це тип замовлення, він може бути лише Market(ринковий) або Limit(лімітний). Якщо обираєте Market, тоді наступні поля як takeProfit та stopLoss\n<b>qty</b> (обов'язковий) - кількість замовлення\n<b>price</b> - ціна замовлення\n<b>takeProfit</b> - ціна продажу замовлення\n<b>stopLoss</b> - ціна продажу замовлення\n\nПоля price, takeProfit та stopLoss є не обов'язковими, тому якщо не якийсь з них не бажаєте вводити, будь ласка, заповніть значенням <b>0</b>\n<b>Ось приклад введення запиту</b>\n\n<i>BTCUSDT:Buy:Limit:0.001:28000:28200:27800</i>
      `)
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    bot.on('message', async (ctx) => {
      const arrayOfStrings = ctx.message.text.split(":");
      if(arrayOfStrings.length == 7) {
        const symbol = arrayOfStrings[0].toUpperCase();
        let side = arrayOfStrings[1].toLowerCase();
        if(side == 'buy') side = side.replace('buy', 'Buy');
        else if(side == 'sell') side = side.replace('sell', 'Sell');
        let orderType = arrayOfStrings[2].toLowerCase();
        if(orderType == 'limit') orderType = orderType.replace('limit', 'Limit');
        else if(orderType == 'market') orderType = orderType.replace('market', 'Market');
        const qty = arrayOfStrings[3];
        const placeOrder = {
          category: 'linear',
          symbol: symbol,
          side: side,
          orderType: orderType,
          qty: qty,
        }
        const price = arrayOfStrings[4];
          if(price != "0") placeOrder.price = price
        const takeProfit = arrayOfStrings[5];
          if(takeProfit!= "0") placeOrder.takeProfit = takeProfit
        const stopLoss = arrayOfStrings[6];
          if(stopLoss!= "0") placeOrder.stopLoss = stopLoss
        console.log(placeOrder)
        clientByBit.submitOrder(placeOrder)
          .then(async result => {
            if(result.retCode == 0){
              await users.updateOne(
                { idTelegram: ctx.chat.id },
                { $set: { status: "directivesMarket"}}  
              )
              await ctx.reply("✅Операція додавання замовлення успішна✅", directivesAPI);
              await ctx.replyWithHTML(`<b>Ідентифікатор замовлення:</b> ${result.result.orderId}`)
            } 
            else 
              throw new Error(result.retMsg);
          })
          .catch((err) => {
            ctx.reply("❌Помилка додавання замовлення");
            console.log(err)
          });
      }
      else
        ctx.reply("❌Помилка, неправильно введені параметри. Будь ласка, спробуйте ще раз.") 
    })
  }
  else
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
}