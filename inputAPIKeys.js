const { bot, users } = require("./config.js");
const { mainKeyboard } = require("./keyboards.js");
const { Scenes, session } = require("telegraf");
const { message } = require("telegraf/filters");


module.exports = async (ctx, statusUser) => {
// const auth = new Scenes.BaseScene("auth");

  ctx.reply("Введіть API Key та API Secret Key у форматі APIKEY:APISECRET")
    if (await users.findOne({ idTelegram: ctx.chat.id, status: "inputAPIKey" })) {
      try {
        // auth.on('message', async (ctx) => {
        //   console.log(ctx.message.text)
        //   if (/^[A-Za-z0-9а-яёі]{18}:[A-Za-z0-9а-яёі]{36}/.test(ctx.message.text)) {
        //     const arrayOfStrings = ctx.message.text.split(":");
        //     users.updateOne(
        //       { idTelegram: ctx.chat.id },
        //       { $set: { status: statusUser, apiKey: arrayOfStrings[0], apiSecret: arrayOfStrings[1] } });
            
        //     await ctx.reply("✅Ключі успішно збережено✅");
        //     await ctx.reply("Оберіть один з ринків", mainKeyboard)
        //     return ctx.scene.leave();
        //   } else {
        //     ctx.reply("Неправильно введені API ключі. Будь ласка, спробуйте ще раз.");
        //     return ctx.scene.enter("auth")
        //   }
        // })

        bot.hears(/^[A-Za-z0-9]{18}:[A-Za-z0-9]{36}/g, async (ctx) => {
          // Перевірка формату APIKEY:APISECRET
          console.log(ctx.message.text)

          const arrayOfStrings = ctx.message.text.split(":");
          users.updateOne(
            { idTelegram: ctx.chat.id },
            {
              $set: {
                status: statusUser,
                apiKey: arrayOfStrings[0],
                apiSecret: arrayOfStrings[1],
              },
            }
          );
          await ctx.reply("✅Ключі успішно збережено✅");
          await ctx.reply("Оберіть один з ринків", mainKeyboard);
        });
      } catch (error) {
        console.log(error)
        ctx.reply("❌Неправильно введені API ключі. Будь ласка, спробуйте ще раз.")
      }
    }
};
