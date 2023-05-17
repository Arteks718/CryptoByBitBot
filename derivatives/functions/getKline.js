const { bot, users } = require("../../config");
const { RestClientV5 } = require("bybit-api");

module.exports = async (ctx) => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    status: "klineDirevatives",
  });
  if(user) {
    ctx.reply("Введіть символ, інтервал та за бажанням ліміт(за замовчуванням 25)");
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    bot.on("message", async (ctx) => {
      if(/^[A-Za-z]+-[A-Z\d]+-\d+$/g.test(ctx.message.text)) {
        const arrayOfStrings = ctx.message.text.split("-");
        const interval = arrayOfStrings[1];
        const limit = arrayOfStrings[2];
        if((interval == 1 || interval == 5 || interval == 15 || interval == 30 || interval == 60 || interval == 120 || interval == 240 || interval == 360 || interval == 720 || interval == 'D' || interval == 'M' || interval == 'W') && limit <= 100) {
          clientByBit
            .getKline({
              category: "linear",
              symbol: arrayOfStrings[0].toUpperCase(),
              interval: String(interval.toUpperCase()),
              limit: arrayOfStrings[2],
            })
            .then((result) => {
              if(result.retCode == 0) {
                ctx.reply("✅Операція успішна✅");
                infoOutput(ctx, result.result);
                console.log(result)
              }
              else
                throw new Error(result.retCode);
            })
            .catch((err) => {
              ctx.reply("❌Помилка");
              console.log(err)
            });
        } else ctx.reply("❌Помилка. Неправильно введено введений інтервал або ліміт. Будь ласка, спробуйте ще раз.")
      }
      else if(/^[A-Za-z]+-[A-Za-z\d]+/.test(ctx.message.text)) {
        const arrayOfStrings = ctx.message.text.split("-");
        const interval = arrayOfStrings[1];
        if(interval == 1 || interval == 5 || interval == 15 || interval == 30 || interval == 60 || interval == 120 || interval == 240 || interval == 360 || interval == 720 || interval == 'D' || interval == 'M' || interval == 'W') {
          clientByBit
            .getKline({
              category: "linear",
              symbol: arrayOfStrings[0].toUpperCase(),
              interval: String(interval.toUpperCase()),
              limit: 20,
            })
            .then((result) => {
              if(result.retCode == 0) {
                ctx.reply("✅Операція успішна✅");
                infoOutput(ctx, result.result);
                console.log(result)
              }
              else
                throw new Error(result.retCode);
            })
            .catch((err) => {
              ctx.reply("❌Помилка");
              console.log(err)
            });
        } else ctx.reply("❌Помилка. Неправильно введено введений інтервал. Будь ласка, спробуйте ще раз.")
      }

    })
  }
}

const infoOutput = (ctx, result) => {
  let resultString = "";
  if(result.symbol)
    resultString += `<b>Криптовалюта:</b> ${result.symbol}\n`;
  if(result.list)
    result.list.forEach((item) => {
      resultString += `\n\t\t\t<b>Відкрита ціна:</b> ${item[1]}`
      resultString += `\n\t\t\t<b>Найвища ціна:</b> ${item[2]}`
      resultString += `\n\t\t\t<b>Найнижча ціна:</b> ${item[3]}`
      resultString += `\n\t\t\t<b>Ціна закриття:</b> ${item[4]}\n`
    })
  return ctx.replyWithHTML(resultString);
}