const { users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { direvativesAPI } = require("../../keyboards")
const chooseOtherButton = require('../chooseOtherButton.js')
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const cancelAllOrdersDirevativesScene = new Scenes.BaseScene("cancelAllOrdersDirevatives")

cancelAllOrdersDirevativesScene.enter(async ctx => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "cancelAllOrdersDirevatives",
  });
  cancelAllOrders(ctx, user);
})

const cancelAllOrders = async(ctx, user) =>{
  if(user){
    ctx.reply("Введіть пару символів за яким буде проводитись операція видалення усіх замовлень, наприклад: BTCUSDT, ethusdt, BiTuSdT")
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    cancelAllOrdersDirevativesScene.on(message("text"), async ctx => {
      let otherButton
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) {
        if(ctx.message.text.match(/^[A-Za-z]+$/)) {
          clientByBit.cancelAllOrders({category: 'linear', symbol: ctx.message.text.toUpperCase()})
          .then(async result => {
            if(result.retCode == 0) {
              if(result.result.list.length != 0) {
                await users.updateOne(
                  { idTelegram: ctx.chat.id },
                  { $set: { status: "direvativesMarket"}}  
                )
                await ctx.reply("✅Операція видалення усіх замовлень успішна✅", direvativesAPI);
                let listString = `Список усіх видаленних замовлень:`;
                result.result.list.forEach((order) => {
                  if(order.orderId)
                    listString += `\n\nІдентифікатор замовлення: ${order.orderId}`
                  if(order.orderLinkId)
                    listString += `\nКористувацький ідентифікатор замовлення: ${order.orderLinkId}`
                })
                await ctx.replyWithHTML(listString);
              } else {
                ctx.reply(`Список замовлень за криптовалютою ${ctx.message.text.toUpperCase()} пустий 😔`)
              }
              ctx.scene.leave()
              ctx.scene.enter('direvativesMarket')
            } 
            else
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
    ctx.scene.enter('direvativesMarket')
  } 
}

module.exports = { cancelAllOrdersDirevativesScene }