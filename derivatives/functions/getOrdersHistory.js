const { users } = require("../../config");
const { RestClientV5 } = require("bybit-api");
const { direvativesAPI } = require("../../keyboards")
const chooseOtherButton = require('../chooseOtherButton.js')
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const getOrdersHistoryDirevativesScene = new Scenes.BaseScene('getOrdersHistoryDirevatives')

getOrdersHistoryDirevativesScene.enter(async ctx => {
  let user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "getOrdersHistoryDirevatives",
  });
  getOrdersHistory(ctx, user)
})

const getOrdersHistory = async(ctx, user) => {
  if(user) {
    ctx.replyWithHTML(`Введіть пару символів, наприклад: BTCUSDT, ethusdt, BiTuSdT.За замовчуванням виведеться 20 запитів, або ви можете обрати кількість запитів(не може перевищувати 50), якщо ввести запит за форматом:\n\n<b>symbol:limit</b>\n\nНаприклад: BTCUSDT:30`);
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    getOrdersHistoryDirevativesScene.on(message("text"), async ctx => {
      let otherButton;
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) { 
        if(ctx.message.text.match(/^[A-Za-z]+:\d+$/g)) {
          const arrayOfStrings = ctx.message.text.split(":");
          if(arrayOfStrings[1] < 50) {
            clientByBit.getHistoricOrders({category: 'linear', symbol: arrayOfStrings[0].toUpperCase(), limit: Number(arrayOfStrings[1])})
              .then(async result => {
                if(result.retCode == 0) {
                  if(result.result.list.length != 0) {
                    await users.updateOne(
                      { idTelegram: ctx.chat.id },
                      { $set: { status: "direvativesMarket"}}  
                    )
                    await ctx.reply("✅Операція виведення історії замовлень, успішна✅", direvativesAPI);
                    result.result.list.forEach(item => infoOutput(ctx,item))
                    ctx.scene.leave();
                    ctx.scene.enter('direvativesMarket')
                   } else {
                    ctx.reply(`Список історії замовлень за криптовалютою ${ctx.message.text.toUpperCase()} пустий 😔`)
                    ctx.scene.leave();
                    ctx.scene.enter('direvativesMarket')
                   }
                }              
                else
                  ctx.reply(`❌Помилка: ${result.retMsg}`)
              })
              .catch((err) => {
                ctx.reply("❌Помилка виведення історії замовлень");
                console.log(err)
              });
          }
          else
            clx.reply("❌Помилка, кількість запитів перевищує максимально допустиме. Будь ласка, введіть значення менше та спробуйте ще раз.")          
        }       
        else if(/^[A-Za-z]+/.test(ctx.message.text)){
          clientByBit.getHistoricOrders({category: 'linear', symbol: ctx.message.text.toUpperCase()})
            .then(async result => {
              if(result.retCode == 0) {
                if(result.result.list.length != 0) {
                  await users.updateOne(
                    { idTelegram: ctx.chat.id },
                    { $set: { status: "direvativesMarket"}} 
                  )
                  await ctx.reply("✅Операція виведення історії замовлень, успішна✅", direvativesAPI);
                  result.result.list.forEach(item => infoOutput(ctx,item))
                  ctx.scene.leave();
                  ctx.scene.enter('direvativesMarket')
                } else {
                  ctx.reply(`Список історії замовлень за криптовалютою ${ctx.message.text.toUpperCase()} пустий 😔`)
                  ctx.scene.leave();
                  ctx.scene.enter('direvativesMarket')
                }
              }
              else
                ctx.reply(`❌Помилка: ${result.retMsg}`)
            })
            .catch((err) => {
              ctx.reply("❌Помилка виведення історії замовлень");
              console.log(err)
          });
        }
      }
    })
  }
  else {
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
    ctx.scene.leave();
    ctx.scene.enter('direvativesMarket')
  }
}

const infoOutput = async (ctx, result) => {
  let resultString = '';
  if(result.symbol)
    resultString += `<b>Криптовалюта:</b> ${result.symbol}\n`
  if(result.side)
    resultString += `<b>Сторона:</b> ${result.side}\n`
  if(result.qty)
    resultString += `<b>Кількість:</b> ${result.qty}\n`
  if(result.price)
    resultString += `<b>Ціна</b> ${result.price}\n`
  if(result.orderType)
    resultString += `<b>Тим замовлення:</b> ${result.orderType}\n`
  if(result.orderId)
    resultString += `<b>Ідентифікатор замовлення:</b> ${result.orderId}\n`
  if(result.orderLinkId)
    resultString += `<b>Користувацький ідентифікатор замовлення:</b> ${result.orderLinkId}\n`
  if(result.orderStatus)
    resultString += `<b>Статус замовлення:</b> ${result.orderStatus}\n`
  if(result.stopOrderStatus && result.stopOrderStatus != 'UNKNOWN')
    resultString += `<b>Статус зупинки замовлення:</b> ${result.stopOrderStatus}\n`
  if(result.takeProfit && result.takeProfit != 'UNKNOWN')
    resultString += `<b>Ціна отримання прибутку:</b> ${result.takeProfit}\n`
  if(result.stopLoss && result.stopLoss != 'UNKNOWN')
    resultString += `<b>Ціна зупинки збитків</b> ${result.stopLoss}\n`
  resultString += `<b>Дата створення замовлення</b> ${new Date(Number(result.createdTime)).toLocaleString()}`
  await ctx.replyWithHTML(resultString)
}

module.exports = { getOrdersHistoryDirevativesScene }