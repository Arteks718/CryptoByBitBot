const { users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { spotAPI, spotWithoutAPI } = require("../../keyboards")
const chooseOtherButton = require('../chooseOtherButton.js')
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const getKlineSpotScene = new Scenes.BaseScene('getKlineSpot')

getKlineSpotScene.enter(async ctx =>{
  let user = await users.findOne({
    idTelegram: ctx.chat.id,
    status: "klineSpot",
  });
  getKlineSpot(ctx, user)
})

const getKlineSpot = async (ctx, user) => {
  if(user) {
    ctx.replyWithHTML("Введіть параметри spot за наступним виглядом:\n\n<b>symbol:interval</b>\nабо\n<b>symbol:interval:limit</b>\n\n<b>symbol</b> - це символ пошуку(наприклад BTCUSD, ethusdt)\n<b>interval</b> - це інтервал між запитами, допускаються лише такі параметри: 1 5 15 30 60 120 240 360 720 D M W (цифри означають хвилини)\n<b>limit</b> - це кількість запитів для отримання, в першому випадку він становить 20, в другому його можна ввести(не може бути більше 100)");
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    getKlineSpotScene.on(message("text"), async ctx => {
      let otherButton;
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) { 
        if(ctx.message.text.match(/^[A-Za-z]+:[A-Z\d]+:\d+$/g)) {
          const arrayOfStrings = ctx.message.text.split(":");
          const interval = arrayOfStrings[1];
          const limit = arrayOfStrings[2];
          if((interval == 1 || interval == 5 || interval == 15 || interval == 30 || interval == 60 || interval == 120 || interval == 240 || interval == 360 || interval == 720 || interval == 'D' || interval == 'M' || interval == 'W') && limit <= 100) {
            clientByBit.getKline({category: "spot", symbol: arrayOfStrings[0].toUpperCase(), interval: String(interval.toUpperCase()), limit: limit})
              .then(async (result) => {
                if(result.retCode == 0) {
                  const user = await users.findOne({
                    idTelegram: ctx.chat.id,
                    status: "klineSpot",
                  });
                  (user.chooseButtonAPI == true) ? ctx.reply("✅Операція виведення списку клинів успішна✅", spotAPI) : ctx.reply("✅Операція виведення списку клинів успішна✅", spotWithoutAPI)
                  await users.updateOne(
                    { idTelegram: ctx.chat.id },
                    { $set: { status: "spotMarket"}}  
                  )
                  const messages = infoOutput(result.result);
                  for(let i = 0; i < messages.length; i++) 
                    await ctx.replyWithHTML(messages[i])
                  ctx.scene.leave();
                  ctx.scene.enter('spotMarket')
                }
                else
                  throw new Error(result.retCode);
              })
              .catch((err) => {
                ctx.reply("❌Помилка виведення даних getKline");
                console.log(err)
              });
          } 
          else 
            ctx.reply("❌Помилка. Неправильно введено введений інтервал або ліміт. Будь ласка, спробуйте ще раз.")
        } 
        else if(/^[A-Za-z]+:[A-Za-z\d]+$/.test(ctx.message.text)) {
          const arrayOfStrings = ctx.message.text.split(":");
          const interval = arrayOfStrings[1];
          if(interval == 1 || interval == 5 || interval == 15 || interval == 30 || interval == 60 || interval == 120 || interval == 240 || interval == 360 || interval == 720 || interval == 'D' || interval == 'M' || interval == 'W') {
            clientByBit.getKline({category: "spot", symbol: arrayOfStrings[0].toUpperCase(),interval: String(interval.toUpperCase()), limit: 20})
              .then(async (result) => {
                if(result.retCode == 0) {
                  const user = await users.findOne({
                    idTelegram: ctx.chat.id,
                    status: "klineSpot",
                  });
                  (user.chooseButtonAPI == true) ? ctx.reply("✅Операція виведення списку клинів успішна✅", spotAPI) : ctx.reply("✅Операція виведення списку клинів успішна✅", spotWithoutAPI)
                  await users.updateOne(
                    { idTelegram: ctx.chat.id },
                    { $set: { status: "spotMarket"}}  
                  )
                  const messages = infoOutput(result.result);
                  for(let i = 0; i < messages.length; i++) 
                    await ctx.replyWithHTML(messages[i])
                  ctx.scene.leave()
                  ctx.scene.enter('spotMarket')
                }
                else
                  throw new Error(result.retCode);
              })
              .catch((err) => {
                ctx.reply("❌Помилка виведення даних getKline");
                console.log(err)
              });
          } 
          else 
            ctx.reply("❌Помилка. Неправильно введено введений інтервал. Будь ласка, спробуйте ще раз.")
        }
        else
          ctx.reply("❌Помилка, неправильно введено запит getKline. Будь ласка, спробуйте ще раз.")
      }
    })
  }
  else {
    ctx.reply("❌Помилка, функція не обрана❌")
    ctx.scene.leave()
    ctx.scene.enter('spotMarket')
  }
}

const infoOutput = (result) => {
  let resultString = "";
  if(result.symbol)
    resultString += `<b>Криптовалюта:</b> ${result.symbol}\n`;
  if(result.list)
    result.list.forEach((item) => {
      resultString += `\n\t\t\t<b>Час початку клина:</b> ${new Date(Number(item[0])).toLocaleString()}`
      resultString += `\n\t\t\t<b>Відкрита ціна:</b> ${item[1]}`
      resultString += `\n\t\t\t<b>Найвища ціна:</b> ${item[2]}`
      resultString += `\n\t\t\t<b>Найнижча ціна:</b> ${item[3]}`
      resultString += `\n\t\t\t<b>Ціна закриття:</b> ${item[4]}\n`
    })
    const chunks = [];
    let currentChunk = '';
  
    const lines = resultString.split('\n');
  
    for (const line of lines) {
      if (currentChunk.length + line.length + 1 <= 4096) {
        currentChunk += line + '\n';
      } else {
        chunks.push(currentChunk);
        currentChunk = line + '\n';
      }
    }
    if (currentChunk)
      chunks.push(currentChunk);
    return chunks
}

module.exports = { getKlineSpotScene }