const { users } = require('../config')

module.exports = async (ctx) => {
  const user = await users.findOne({idTelegram: ctx.chat.id})
  let currentNews = {
    total: 0
  };
  setInterval(() => {
    fetch('https://api.bybit.com/v5/announcements/index?locale=uk-UA&limit=2')
    .then((response) => {return response.json() })
    .then((data) => {
      if(user.isSubscribeNews == true) {
        if(data.result.total != currentNews.total) {
          currentNews = data.result;
          (data.result.list[1].description != '')
            ? ctx.replyWithHTML(`<b>Нова новина!</b>\n\n\t\t\t<b>${data.result.list[1].title}</b>\n${data.result.list[1].description}\n\nПосилання на <a href="${data.result.list[1].url}">новину</a>\nДата новини: ${new Date(Number(data.result.list[1].dateTimestamp)).toLocaleString()}`)
            : ctx.replyWithHTML(`<b>Нова новина!</b>\n\n\t\t\t<b>${data.result.list[1].title}</b>\n\nПосилання на <a href="${data.result.list[1].url}">новину</a>\nДата новини: ${new Date(Number(data.result.list[1].dateTimestamp)).toLocaleString()}`)
        }
      } else {
        clearInterval(0)
      }
    })
    .catch(err => console.log(err))
  }, 600000)
}