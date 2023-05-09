const { bot, client } = require("./config.js");

module.exports = async (ctx) => {
  try {
    // Підключення до бази даних
    await client.connect();
    console.log("Connect completed");
    const users = client.db("cryptobybitbot").collection("users");

    await users.findOneAndDelete({ idTelegram: ctx.chat.id });
    // Пошук користувача у базі даних
    greeting(ctx, users);

  } catch (error) {
    console.log(error);
  }
};

bot.action("yesAPI", async (ctx) => chooseButtonAPI(ctx, true));
bot.action("noAPI", async (ctx) => chooseButtonAPI(ctx, false));

// перекинути зі старту в ось цю функцію моменти з привітанням
const greeting = async (ctx, db) => {
  if (await db.findOne({ idTelegram: ctx.chat.id })) {
    ctx.reply("Радий знову Вас бачити");
  } else {
    ctx.reply("Привіт, вітаю тебе у боті CryptoByBitBot!🙂");
    await ctx.reply(
      "Для працездібності більшості функцій тобі потрібно ввести свій API Key та API Secret Key"
    );

    await db.insertOne({
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
    const users = client.db("cryptobybitbot").collection("users");
    if (button) {
      users.updateOne(
        { idTelegram: ctx.chat.id },
        { $set: { status: "inputAPIKey" , chooseButtonAPI: button}}
      );
      await inputAPIKeys(ctx, users);
    } else{
      ctx.reply("Зрозумів, тоді в будь який інший момент у команді /settings ви можете ввести свої API ");
      users.updateOne(
        { idTelegram: ctx.chat.id },
        { $set: { status: "mainMenu" , chooseButtonAPI: button}}
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const inputAPIKeys = async (ctx, db) => {
  await ctx.reply(
    "Введіть API Key та API Secret Key у форматі APIKEY:APISECRET"
  );
  try {
    bot.on("text", async (ctx) => {
      // Перевірка формату APIKEY:APISECRET
      if (/^[A-Za-z0-9а-яёі]{18}:[A-Za-z0-9а-яёі]{36}/.test(ctx.message.text)) {
        const arrayOfStrings = ctx.message.text.split(":");
        db.updateOne(
          { idTelegram: ctx.chat.id },
          { $set: { status: "mainMenu", apiKey: arrayOfStrings[0], apiSecret: arrayOfStrings[1] } });
      } else {
        ctx.reply("Неправильно введені API ключі. Будь ласка, спробуйте ще раз.");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { inputAPIKeys };