const { Scenes, session } = require('telegraf')
const { bot, client, users } = require('./config.js')
const { authScene } = require('./inputAPIKeys.js') 
const { changeAPI } = require('./settings/changeAPIKeys.js')
const { amendOrderScene } = require('./derivatives/functions/amendOrder.js');
// const { hearsGetWalletBalanceDirevatives, hearsGetTickersDirevatives, hearsPlaceOrderDirevatives, hearsAmendOrderDirevatives } = require('./derivatives/derivativesMarket.js')


const getInfoText = require("./info.js");
const startBot = require("./auth.js");
const settingsBot = require("./settings/settings.js");
const direvativesMarket = require("./derivatives/derivativesMarket.js")
const { calldirectivesMarket, callSpotMarket, callMainMenu } = require('./mainMenu.js');

bot.use(session())
const stage = new Scenes.Stage([authScene, changeAPI, amendOrderScene]);
bot.use(stage.middleware())

bot.start(async (ctx) => {

  await client.connect();
  console.log("Connect completed");
  await startBot(ctx);
})

bot.command("settings", async (ctx) => {
  await users.updateOne(
    { idTelegram: ctx.chat.id},
    { $set: { status: 'settings'}
  })
  await settingsBot(ctx);
})

bot.command("info", async (ctx) => {
  await users.updateOne(
    { idTelegram: ctx.chat.id},
    { $set: { status: 'info'}
  })
  await getInfoText(ctx);
})

bot.hears('Ринок Деривативів (USDT безстрокові)', async (ctx) => {
  await calldirectivesMarket(ctx);
  await direvativesMarket();
})

bot.hears('Ринок Споту', (ctx) => callSpotMarket(ctx))

bot.hears("Повернутись на головну", (ctx) => callMainMenu(ctx))

bot.hears("Новость", ctx => {
  fetch('https://api.bybit.com/v5/announcements/index?locale=uk-UA&limit=1')
  .then((response) => {return response.json() })
  .then((data) => {
    ctx.replyWithHTML(`<b>Нова новина!</b>\n\n\t\t\t<b>${data.result.list[0].title}</b>\n${data.result.list[0].description}\n\nПосилання на <a href="${data.result.list[0].url}">новину</a>\nДата новини: ${new Date(Number(data.result.list[0].dateTimestamp)).toLocaleString()}`)
  })
  .catch(err => console.log(err))
})

bot.launch();