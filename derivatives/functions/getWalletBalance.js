const { bot, users } = require("../../config.js");
const { RestClientV5 } = require("bybit-api");

module.exports = async (ctx) => {
  const user = await users.findOne({
    idTelegram: ctx.chat.id,
    chooseButtonAPI: true,
    apiKey: { $exists: true },
    status: "walletBalanceDirevatives",
  });
  if (user) {
    ctx.reply("Введіть символ або 'Усі' для виведення балансу усіх монет");
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000,
    });
    bot.hears(/^[A-Za-zА-Яа-яі]/, (ctx) => {
      if (/^[A-Za-z]/.test(ctx.message.text)) {
        clientByBit
          .getWalletBalance({
            accountType: "CONTRACT",
            coin: ctx.message.text.toUpperCase(),
          })
          .then((result) => {
            if(result.retCode == 0) {
              ctx.reply("✅Операція успішна✅");
              specificCoin(ctx, result.result.list[0].coin[0]);
            } else throw new Error(result.retCode);
            
          })
          .catch((err) => {
            console.log(err);
          });
      } else if ("Усі" == ctx.message.text) {
        clientByBit
          .getWalletBalance({ accountType: "CONTRACT" })
          .then((result) => {
            ctx.reply("✅Операція успішна✅");
            const list = result.result.list[0].coin;
            list.forEach((coin) => specificCoin(ctx, coin));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  } 
  else 
    ctx.reply("❌Помилка, функція не обрана, або ваш аккаунт не підходить до даної функції❌")
};

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
