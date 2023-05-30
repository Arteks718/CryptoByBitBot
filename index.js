const { bot, client, users } = require('./config.js')
const { Scenes, session } = require('telegraf')

const { authScene } = require('./inputAPIKeys.js') 
const { changeAPI } = require('./settings/changeAPIKeys.js')
const { settingsScene } = require("./settings/settings.js");
const { infoScene } = require("./info.js");
const { direvativesMarketScene } = require("./derivatives/derivativesMarket.js")
const { spotMarketScene } = require("./spot/spotMarket.js")

//derivatives functions
const { amendOrderDirevativesScene } = require('./derivatives/functions/amendOrder.js');
const { getTickersDirevativesScene } = require('./derivatives/functions/getTickers.js')
const { cancelAllOrdersDirevativesScene } = require('./derivatives/functions/cancelAllOrders.js')
const { cancelOrderDirevativesScene } = require('./derivatives/functions/cancelOrder.js')
const { getKlineDirevativesScene } = require('./derivatives/functions/getKline.js')
const { getOrderBookDirevativesScene } = require('./derivatives/functions/getOrderBook.js')
const { placeOrderDirevativesScene } = require('./derivatives/functions/placeOrder.js')
const { getOpenOrdersDirevativesScene } = require('./derivatives/functions/getOpenOrders.js')
const { getOrdersHistoryDirevativesScene } = require('./derivatives/functions/getOrdersHistory.js')
const { getWalletBalanceDirevativesScene } = require('./derivatives/functions/getWalletBalance.js')

//spot functions
const { getTickersSpotScene } = require('./spot/functions/getTickers.js')
const { getKlineSpotScene } = require('./spot/functions/getKline.js')
const { getOrderBookSpotScene } = require('./spot/functions/getOrderBook.js')
const { getOpenOrdersSpotScene } = require('./spot/functions/getOpenOrders.js')
const { cancelOrderSpotScene } = require('./spot/functions/cancelOrder.js')
const { cancelAllOrdersSpotScene } = require('./spot/functions/cancelAllOrders.js')
const { getOrdersHistorySpotScene } = require('./spot/functions/getOrdersHistory.js')
const { getWalletBalanceSpotScene } = require('./spot/functions/getWalletBalance.js')
const { placeOrderSpotScene } = require('./spot/functions/placeOrder.js')

bot.use(session())
const stage = new Scenes.Stage([authScene, changeAPI, settingsScene, infoScene, direvativesMarketScene, spotMarketScene, amendOrderDirevativesScene, getTickersDirevativesScene, cancelAllOrdersDirevativesScene, cancelOrderDirevativesScene, getKlineDirevativesScene, getOrderBookDirevativesScene, placeOrderDirevativesScene, getOpenOrdersDirevativesScene, getOrdersHistoryDirevativesScene, getWalletBalanceDirevativesScene, getTickersSpotScene, getKlineSpotScene, getOrderBookSpotScene, getOpenOrdersSpotScene, cancelOrderSpotScene, cancelAllOrdersSpotScene, getOrdersHistorySpotScene, getWalletBalanceSpotScene, placeOrderSpotScene]);
bot.use(stage.middleware())

const startBot = require("./auth.js");
const { calldirevativesMarket, callSpotMarket, callMainMenu } = require('./mainMenu.js');

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
  await calldirevativesMarket(ctx)
  await ctx.scene.enter('direvativesMarket')
})

bot.hears('Ринок Споту', async (ctx) => {
  await callSpotMarket(ctx)
  await ctx.scene.enter('spotMarket')
})

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