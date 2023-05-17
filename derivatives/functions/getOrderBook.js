const { bot, users } = require("../../config");
const { RestClientV5 } = require("bybit-api");

module.exports = async (ctx) => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    status: "orderBookDirevatives",
  });
  if (user) {
    ctx.replyWithHTML("Введіть пару символів, наприклад: BTCUSDT, ethusdt, BiTuSdT.\nВ даному випадку виведеться 25 запитів, або ви можете обрати кількість запитів(не може перевищувати 200), якщо ввести запит за форматом, наприклад: BTCUSDT-30");
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    bot.on("message", async (ctx) => {
      if (/^[A-Za-z]+-\d+$/g.test(ctx.message.text)) {
        const arrayOfStrings = ctx.message.text.split("-");
        if(arrayOfStrings[1] <= 200) {
          clientByBit
          .getOrderbook({
            category: "linear",
            symbol: arrayOfStrings[0].toUpperCase(),
            limit: parseInt(arrayOfStrings[1]),
          })
          .then((result) => {
            if(result.retCode == 0) {
              ctx.reply("✅Операція успішна✅");
              infoOutput(ctx, result.result);
            } 
            else 
              throw new Error(result.retCode);
          })
          .catch((err) => {
            ctx.reply("❌Помилка");
            console.log(err);
          });
        } else ctx.reply("❌Помилка ліміта, значення перевищує максимальне. Будь ласка, спробуйте ще раз та введіть меньше значення")

      } 
      else if (/^[A-Za-z]/.test(ctx.message.text)) {
        clientByBit
          .getOrderbook({
            category: "linear",
            symbol: ctx.message.text.toUpperCase(),
          })
          .then((result) => {
            if(result.retCode == 0) {
              ctx.reply("✅Операція успішна✅");
              infoOutput(ctx, result.result);
            }
            else 
              throw new Error(result.retCode);
          })
          .catch((err) => {
            ctx.reply("❌Помилка");
            console.log(err);
          });
      }
      else 
        ctx.reply("❌Помилка, спробуйте ще раз");
    });
  } else {
    ctx.reply("❌Помилка, функція не обрана❌")
  }
};

const infoOutput = (ctx, result) => {
  let resultString = "";
  if(result.s)
    resultString += `<b>Криптовалюта:</b> ${result.s}\n`;
  if(result.b){
    resultString += `\n<b>Ставка покупця, сортована за ціною на спад</b>`;
    result.b.forEach((item) => {
      resultString += `\n\t\t\t<b>Ціна:</b> ${item[0]}$\n\t\t\t<b>Розмір:</b> ${item[1]}\n`;
    })
  }
  if(result.a){
    resultString += `\n<b>Запит продавця, сортована за ціною на зростання</b>`;
    result.a.forEach((item) => {
      resultString += `\n\t\t\t<b>Ціна:</b> ${item[0]}$\n\t\t\t<b>Розмір:</b> ${item[1]}\n`;
    })
  }
  return ctx.replyWithHTML(resultString);
}
