const getWalletBalance = require("./getWalletBalance");
const {bot, users } = require("../config.js");

module.exports = () => {
  bot.hears("Get Wallet Balance", (ctx) => {
    users.updateOne(
      { idTelegram: ctx.chat.id },
      { $set: { status: 'walletBalanceDirevatives' } } );
    getWalletBalance(ctx);
  });
}

