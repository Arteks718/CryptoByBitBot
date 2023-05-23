const { bot, users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { directivesAPI, directivesWithoutAPI } = require("../../keyboards")

module.exports = async (ctx) => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    status: "tickersDirevatives",
  });
  if (user) {
    ctx.reply("Введіть пару символів, наприклад: BTCUSDT, ethusdt, BiTuSdT");
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    bot.hears(/^[A-Za-z]/, (ctx) => {
      clientByBit
        .getTickers({
          category: "linear",
          symbol: ctx.message.text.toUpperCase(),
        })
        .then(async (result) => {
          // console.log(result.result.list[0])
          if(result.retCode == 0) {
            let keyboard;
            (user.chooseButtonAPI == true) ? keyboard = directivesAPI : keyboard = directivesWithoutAPI;
            await users.updateOne(
              { idTelegram: ctx.chat.id },
              { $set: { status: "directivesMarket"}}  
            )
            ctx.reply("✅Операція виведення даних про криптовалюту успішна✅", keyboard);
            infoOutput(ctx, result.result.list[0]);
          } else{
            throw new Error(result.retCode);
          }
        })
        .catch((err) => {
          ctx.reply("❌Помилка");
          console.log(err);
        });
    });
  } 
  else
    ctx.reply("❌Помилка, функція не обрана❌")
};

const infoOutput = (ctx, result) => {
  let resultString = "";

  if (result.symbol) 
    resultString += `<b>Криптовалюта:</b> ${result.symbol}\n`;
  if (result.lastPrice)
    resultString += `<b>Остання ціна криптовалюти:</b> ${result.lastPrice}$\n`;
  if (result.prevPrice24h)
    resultString += `<b>Ринкова ціна 24 години тому</b> ${result.prevPrice24h}$\n`;
  if (result.price24hPcnt)
    resultString += `<b>Відсоткова ринкова зміна ціна за 24 години</b> ${result.price24hPcnt}%\n`;
  if (result.highPrice24h)
    resultString += `<b>Найвища ціна за 24 години</b> ${result.highPrice24h}$\n`;
  if (result.lowPrice24h)
    resultString += `<b>Найнижча ціна за 24 години</b> ${result.lowPrice24h}$\n`;
  if (result.volume24h)
    resultString += `<b>Об’єм торгівлі за 24 години</b> ${result.volume24h}$\n`;
  if (result.turnover24h)
    resultString += `<b>Оборот торгівлі за 24 години</b> ${result.turnover24h}$`;
  return ctx.replyWithHTML(resultString);
};
