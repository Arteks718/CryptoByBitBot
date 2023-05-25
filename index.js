const { bot, client, users } = require('./config.js')
const { Scenes, session } = require('telegraf')

const { authScene } = require('./inputAPIKeys.js') 
const { changeAPI } = require('./settings/changeAPIKeys.js')
const { settingsScene } = require("./settings/settings.js");
const { infoScene } = require("./info.js");

const { amendOrderDirevativesScene } = require('./derivatives/functions/amendOrder.js');
const { getTickersDirevativesScene } = require('./derivatives/functions/getTickers.js')
const { cancelAllOrdersDirevativesScene } = require('./derivatives/functions/cancelAllOrders.js')
const { cancelOrderDirevativesScene } = require('./derivatives/functions/cancelOrder.js')
const { getKlineDirevativesScene } = require('./derivatives/functions/getKline.js')
const { getOrderBookDirevativesScene } = require('./derivatives/functions/getOrderBook.js')
const { placeOrderDirevativesScene } = require('./derivatives/functions/placeOrder.js')
const { getOpenOrdersDirevativesScene } = require('./derivatives/functions/getOpenOrders.js')
const { getOrdersHistoryScene } = require('./derivatives/functions/getOrdersHistory.js')
const { getWalletBalanceDirevativesScene } = require('./derivatives/functions/getWalletBalance.js')

// const { hearsGetWalletBalanceDirevatives, hearsGetTickersDirevatives, hearsPlaceOrderDirevatives, hearsAmendOrderDirevatives } = require('./derivatives/derivativesMarket.js')

bot.use(session())
const stage = new Scenes.Stage([authScene, changeAPI, settingsScene, infoScene, amendOrderDirevativesScene, getTickersDirevativesScene, cancelAllOrdersDirevativesScene, cancelOrderDirevativesScene, getKlineDirevativesScene, getOrderBookDirevativesScene, placeOrderDirevativesScene, getOpenOrdersDirevativesScene, getOrdersHistoryScene, getWalletBalanceDirevativesScene]);
bot.use(stage.middleware())


const startBot = require("./auth.js");

const direvativesMarket = require("./derivatives/derivativesMarket.js")
const { calldirectivesMarket, callSpotMarket, callMainMenu } = require('./mainMenu.js');


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
  await ctx.scene.enter('settings')
})

bot.command("info", async (ctx) => {
  await users.updateOne(
    { idTelegram: ctx.chat.id},
    { $set: { status: 'info'}
  })
  await ctx.scene.enter('info')
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