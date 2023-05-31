const chooseOtherButton = require('../chooseOtherButton.js')
const { bot, users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { direvativesAPI } = require("../../keyboards");
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const amendOrderDirevativesScene = new Scenes.BaseScene('amendOrderDirevatives');

amendOrderDirevativesScene.enter(async ctx => {
  let user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "amendOrderDirevatives",
  })
  amendOrderDirevatives(ctx, user);
})

const amendOrderDirevatives = async (ctx, user) => {
  if(user) {
    ctx.replyWithHTML(`Введіть запит за такими параметрами:\n\n<b>symbol:orderId:qty:price:takeProfit:stopLoss</b>\n\n<b>symbol</b> (обов'язковий) - це символ криптовалюти за яким буде додаватись нове замовлення (наприклад BTCUSD, ethusdt)\n<b>orderId</b> (обов'язковий) - це номер замовлення, побачити його можна за командою Get Open Orders\n<b>qty</b> - кількість замовлення\n<b>price</b> - ціна замовлення\n<b>takeProfit</b> - ціна отримання прибутку\n<b>stopLoss</b> - ціна зупинки збитків\n\nПоля qty, price, takeProfit та stopLoss є не обов'язковими, тому якщо не якийсь з них не бажаєте вводити, будь ласка, заповніть значенням 0\n\n<b>Ось приклад введення запиту</b>\n<i>BTCUSDT:bfd222dd-d17a-4a9e-90f3-7b081dfee319:0.001:27000:27200:26800</i>`);
    amendOrderDirevativesScene.on(message("text"), async ctx =>{
      let otherButton
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) {
        const clientByBit = new RestClientV5({
          key: user.apiKey,
          secret: user.apiSecret,
          testnet: false,
          recv_window: 5000,
        });
        const arrayOfStrings = ctx.message.text.split(":");
        if(arrayOfStrings.length == 6) {
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
                  { $set: { status: "direvativesMarket"}}  
                )
                await ctx.reply("✅Операція зміни замовлення успішна✅", direvativesAPI);
                let resultString = '';
                resultString += `<b>Ідентифікатор замовлення:</b> ${result.result.orderId}`
                if(result.result.orderLinkId) resultString += `\n<b>Користувацький ідентифікатор замовлення:</b> ${result.result.orderLinkId}`
                await ctx.replyWithHTML(resultString)
                ctx.scene.leave();
                ctx.scene.enter('direvativesMarket')
              }
              else 
                ctx.reply(`❌Помилка: ${result.retMsg}`)
            })
            .catch((err) => {
              ctx.reply("❌Помилка оновлення замовлення");
              console.log(err)
            });
        }
        else 
          ctx.reply("❌Помилка, неправильно введено запит. Будь ласка, спробуйте ще раз.") 
      } 
    })
  } else{
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
    ctx.scene.leave();
    ctx.scene.enter('direvativesMarket')
  }
}

module.exports = { amendOrderDirevativesScene }