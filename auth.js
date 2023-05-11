const { bot, client, users } = require("./config.js");
const inputAPIKeys = require("./inputAPIKeys.js");
const { mainKeyboard } = require("./keyboards.js")


module.exports = async (ctx) => {
  try {
    await users.findOneAndDelete({ idTelegram: ctx.chat.id });
    // Пошук користувача у базі даних
    greeting(ctx);
  } catch (error) {
    console.log(error);
  }
};

bot.action("yesAPI", async (ctx) => chooseButtonAPI(ctx, true));
bot.action("noAPI", async (ctx) => chooseButtonAPI(ctx, false));

// перекинути зі старту в ось цю функцію моменти з привітанням
const greeting = async (ctx) => {
  if (await users.findOne({ idTelegram: ctx.chat.id })) {
    ctx.reply("Радий знову Вас бачити");
  } else {
    await ctx.reply("Привіт, вітаю тебе у боті CryptoByBitBot!🙂");
    await ctx.reply(
      "Для працездібності більшості функцій тобі потрібно ввести свій API Key та API Secret Key"
    );

    await users.insertOne({
      idTelegram: ctx.chat.id,
      status: "buttonSelection",
    });

    await ctx.replyWithHTML("Чи бажаєте ввести ключі?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Так", callback_data: "yesAPI" }],
          [{ text: "Ні", callback_data: "noAPI" }],
        ],
      },
    });
  }
};

const chooseButtonAPI = async (ctx, button) => {
  try {
    // Видалення інлайн клавіатури
    ctx.deleteMessage(ctx.inlineMessageId);
    if (button) {
      users.updateOne(
        { idTelegram: ctx.chat.id },
        { $set: { status: "inputAPIKey" , chooseButtonAPI: button}}
      );
      await inputAPIKeys(ctx, "mainMenu");
    } else{
      ctx.reply("Зрозумів, тоді в будь який інший момент у команді /settings ви можете ввести свої API ");
      users.updateOne(
        { idTelegram: ctx.chat.id },
        { $set: { status: "mainMenu" , chooseButtonAPI: button}}
      );
      ctx.reply("Оберіть один з ринків", mainKeyboard);
    }
  } catch (error) {
    console.log(error);
  }
};