const { bot, users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { directivesAPI } = require("../../keyboards")


module.exports = async (ctx) => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "cancelAllOrdersDirevatives",
  });
  if(user){
    ctx.reply("Введіть символ за яким будуть видалятись усі замовлення")
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    bot.hears(/^[A-Za-z]+$/, async (ctx) => {
      clientByBit.cancelAllOrders({category: 'linear', symbol: ctx.message.text.toUpperCase()})
        .then(async result => {
          if(result.retCode == 0) {
            await users.updateOne(
              { idTelegram: ctx.chat.id },
              { $set: { status: "directivesMarket"}}  
            )
            await ctx.reply("✅Операція видалення усіх замовлень успішна✅", directivesAPI);
            let listString = `Список усіх видаленних замовлень:`;
            result.result.list.forEach((order) => {
              if(order.orderId)
                listString += `\n\nІдентифікатор замовлення: ${order.orderId}`
              if(order.orderLinkId)
                listString += `\nКористувацький ідентифікатор замовлення: ${order.orderLinkId}`
            })
            await ctx.replyWithHTML(listString);

          } else
              throw new Error(result.retCode);
        })
        .catch((err) => {
          ctx.reply("❌Помилка видалення усіх замовлень");
          console.log(err)
        });
    })
  }
  else
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
}