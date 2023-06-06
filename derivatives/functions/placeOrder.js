const { users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { direvativesAPI } = require("../../keyboards")
const chooseOtherButton = require('../chooseOtherButton.js')
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const placeOrderDirevativesScene = new Scenes.BaseScene('placeOrderDirevatives')

placeOrderDirevativesScene.enter(async ctx => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "placeOrderDirevatives",
  });
  placeOrderDirevatives(ctx, user)
})

const placeOrderDirevatives = async(ctx, user) => {
  if(user) {
    ctx.replyWithHTML(`Введіть запит за такими параметрами:\n\n<i>symbol:side:orderType:qty:price:takeProfit:stopLoss</i>\n\n<b>symbol</b> (обов'язковий) - це символ криптовалюти за яким буде додаватись нове замовлення (наприклад BTCUSD, ethusdt)\n<b>side</b> (обов'язковий) - це сторона замовлення, вона може бути лише Buy(купівля) або Sell(продаж)\n<b>orderType</b> (обов'язковий) - це тип замовлення, він може бути лише Market(ринковий) або Limit(лімітний). Якщо обираєте Market, тоді наступні поля як price, takeProfit та stopLoss треба заповнити значенням <b>0</b>\n<b>qty</b> (обов'язковий) - кількість замовлення валюти. Якщо обираете тип замовлення <b>Market</b>, тоді дане поле дорівнює вартістю замовлення в USDT\n<b>price</b> - ціна замовлення\n<b>takeProfit</b> - ціна продажу замовлення\n<b>stopLoss</b> - ціна продажу замовлення\n\nПоля price, takeProfit та stopLoss є не обов'язковими, тому якщо не якийсь з них не бажаєте вводити, будь ласка, заповніть значенням <b>0</b>\n<b>Ось приклад введення запиту</b>\n\n<i>BTCUSDT:Buy:Limit:0.001:28000:28200:27800</i>`)
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    placeOrderDirevativesScene.on(message("text"), async ctx => {
      let otherButton;
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) { 
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
            positionIdx: 0,
            qty: qty,
          }
          const price = arrayOfStrings[4];
            if(price != "0") placeOrder.price = price
          const takeProfit = arrayOfStrings[5];
            if(takeProfit!= "0") placeOrder.takeProfit = takeProfit
          const stopLoss = arrayOfStrings[6];
            if(stopLoss!= "0") placeOrder.stopLoss = stopLoss
          clientByBit.submitOrder(placeOrder)
            .then(async result => {
              if(result.retCode == 0){
                await users.updateOne(
                  { idTelegram: ctx.chat.id },
                  { $set: { status: "direvativesMarket"}}  
                )
                await ctx.reply("✅Операція додавання замовлення успішна✅", direvativesAPI);
                await ctx.replyWithHTML(`<b>Ідентифікатор замовлення:</b> ${result.result.orderId}`)
                ctx.scene.leave()
                ctx.scene.enter('direvativesMarket')
              } 
              else 
                ctx.reply(`❌Помилка: ${result.retMsg}`)
            })
            .catch((err) => {
              ctx.reply("❌Помилка додавання замовлення");
              console.log(err)
            });
        }
        else
          ctx.reply("❌Помилка, неправильно введені параметри. Будь ласка, спробуйте ще раз.") 
      }
    })
  }
  else {
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
    ctx.scene.leave()
    ctx.scene.enter('direvativesMarket')
  }
}

module.exports =  { placeOrderDirevativesScene }