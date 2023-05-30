const { users } = require("../../config.js");
const { RestClientV5 } = require("bybit-api");
const { spotAPI } = require("../../keyboards")
const chooseOtherButton = require('../chooseOtherButton.js')
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const getWalletBalanceSpotScene = new Scenes.BaseScene('walletBalanceSpot')

getWalletBalanceSpotScene.enter(async ctx => {
  let user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "walletBalanceSpot",
  });
  getWalletBalanceSpot(ctx, user)
})

const getWalletBalanceSpot = async(ctx, user) => {
  if (user) {
    ctx.reply("Введіть символ, наприклад: BTC, usdt, BiT. Або слово 'Усі' для виведення інформації про баланс усіх валют");
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });

    getWalletBalanceSpotScene.on(message("text"), async ctx => {
      let otherButton;
      await chooseOtherButton(ctx, ctx.message.text).then(value => {otherButton = value})
      if(otherButton == false) {
        if(ctx.message.text.match(/^[A-Za-z]/)) {
          clientByBit.getWalletBalance({accountType: "SPOT", coin: ctx.message.text.toUpperCase()})
            .then(async (result) => {
              if(result.retCode == 0) {
                await users.updateOne(
                  { idTelegram: ctx.chat.id },
                  { $set: { status: "spotMarket"}}  
                )
                await specificCoin(ctx, result.result.list[0].coin[0]);
                await ctx.reply("✅Операція отримання балансу успішна✅", spotAPI);
                ctx.scene.leave();
                ctx.scene.enter('spotMarket')
              } 
              else 
                throw new Error(result.retCode);
            })
            .catch((err) => {
              ctx.reply("❌Помилка виведення даних про поточний баланс");
              console.log(err);
            });
        } else if (ctx.message.text.match(/Усі/)) {
          clientByBit.getWalletBalance({ accountType: "SPOT" })
            .then(async (result) => {
              console.log(result)
              if(result.retCode == 0) {
                console.log(result.result.list[0])
                if(result.result.list[0].coin.length != 0) {
                  await users.updateOne(
                    { idTelegram: ctx.chat.id },
                    { $set: { status: "spotMarket"}}  
                  )
                  await ctx.reply("✅Операція отримання балансу успішна✅", spotAPI);
                  const list = result.result.list[0].coin;
                  list.forEach((coin) => specificCoin(ctx, coin));
                  ctx.scene.leave()
                  ctx.scene.enter('spotMarket')
                }
                else
                  ctx.reply(`Список криптовалют з балансом пустий 😔`)
              }
              else
                throw new Error(result.retCode);
            })
            .catch((err) => {
              ctx.reply("❌Помилка виведення даних про поточний баланс");
              console.log(err);
            });
        }
        else
          ctx.reply("❌Помилка, неправильно введено запит getWalletBalance. Будь ласка, спробуйте ще раз.")
       }
    })
  } 
  else{
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
    ctx.scene.leave()
    ctx.scene.enter('spotMarket')
  } 
}

const specificCoin = (ctx, result) => {
  let resultString = "";
  if (result.coin) 
    resultString += `<b>Криптовалюта:</b> ${result.coin}\n`;
  if (result.equity && result.equity != 0)
    resultString += `<b>Капитал поточної монети:</b> ${result.equity}\n`;
  if (result.usdValue && result.usdValue != 0)
    resultString += `<b>Вартість у доларах США:</b> ${result.usdValue}$\n`;
  if (result.walletBalance && result.walletBalance != 0)
    resultString += `<b>Баланс монети в гаманці:</b> ${result.walletBalance}\n`;
  if(result.free)
    resultString += `<b>Доступний баланс для спот гаманця:</b> ${result.free}\n`
  if(result.locked && result.locked != 0)
    resultString += `<b>Заблокований баланс для спот гаманця:</b> ${result.locked}\n`
  if (result.borrowAmount && result.borrowAmount != 0)
    resultString += `<b>Сума позики монети:</b> ${result.borrowAmount}\n`;
  if (result.availableToBorrow && result.availableToBorrow != 0)
    resultString += `<b>Доступна сума для запозичення:</b> ${result.availableToBorrow}\n`;
  if (result.availableToWithdraw && result.availableToWithdraw != 0)
    resultString += `<b>Доступна сума для виведення:</b> ${result.availableToWithdraw}\n`;
  if (result.accruedInterest && result.accruedInterest != 0)
    resultString += `<b>Нараховані відсотки:</b> ${result.accruedInterest}\n`;
  if (result.totalOrderIM && result.totalOrderIM != 0)
    resultString += `<b>Попередньо зайнятий запас для замовлення:</b> ${result.totalOrderIM}\n`;
  if (result.totalPositionIM && result.totalPositionIM != 0)
    resultString += `<b>Сума початкової маржі всіх позицій + Попередньо зайнята ліквідаційна комісія:</b> ${result.totalPositionIM}\n`;
  if (result.totalPositionMM && result.totalPositionMM != 0)
    resultString += `<b>Сума маржі обслуговування для всіх позицій:</b> ${result.totalPositionMM}\n`;
  if (result.unrealisedPnl && result.unrealisedPnl != 0)
    resultString += `<b>Нереалізовані прибутки та збитки:</b> ${result.unrealisedPnl}\n`;
  if (result.cumRealisedPnl && result.cumRealisedPnl != 0)
    resultString += `<b>Сукупні реалізовані прибутки та збитки:</b> ${result.cumRealisedPnl}`;
  return ctx.replyWithHTML(resultString);
};

module.exports = { getWalletBalanceSpotScene }