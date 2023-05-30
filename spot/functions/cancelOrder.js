const { users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { spotAPI } = require("../../keyboards")
const chooseOtherButton = require('../chooseOtherButton.js')
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const cancelOrderSpotScene = new Scenes.BaseScene('cancelOrderSpot')

cancelOrderSpotScene.enter(async ctx => {
    let user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "cancelOrderSpot",
  });
  cancelOrderSpot(ctx, user)
})

const cancelOrderSpot = async (ctx, user) => {
  if(user) {
    ctx.replyWithHTML(`Введіть запит за наступим виклядом:\n<i>symbol:orderId</i>\n\nsymbol - це символ пошуку(наприклад BTCUSD, ethusdt)\norderId - це ідентифікатор замовлення, отримати його можна за командою "Get Open Orders"\nОсь приклад введення запиту:\n<i>BTCUSDT:1431320586543534080</i>`);
    let clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    cancelOrderSpotScene.on(message("text"), async ctx => {
      let otherButton;
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) {
        if(ctx.message.text.match(/^[A-Za-z]+:\d+$/)) {
          const arrayOfStrings = ctx.message.text.split(":");
          const symbol = arrayOfStrings[0];
          const orderId = arrayOfStrings[1];
          clientByBit.cancelOrder({ category: 'spot', symbol: symbol.toUpperCase(), orderId: orderId })
            .then(async result => {
              if(result.retCode == 0) {
                await users.updateOne(
                  { idTelegram: ctx.chat.id },
                  { $set: { status: "spotMarket"}}  
                )
                ctx.reply("✅Операція видалення замовлення успішна✅", spotAPI);
                ctx.scene.leave();
                ctx.scene.enter('spotMarket')
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
    ctx.scene.enter('spotMarket')
  }
}

module.exports = { cancelOrderSpotScene }