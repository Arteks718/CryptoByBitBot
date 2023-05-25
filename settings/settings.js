const { bot, users} = require('../config.js')
const { subscribe, noSubscribe } = require('../keyboards.js')
// const inputAPIKeys = require('../inputAPIKeys.js')
const { Scenes } = require("telegraf");

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
      if(!user.isSubscribeNews) {
        
      }
      else
        ctx.reply("❌Помилка, ви вже підписані на оновлення")
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

