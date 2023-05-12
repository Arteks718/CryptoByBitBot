const { bot, users } = require("./config.js");
const { mainKeyboard } = require("./keyboards.js");

module.exports = async (ctx, statusUser) => {
  
  await ctx.reply(
    "Введіть API Key та API Secret Key у форматі APIKEY:APISECRET"
    );
    if (await users.findOne({ idTelegram: ctx.chat.id, status: "inputAPIKey" })) {
      try {
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
