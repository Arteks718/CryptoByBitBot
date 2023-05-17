const { Markup, Scenes, session } = require("telegraf");
const { bot, users } = require("./config.js");
const inputAPIKeys = require("./inputAPIKeys.js");
const { mainKeyboard } = require("./keyboards.js")


module.exports = async (ctx) => {
  try {
    // await users.findOneAndDelete({ idTelegram: ctx.chat.id });
    // Пошук користувача у базі даних
    greeting(ctx);
  } catch (error) {
    console.log(error);
  }
};


bot.action("yesAPI", async (ctx) => chooseButtonAPI(ctx, true));
bot.action("noAPI", async (ctx) => chooseButtonAPI(ctx, false));

const greeting = async (ctx) => {
  if (await users.findOne({ idTelegram: ctx.chat.id })) {
    ctx.replyWithHTML("Вітаю!✋\nРадий знову Вас бачити!🙂", mainKeyboard);
  } else {
    await ctx.reply("Привіт, вітаю тебе у боті CryptoByBitBot!🙂", Markup.removeKeyboard());
    setTimeout(async () => await ctx.replyWithHTML(`Бот працює з ринками споту та диревативів(USDT безстрокові) використовуючі криптобіржу ByBit📈`),1500)
    setTimeout(async () => await ctx.replyWithHTML(`👨‍💻Автором та розробником є <a href="https://t.me/ARTEKS718">ARTEKS718</a>, з приводу багів, питань, будь ласка, звертайтесь📩`), 3000)
    setTimeout(async () => await ctx.replyWithHTML(
      `Для працездібності більшості функцій ти можешь ввести свій API Key та API Secret Key криптобіржі ByBit, які можна сформувати на сайті криптобіржі перейшовши за <a href="https://www.bybit.com/app/user/api-management">цим посилання</a>`
    ), 4000)

    await users.insertOne({
      idTelegram: ctx.chat.id,
      status: "buttonSelection",
    });

    setTimeout(async () => await ctx.replyWithHTML("Чи бажаєте ввести ключі?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Так", callback_data: "yesAPI" }],
          [{ text: "Ні", callback_data: "noAPI" }],
        ],
      },
    }), 6000)
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