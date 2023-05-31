const { users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { spotAPI } = require("../../keyboards")
const chooseOtherButton = require('../chooseOtherButton.js')
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const cancelAllOrdersSpotScene = new Scenes.BaseScene("cancelAllOrdersSpot")

cancelAllOrdersSpotScene.enter(async ctx => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "cancelAllOrdersSpot",
  });
  cancelAllOrders(ctx, user);
})

const cancelAllOrders = async(ctx, user) =>{
  if(user){
    ctx.reply("Введіть символ за яким будуть видалятись усі замовлення")
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    cancelAllOrdersSpotScene.on(message("text"), async ctx => {
      let otherButton
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) {
        if(ctx.message.text.match(/^[A-Za-z]+$/)) {
          clientByBit.cancelAllOrders({category: 'spot', symbol: ctx.message.text.toUpperCase()})
          .then(async result => {
            if(result.retCode == 0) {
              await users.updateOne(
                { idTelegram: ctx.chat.id },
                { $set: { status: "spotMarket"}}  
              )
              await ctx.reply("✅Операція видалення усіх замовлень успішна✅", spotAPI);
              await ctx.reply(`Кількість видаленних замовлень: ${result.result.success}`)
              ctx.scene.leave()
              ctx.scene.enter('spotMarket')
            } else
                ctx.reply(`❌Помилка: ${result.retMsg}`)
          })
          .catch((err) => {
            ctx.reply("❌Помилка видалення усіх замовлень");
            console.log(err)
          });
        }
        else
          ctx.reply("❌Помилка, неправильно введено запит. Будь ласка, спробуйте ще раз.") 
      }
    })
  }
  else {
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
    ctx.scene.leave()
    ctx.scene.enter('spotMarket')
  } 
}

module.exports = { cancelAllOrdersSpotScene }