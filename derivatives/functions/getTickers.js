const { users } = require("../../config");
const errors = require("../../errors");
const { RestClientV5 } = require("bybit-api");
const { direvativesAPI, direvativesWithoutAPI } = require("../../keyboards")
const chooseOtherButton = require('../chooseOtherButton')
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const getTickersDirevativesScene = new Scenes.BaseScene('getTickersDirevatives')

getTickersDirevativesScene.enter(async ctx => {
  let user = await users.findOne({
    idTelegram: ctx.chat.id,
    status: "tickersDirevatives",
  });
  getTickersDirevatives(ctx, user)
})

const getTickersDirevatives = async(ctx, user) => {
  if (user) {
    ctx.reply("Введіть пару символів, наприклад: BTCUSDT, ethusdt, BiTuSdT");
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    getTickersDirevativesScene.on(message("text"), async ctx => {
      let otherButton;
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) {
        if(ctx.message.text.match(/^[A-Za-z]/)) {
          clientByBit.getTickers({category: "linear", symbol: ctx.message.text.toUpperCase()})
            .then(async (result) => {
              if(result.retCode == 0) {
                const user = await users.findOne({
                  idTelegram: ctx.chat.id,
                  status: "tickersDirevatives",
                });
                (user.chooseButtonAPI == true) ? ctx.reply("✅Операція виведення даних про криптовалюту успішна✅", direvativesAPI) : ctx.reply("✅Операція виведення даних про криптовалюту успішна✅", direvativesWithoutAPI)
                await users.updateOne(
                  { idTelegram: ctx.chat.id },
                  { $set: { status: "direvativesMarket"}}  
                )
                infoOutput(ctx, result.result.list[0]);
                ctx.scene.leave()
                ctx.scene.enter('direvativesMarket')
              } 
              else
                ctx.reply(`❌Помилка: ${result.retMsg}`)
            })
            .catch((err) => {
              ctx.reply("❌Помилка виведення даних про криптовалюту");
              console.log(err);
            });
        }
        else
          ctx.reply("❌Помилка, неправильно введено запит. Будь ласка, спробуйте ще раз.")
      }
    })
  }
  else {
    ctx.reply("❌Помилка, функція не обрана❌")
    ctx.scene.leave()
    ctx.scene.enter('direvativesMarket')
  }
}

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
    resultString += `<b>Оборот торгівлі за 24 години</b> ${Math.round(result.turnover24h)}$`;
  return ctx.replyWithHTML(resultString);
};

module.exports = { getTickersDirevativesScene }