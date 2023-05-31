const { bot, users} = require('../config.js')
const { subscribe, noSubscribe } = require('../keyboards.js')
const { Scenes } = require("telegraf");
const getAnnouncement = require('./getAnnouncement.js')

const settingsScene = new Scenes.BaseScene('settings');

settingsScene.enter(async ctx => {
  let user = await users.findOne({ idTelegram: ctx.chat.id, status: 'settings' })
  if(user) {
    (user.isSubscribeNews) ? ctx.reply("🛠Ласкаво просимо до налаштувань🛠", subscribe) : ctx.reply("🛠Ласкаво просимо до налаштувань🛠", noSubscribe)
    bot.hears("Змінити API ключі", async ctx => {
      users.updateOne(
        { idTelegram: ctx.chat.id },
        { $set: { status: "inputAPIKey"}}
      );
      ctx.scene.enter("changeAPI")
    })
    bot.hears("Підписатись на оновлення", async ctx => {
      let user = await users.findOne({ idTelegram: ctx.chat.id, status: 'settings' })
      if(user.isSubscribeNews == false) {
        await users.updateOne(
          { idTelegram: ctx.chat.id },
          { $set: { isSubscribeNews: true }}
        );
        ctx.reply("✅Ви успішно підписались на оновлення!✅", subscribe)
        getAnnouncement(ctx)
      }
      else
        ctx.reply("❌Помилка, ви вже підписані на оновлення")
    })
    bot.hears("Відписатись від оновлень", async ctx => {
      let user = await users.findOne({ idTelegram: ctx.chat.id, status: 'settings' })
      if(user.isSubscribeNews == true) {
        await users.updateOne(
          { idTelegram: ctx.chat.id },
          { $set: { isSubscribeNews: false }}
        );
        ctx.reply("✅Ви успішно відписались від оновлень!✅", noSubscribe)
        getAnnouncement(ctx)
      }
      else
        ctx.reply("❌Помилка, ви вже відписані від оновлень")
    })
  }
})

module.exports = { settingsScene }

// module.exports = async (ctx) => {
//   let user = await users.findOne({ idTelegram: ctx.chat.id, status: 'settings' })
//   if(user) {
//     (user.isSubscribeNews) ? ctx.reply("🛠Ласкаво просимо до налаштувань🛠", subscribe) : ctx.reply("🛠Ласкаво просимо до налаштувань🛠", noSubscribe)
//     bot.hears("Змінити API ключі", async ctx => {
//       users.updateOne(
//         { idTelegram: ctx.chat.id },
//         { $set: { status: "inputAPIKey"}}
//       );
//       ctx.scene.enter("changeAPI")
//     })
//     bot.hears("Підписатись на оновлення", async ctx => {
//       if(!user.isSubscribeNews) {
        
//       }
//       else
//         ctx.reply("❌Помилка, ви вже підписані на оновлення")
//     })
//   }
// }

