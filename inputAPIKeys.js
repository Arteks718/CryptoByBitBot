const { bot, users } = require("./config.js");
const { mainKeyboard } = require("./keyboards.js");
const { Scenes } = require("telegraf");
const { message } = require("telegraf/filters");

const authScene = new Scenes.BaseScene('authScene');

authScene.enter(ctx => ctx.reply("Введіть API Key та API Secret Key у форматі APIKEY:APISECRET"))

authScene.on(message("text"), async ctx => {
  if(ctx.message.text.match(/^[A-Za-z0-9]{18}:[A-Za-z0-9]{36}/g)) {
    const arrayOfStrings = ctx.message.text.split(":");
    users.updateOne(
      { idTelegram: ctx.chat.id },
      {
        $set: {
          status: 'mainMenu',
          apiKey: arrayOfStrings[0],
          apiSecret: arrayOfStrings[1],
        },
      }
    );
    await ctx.reply("✅Ключі успішно збережено✅");
    await ctx.reply("Оберіть один з ринків", mainKeyboard);

    return ctx.scene.leave();
  } else {
    await ctx.reply("❌Неправильно введені API ключі. Будь ласка, спробуйте ще раз.")

    return ctx.scene.enter("authScene");
  }
})

module.exports = { authScene }

// module.exports = async (ctx, statusUser, keyboard) => {
// // const auth = new Scenes.BaseScene("auth");

//   ctx.reply("Введіть API Key та API Secret Key у форматі APIKEY:APISECRET")
//     if (await users.findOne({ idTelegram: ctx.chat.id, status: "inputAPIKey" })) {
//       try {
//         // auth.on('message', async (ctx) => {
//         //   console.log(ctx.message.text)
//         //   if (/^[A-Za-z0-9а-яёі]{18}:[A-Za-z0-9а-яёі]{36}/.test(ctx.message.text)) {
//         //     const arrayOfStrings = ctx.message.text.split(":");
//         //     users.updateOne(
//         //       { idTelegram: ctx.chat.id },
//         //       { $set: { status: statusUser, apiKey: arrayOfStrings[0], apiSecret: arrayOfStrings[1] } });
            
//         //     await ctx.reply("✅Ключі успішно збережено✅");
//         //     await ctx.reply("Оберіть один з ринків", mainKeyboard)
//         //     return ctx.scene.leave();
//         //   } else {
//         //     ctx.reply("Неправильно введені API ключі. Будь ласка, спробуйте ще раз.");
//         //     return ctx.scene.enter("auth")
//         //   }
//         // })

//         bot.hears(/^[A-Za-z0-9]{18}:[A-Za-z0-9]{36}/g, async (ctx) => {
//           // Перевірка формату APIKEY:APISECRET
//           console.log(ctx.message.text)

//           const arrayOfStrings = ctx.message.text.split(":");
//           users.updateOne(
//             { idTelegram: ctx.chat.id },
//             {
//               $set: {
//                 status: statusUser,
//                 apiKey: arrayOfStrings[0],
//                 apiSecret: arrayOfStrings[1],
//               },
//             }
//           );
//           await ctx.reply("✅Ключі успішно збережено✅");
//           if(statusUser == 'mainMenu')
//             await ctx.reply("Оберіть один з ринків", keyboard);
//           else if (statusUser == 'settings') {
//             await ctx.reply("Test2", keyboard);
//           }
//         });
//       } catch (error) {
//         console.log(error)
//         ctx.reply("❌Неправильно введені API ключі. Будь ласка, спробуйте ще раз.")
//       }
//     }
// };