const { bot, users } = require("../../config");
const { RestClientV5 } = require("bybit-api");

module.exports = async (ctx) => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "cancelOrderDirevatives",
  });
  if(user) {
    ctx.reply("Введіть символ та номер ордера (отримати його за командою Get Open Orders)");
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    bot.hears(/^[A-Za-z]+:[a-fA-F0-9]{8}-(?:[a-fA-F0-9]{4}-){3}[a-fA-F0-9]{12}$/, (ctx) => {
      const arrayOfStrings = ctx.message.text.split(":");
      const symbol = arrayOfStrings[0];
      const orderId = arrayOfStrings[1];
      clientByBit.cancelOrder({ category: 'linear', symbol: symbol.toUpperCase(), orderId: orderId })
        .then(result => {
          if(result.retCode == 0) {
            ctx.reply("✅Операція видалення замовлення успішна✅");
          } else 
              throw new Error(result.retCode);
        })
        .catch((err) => {
          ctx.reply("❌Помилка видалення замовлення");
          console.log(err)
        });
    })
  } 
  else
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
}