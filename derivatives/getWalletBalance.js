const { bot, users } = require('../config.js');

const { RestClientV5 } = require('bybit-api')

module.exports = async (ctx) => {
  if(await users.findOne({idTelegram: ctx.chat.id, chooseButtonAPI: true, apiKey: {$exists: true}, status: 'walletBalanceDirevatives'})) {
    ctx.reply("Введіть символ або Усі")
    const user = await users.findOne({idTelegram: ctx.chat.id});
    const clientByBit = new RestClientV5({
      key: user.apiKey,
      secret: user.apiSecret,
      testnet: false,
      recv_window: 5000
    });
    bot.hears(/^[A-Za-zА-Яа-яі]/, (ctx) => {
      console.log(ctx.message.text)
      if(/^[A-Za-z]/.test(ctx.message.text)) {
        clientByBit.getWalletBalance({accountType: 'CONTRACT', coin: ctx.message.text.toUpperCase()})
          .then(result => {
            console.log(result.result.list[0].coin)
            specificCoin(ctx, result.result.list[0].coin)
          })
          .catch(err => {
            console.log(err)
          });
      } else if('Усі' == ctx.message.text) {
        clientByBit.getWalletBalance({accountType: 'SPOT'})
        .then(result => {
            console.log(result.result.list[0])
          })
        .catch(err => {
          console.log(err)
        });
      }
    })
  } else {
    ctx.reply('❌Помилка!')
  }
}

const specificCoin = (ctx, result) => {
  let resultString = '';
  if(result.coin) resultString += `<b>Криптовалюта</b> ${result.coin}/n`
  // (result.equity) ? resultString += 
  console.log(resultString)
}

