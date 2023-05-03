const { bot, client } = require("./config.js");
const { RestClientV5 } = require("bybit-api");

module.exports = async (ctx) => {
  try {
    // Підключення до бази даних
    await client.connect();
    console.log("Connect completed");
    const users = client.db("cryptobybitbot").collection("users");

    // Пошук користувача у базі даних
    if (await users.findOne({ idTelegram: ctx.chat.id })) 
    {
    //   ctx.reply("Радий знову Вас бачити");
    // } else {
      ctx.reply("Привіт, вітаю тебе у боті CryptoByBitBot!🙂");
      ctx.reply(
        "Для працездібності більшості функцій тобі потрібно ввести свій API Key та API Secret Key"
      );
      await users.insertOne({ idTelegram: ctx.chat.id });
      await ctx.replyWithHTML("Чи бажаєте ввести ключі?", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Так", callback_data: "yesAPI" }],
            [{ text: "Ні", callback_data: "noAPI" }],
          ],
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

bot.action("yesAPI", async (ctx) => chooseButtonAPI(ctx, true));
bot.action("noAPI", async (ctx) => chooseButtonAPI(ctx, false));


// перекинути зі старту в ось цю функцію моменти з привітанням
const greeting = (ctx) => {};

// функція, яка йде після привітання де користувач обирає чи вводити ключі, чи не вводити
// треба придумати як додавати користувачу нове поле chooseAPI
// тобто зробити константу куди записувати користувача
const chooseButtonAPI = (ctx, button) => {
  try {
    ctx.deleteMessage(ctx.inlineMessageId);
    console.log(ctx)
  } catch (error) {
    console.log(error)
  }
};

/*
let chooseApiKey,
  API_KEY = "",
  API_SECRET = "";
const useTestnet = false,
  recvWindow = 5000;

//      Keyboards

// const keyboardApiYes = Keyboard.make(
//   [
//     "Symbol",
//     "Order book",
//     "Query Kline",
//     "Latest Big Deal",
//     "Get Active Order",
//     "Cancel Active Order",
//     "Place Active Order",
//     "Cancel All Active Orders",
//     "Get Wallet Balance",
//   ],
//   {
//     pattern: [4, 2, 2],
//   }
// );

// const keyboardApiNo = Keyboard.make([
//   "Symbol",
//   "Order book",
//   "Query Kline",
//   "Latest Big Deal",
// ]);


//Написать функцию для yesApi и noAPI, которая принимает chooseAPiKey 


bot.action("yesAPI", async (ctx) => {
  ctx.deleteMessage(ctx.inlineMessageId);
  chooseApiKey = true;
  if (API_KEY == "" && API_SECRET == "") {
    if (chooseApiKey == true) {
      ctx.reply("Введіть APIKey:APISecret");
    }
  } else {
    ctx.reply(
      "Ваші ключі вже було введено\nAPI Key: " +
        API_KEY +
        "\nAPI Secret: " +
        API_SECRET,
      keyboardApiYes.reply()
    );
  }
});

//FUNCTION - NoApi action
bot.action("noAPI", (ctx) => {
  ctx.deleteMessage(ctx.inlineMessageId);
  chooseApiKey = false;
  ctx.reply(
    "Добре, якщо передумаєте, то зможете у будь-який час додати свої ключі"
  );
  if (API_KEY == "" && API_SECRET == "") {
    if (chooseApiKey == false) {
      ctx.reply(
        "Тепер ви можете користуватись функціями бота",
        keyboardApiNo.reply()
      );
    }
  } else {
    ctx.reply(
      "Ваші ключі вже було введено\nAPI Key: " +
        API_KEY +
        "\nAPI Secret: " +
        API_SECRET,
      keyboardApiYes.reply()
    );
  }
});

//BUTTON - Get APIKEY and APISECRET
bot.hears(/^[A-Za-z0-9а-яёі]{18}:[A-Za-z0-9а-яёі]{36}/, async (ctx) => {
  let message = ctx.message.text;
  var arrayOfStrings = message.split(":");
  API_KEY = arrayOfStrings[0];
  API_SECRET = arrayOfStrings[1];
  if (API_KEY.length == 18) {
    await ctx.reply("Ваш API Key: " + API_KEY);
    if (API_SECRET.length == 36) {
      await ctx.reply("Ваш API Secret: " + API_SECRET);
      chooseApiKey = true;
      //TODO переделать для всех рынков авторизацию
      // const clientInverse = new InverseClient({
      //   key: API_KEY,
      //   secret: API_SECRET,
      //   testnet: useTestnet,
      //   recv_window: recvWindow,
      // });
    } else {
      ctx.reply("Неправильний формат API Secret");
    }
  } else {
    ctx.reply("Неправильний формат API Key");
  }
  if (chooseApiKey == true) {
    ctx.reply(
      "Тепер ви можете користуватись функціями бота",
      keyboardApiYes.reply()
    );
  }
});

// module.exports = function botStart() {
//   return bot.start(async (ctx) => {
//     await bot.telegram.sendMessage(
//       ctx.chat.id,
//       "Привіт, вітаю тебе у боті CryptoByBitBot!",
//       {
//         reply_markup: {
//           remove_keyboard: true,
//         },
//       }
//     );
//     await ctx.reply(
//       "Для працездібності більшості функцій тобі потрібно ввести свій API Key та API Secret Key "
//     );
//     await ctx.replyWithHTML("Чи бажаєте ввести ключі?", {
//       reply_markup: {
//         inline_keyboard: [
//           [{ text: "Так", callback_data: "yesAPI" }],
//           [{ text: "Ні", callback_data: "noAPI" }],
//         ],
//       },
//     });
//   });
// };

// export { chooseApiKey, API_KEY, API_SECRET, recvWindow };
// export const clientInverse = new InverseClient({
//   key: API_KEY,
//   secret: API_SECRET,
//   testnet: useTestnet,
//   recv_window: recvWindow,
// });
*/
