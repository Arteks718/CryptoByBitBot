const { users } = require("../config.js");
const { subscribe, noSubscribe } = require("../keyboards.js");
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const changeAPI = new Scenes.BaseScene('changeAPI');

changeAPI.enter(ctx => ctx.reply("Введіть API Key та API Secret Key у форматі APIKEY:APISECRET"))

changeAPI.on(message("text"), async ctx => {
  const arrayButtons = ['/start', '/settings','/info', 'Змінити API ключі', 'Підписатись на оновлення', 'Повернутись на головну'];
  let otherButton;
  arrayButtons.forEach(button => {if(ctx.message.text === button) {ctx.scene.leave(); otherButton = true;} })
  if(!otherButton) {
    let user = await users.findOne({ idTelegram: ctx.chat.id })
    if(ctx.message.text.match(/^[A-Za-z0-9]{18}:[A-Za-z0-9]{36}/g)) {
      const arrayOfStrings = ctx.message.text.split(":");
      users.updateOne(
        { idTelegram: ctx.chat.id },
        {
          $set: {
            status: 'settings',
            apiKey: arrayOfStrings[0],
            apiSecret: arrayOfStrings[1],
          },
        }
      );
      (user.isSubscribeNews) ? ctx.reply("✅Ключі успішно збережено✅", subscribe) : ctx.reply("✅Ключі успішно збережено✅", noSubscribe)
  
      return ctx.scene.leave();
    } else {
      await ctx.reply("❌Неправильно введені API ключі. Будь ласка, спробуйте ще раз.")
  
      return ctx.scene.enter("changeAPI");
    }
  }
})

module.exports = { changeAPI }