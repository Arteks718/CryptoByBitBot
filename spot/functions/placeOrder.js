const { users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { spotAPI } = require("../../keyboards")
const chooseOtherButton = require('../chooseOtherButton.js')
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const placeOrderSpotScene = new Scenes.BaseScene('placeOrderSpot')

placeOrderSpotScene.enter(async ctx => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "placeOrderSpot",
  });
  placeOrderSpot(ctx, user)
})

const placeOrderSpot = async(ctx, user) => {
  if(user) {
    ctx.replyWithHTML(`Введіть запит за такими параметрами:\n\n<b>symbol:side:orderType:qty:price</b>\n\n<b>symbol</b> (обов'язковий) - це символ криптовалюти за яким буде додаватись нове замовлення (наприклад BTCUSD, ethusdt)\n<b>side</b> (обов'язковий) - це сторона замовлення, вона може бути лише Buy(купівля) або Sell(продаж)\n<b>orderType</b> (обов'язковий) - це тип замовлення, він може бути лише Market(ринковий) або Limit(лімітний)\n<b>qty</b> (обов'язковий) - кількість замовлення валюти. Якщо обираете тип замовлення <b>Market</b>, тоді дане поле дорівнює вартістю замовлення в USDT\n<b>price</b> - ціна замовлення, якщо це купівля то вона буде в USDT, якщо на продаж, то в тій валюті яку плануєте продавати. Якщо обираєте тип замовлення <b>Market</b>, то дане поле треба заповнити значенням <b>0</b>\n\n<b>Ось приклад введення запиту</b>\n\n<i>BTCUSDT:Buy:Limit:0.0001:28000</i>`)
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    placeOrderSpotScene.on(message("text"), async ctx => {
      let otherButton;
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) { 
        const arrayOfStrings = ctx.message.text.split(":");
        if(arrayOfStrings.length == 5) {
          const symbol = arrayOfStrings[0].toUpperCase();
          let side = arrayOfStrings[1].toLowerCase();

          if(side == 'buy') side.replace('buy', 'Buy');
            else if(side == 'sell') side.replace('sell', 'Sell');

          let orderType = arrayOfStrings[2].toLowerCase();

          if(orderType == 'limit') orderType.replace('limit', 'Limit');
            else if(orderType == 'market') orderType.replace('market', 'Market');

          const qty = arrayOfStrings[3];

          const placeOrder = {
            category: 'spot',
            symbol: symbol,
            side: side,
            orderType: orderType,
            qty: qty,
          }
          const price = arrayOfStrings[4];
            if(price != "0") placeOrder.price = price
          console.log(placeOrder)
            clientByBit.submitOrder(placeOrder)
            .then(async result => {
              if(result.retCode == 0){
                await users.updateOne(
                  { idTelegram: ctx.chat.id },
                  { $set: { status: "spotMarket"}}  
                )
                await ctx.reply("✅Операція додавання замовлення успішна✅", spotAPI);
                await ctx.replyWithHTML(`<b>Ідентифікатор замовлення:</b> ${result.result.orderId}`)
                ctx.scene.leave()
                ctx.scene.enter('spotMarket')
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
      }
    })
  }
  else {
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
    ctx.scene.leave()
    ctx.scene.enter('spotMarket')
  }
}

module.exports =  { placeOrderSpotScene }