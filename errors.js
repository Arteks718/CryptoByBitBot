module.exports = (ctx, error) => {
  if(error.retCode == 10001) {
    if(error.retMsg.match('symbol'))
      ctx.reply("❌Помилка, неправильно введений символ")
  }
}