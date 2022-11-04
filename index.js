const Telegraf = require("telegraf").Telegraf,
  os = require("node:os"),
  BOT_TOKEN = "5687253547:AAHqiWGBpGg_dgW_kLgamFBEJkio-eqceI8"
API_KEY = "SEdm8VmLyERyvdTunO";
bybitSecret = "Tcy325WsyTIriwORN3GRRIluceBYPY5n4Jys";
const bot = new Telegraf(BOT_TOKEN);
const { time } = require("node:console");
const { Keyboard } = require("telegram-keyboard");
const url = "https://api-testnet.bybit.com/v2/public";

var timeFromServer = 0;
let timeNow = 0;
let sign = "";
bot.start((ctx) => {
  ctx.reply("Вітаємо в нашому боті!");
  const keyboard = Keyboard.make([
    ["Button 1", "Button 2"], // First row
    ["Button 3", "Button 4"], // Second row
  ]);
  ctx.reply("Simple built-in keyboard", keyboard.reply());
  // ctx.replyWithHTML("Welcome", {
  //   reply_markup: {
  //     inline_keyboard: [
  //       [{ text: "Get last statistic", url: "https://russianwarship.rip" }],
  //       [{ text: "Get all by day", callback_data: "getAllByDay" }],
  //       [{ text: "Get all statistic", callback_data: "getAll" }],
  //     ],
  //   },
  // });
});

function getTimeFromServer() {
  return fetch("https://api.bybit.com/v2/public/time", {
    method: "get",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      let recv_window = 5000;
      timeNow = Date.now();
      timeFromServer = data.time_now;
      if (timeFromServer - recv_window <= timeNow < timeFromServer + 1000) {
        timeFromServer = timeNow; 
      } else {
        console.log("Error timestamp");
      }
    })
    .catch((er) => {
      console.log("Error: ${er}");
    });
}

function getSignature(parameters, secret) {
  let orderedParams = "";
  var crypto = require("crypto");
  Object.keys(parameters)
    .sort()
    .forEach(function (key) {
      orderedParams += key + "=" + parameters[key] + "&";
    });
  orderedParams = orderedParams.substring(0, orderedParams.length - 1);
  return crypto
    .createHmac("sha256", secret)
    .update(orderedParams)
    .digest("hex");
}

async function getSign() {
  await getTimeFromServer();
  const queryParams = {
    api_key: API_KEY,
    coin: "BTC",
    timestamp: timeFromServer,
  };
  const queryString = JSON.stringify(queryParams);
  sign = getSignature(queryParams, bybitSecret);
}
bot.hears("sign", (ctx) => {
  console.log(getSign());
});

bot.hears("timestamp", async (ctx) => {
  await getTimeFromServer();
  console.log(timeFromServer);
  console.log(timestamp);
  ctx.reply(String(timestamp));
});

bot.hears("balance", async (ctx) => { 
  await getSign();
  console.log( "https://api-testnet.bybit.com/v2/private/wallet/balance?api_key=" + API_KEY + "&coin=BTC&timestamp=" + timeFromServer + "&sign=" + sign + "");
  fetch(
    "https://api.bybit.com/v2/private/wallet/balance?api_key=" + API_KEY + "&coin=BTC&timestamp=" + timeFromServer + "&sign=" + sign
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log(timeFromServer);
      ctx.reply(sign);
    });
});

bot.hears(/[A-Z]+/i, (ctx) => {
  let message = ctx.message.text;
  message = message.toUpperCase();
  console.log(message);
  fetch("https://api-testnet.bybit.com/v2/public/tickers", {
    method: "get",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      data_from_server = data.result;
      data_from_server.forEach((element) => {
        if (element.symbol == message) {
          let tickDirection = element.last_tick_direction;
          console.log(element.symbol);
          console.log(tickDirection);
          // switch (tickDirection) {
          //   case "PlusTick":
          //     tickDirection = "Ціна збільшується";
          //   case "MinusTick":
          //     tickDirection = "Ціна зменьшується";
          //   case "ZeroPlusTick":
          //     tickDirection = "Ціна згоди більше ніж попередньої згоди";
          //   case "ZeroMinusTick":
          //     tickDirection = "Ціна згоди менше ніж попередньої згоди";
          // }
          if (element.last_tick_direction == "PlusTick") {
            tickDirection = "Ціна збільшується";
          } else if (element.last_tick_direction == "MinusTick") {
            tickDirection = "Ціна зменьшується";
          } else if (element.last_tick_direction == "ZeroPlusTick") {
            tickDirection = "Ціна згоди більше ніж попередньої згоди";
          } else if (element.last_tick_direction == "ZeroMinusTick") {
            tickDirection = "Ціна згоди менше ніж попередньої згоди";
          }
          ctx.replyWithHTML(
            "<b>Символ: </b>" +
              element.symbol +
              "\n<b>Ціна індексу: </b>" +
              element.index_price +
              "$" +
              "\n<b>Напрямок ціни: </b>" +
              tickDirection +
              "\n<b>Найвища ціна за 24 год: </b>" +
              element.high_price_24h +
              "$" +
              "\n<b>Найнижча ціна за 24 год: </b>" +
              element.low_price_24h +
              "$" +
              "\n<b>Процентна зміна ціни відносно 1 год: </b>" +
              element.price_24h_pcnt +
              "%" +
              "\n<b>Ціна 24 год тому: </b>" +
              element.prev_price_24h +
              "$" +
              "\n<b>Оборот за 24 год: </b>" +
              element.turnover_24h +
              "\n<b>Об'єм за 24 год: </b>" +
              element.volume_24h
          );
        }
      });
    })
    .catch((er) => {
      console.log("Error: ${er}");
    });
});

const queryParams = {};

bot.launch();
