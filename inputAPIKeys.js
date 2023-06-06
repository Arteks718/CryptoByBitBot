const { users } = require("./config.js");
const { mainKeyboard } = require("./keyboards.js");
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const authScene = new Scenes.BaseScene('authScene');

authScene.enter(ctx => ctx.reply("Введіть API Key та API Secret Key у форматі APIKEY:APISECRET"))


authScene.on(message("text"), async ctx => {
  const startBot = require("./auth.js");
  if(ctx.message.text == '/start') {
    await users.findOneAndDelete({ idTelegram: ctx.chat.id });
    await ctx.scene.leave();
    await startBot(ctx);
  } 
  else if(ctx.message.text.match(/^[A-Za-z0-9]{18}:[A-Za-z0-9]{36}/g)) {
    const arrayOfStrings = ctx.message.text.split(":");
    users.updateOne( { idTelegram: ctx.chat.id }, { $set: { status: 'mainMenu', apiKey: arrayOfStrings[0], apiSecret: arrayOfStrings[1]}});
    await ctx.reply("✅Ключі успішно збережено✅");
    await ctx.reply("Оберіть один з ринків", mainKeyboard);

    return ctx.scene.leave();
  } 
  else {
    await ctx.reply("❌Неправильно введені API ключі. Будь ласка, спробуйте ще раз.")

    return ctx.scene.enter("authScene");
  }
})

module.exports = { authScene }