const { users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { direvativesAPI, direvativesWithoutAPI } = require("../../keyboards")
const chooseOtherButton = require('../chooseOtherButton.js')
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const getOrderBookDirevativesScene = new Scenes.BaseScene('getOrderBookDirevatives');

getOrderBookDirevativesScene.enter(async ctx => {
  let user = await users.findOne({
    idTelegram: ctx.chat.id,
    status: "orderBookDirevatives",
  });
  getOrderBookDirevatives(ctx, user);
})

const getOrderBookDirevatives = async (ctx, user) => {
  if (user) {
    ctx.replyWithHTML("Введіть пару символів, наприклад: BTCUSDT, ethusdt, BiTuSdT.\nЗа замовчуванням виведеться <b>25 запитів</b>, або ви можете обрати кількість запитів<b>(не може перевищувати 200)</b>, якщо ввести запит за форматом:\n\n<b>symbol:limit</b>\n\nНаприклад: BTCUSDT:30");
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    getOrderBookDirevativesScene.on(message("text"), async ctx => {
      let otherButton;
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) { 
        if (ctx.message.text.match(/[A-Za-z]+$/)) {
          clientByBit.getOrderbook({ category: "linear", symbol: ctx.message.text.toUpperCase() })
            .then(async (result) => {
              if(result.retCode == 0) {
                let user = await users.findOne({
                  idTelegram: ctx.chat.id,
                  status: "orderBookDirevatives",
                });
                (user.chooseButtonAPI == true) ? ctx.reply("✅Операція виведення книги замовлень успішна✅", direvativesAPI) : ctx.reply("✅Операція виведення книги замовлень успішна✅", direvativesWithoutAPI)
                await users.updateOne(
                  { idTelegram: ctx.chat.id },
                  { $set: { status: "direvativesMarket"}}  
                )
                const messages = infoOutput(result.result);
                for(let i = 0; i < messages.length; i++) 
                  await ctx.replyWithHTML(messages[i])
                ctx.scene.leave()
                ctx.scene.enter('direvativesMarket');
              }
              else 
                ctx.reply(`❌Помилка: ${result.retMsg}`)
            })
            .catch((err) => {
              ctx.reply("❌Помилка виведення книги замовлень");
              console.log(err);
            });
        }
        else if(ctx.message.text.match(/^[A-Za-z]+:\d+$/g)) {
          const arrayOfStrings = ctx.message.text.split(":");
          if(arrayOfStrings[1] <= 200) {
            clientByBit.getOrderbook({ category: "linear", symbol: arrayOfStrings[0].toUpperCase(), limit: parseInt(arrayOfStrings[1]) })
            .then(async (result) => {
              if(result.retCode == 0) {
                let user = await users.findOne({
                  idTelegram: ctx.chat.id,
                  status: "orderBookDirevatives",
                });
                (user.chooseButtonAPI == true) ? ctx.reply("✅Операція виведення книги замовлень успішна✅", direvativesAPI) : ctx.reply("✅Операція виведення книги замовлень успішна✅", direvativesWithoutAPI)
                await users.updateOne(
                  { idTelegram: ctx.chat.id },
                  { $set: { status: "direvativesMarket"}}  
                )
                const messages = infoOutput(result.result);
                for(let i = 0; i < messages.length; i++) 
                  await ctx.replyWithHTML(messages[i])
                ctx.scene.leave()
                ctx.scene.enter('direvativesMarket')
              } 
              else 
                ctx.reply(`❌Помилка: ${result.retMsg}`)
            })
            .catch((err) => {
              ctx.reply("❌Помилка виведення книги замовлень");
              console.log(err);
            });
          } 
          else 
            ctx.reply("❌Помилка ліміта, значення перевищує максимальне. Будь ласка, спробуйте ще раз та введіть значення менше")
        }
        else 
          ctx.reply("❌Помилка, неправильно введено запит. Будь ласка, спробуйте ще раз.")
      }
    })
  } else {
    ctx.reply("❌Помилка, функція не обрана❌")
    ctx.scene.leave()
    ctx.scene.enter('direvativesMarket')
  }
}

const infoOutput = (result) => {
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

module.exports = { getOrderBookDirevativesScene }