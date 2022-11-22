const Telegraf = require("telegraf").Telegraf,
  os = require("node:os"),
  BOT_TOKEN = "5687253547:AAHqiWGBpGg_dgW_kLgamFBEJkio-eqceI8",
   //"2032874895:AAFdhZ_Qz5eaWFU2JQ6u4mkr9DaLFp0ig9A", // 
  bot = new Telegraf(BOT_TOKEN),
  { Keyboard, Key } = require("telegram-keyboard");

// let API_KEY = "SEdm8VmLyERyvdTunO";
// let API_SECRET = "Tcy325WsyTIriwORN3GRRIluceBYPY5n4Jys";
//SEdm8VmLyERyvdTunO:Tcy325WsyTIriwORN3GRRIluceBYPY5n4Jys

const {
  InverseClient,
  LinearClient,
  InverseFuturesClient,
  SpotClient,
  SpotClientV3,
  UnifiedMarginClient,
  USDCOptionClient,
  USDCPerpetualClient,
  AccountAssetClient,
  CopyTradingClient, } = require('bybit-api');

let chooseApiKey;
let API_KEY = "SEdm8VmLyERyvdTunO";
let API_SECRET = "Tcy325WsyTIriwORN3GRRIluceBYPY5n4Jys";
const useTestnet = false;
const recvWindow = 10000;
const keyboardApiYes = Keyboard.make(
  ['Symbol', "Order book", "Query Kline", "Latest Big Deal", "Get Active Order", "Cancel Active Order", "Place Active Order", "Cancel All Active Orders", "Get Wallet Balance"], {
    pattern: [4, 2, 2]
  });
const keyboardApiNo = Keyboard.make(
  ["Symbol", "Order book", "Query Kline", "Latest Big Deal"]);


bot.start(async (ctx) => {
   //ctx.reply("Test", Keyboard.remove())
   await ctx.reply("Привіт, вітаю тебе у боті CryptoBybitBot!");
   await ctx.reply("Для працездібності більшості функцій тобі потрібно ввести свій API Key та API Secret Key ");
    ctx.replyWithHTML("Чи бажаєте ви ввести ключі?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Так", callback_data: "yesAPI" }],
          [{ text: "Ні", callback_data: "noAPI" }],
        ],
      },
    });
})

bot.command('info', ctx => {
  bot.telegram.sendMessage(ctx.chat.id, "Bot Info", {
    reply_markup: {
      keyboard: [
        [
          { text: "Credits"},
          { text: "API" }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  })
})

function getRunTime(t) {
  let hours, minutes, seconds;
  date = new Date(t*1000);
  hours = date.getHours();
  minutes = date.getMinutes();
  seconds = date.getSeconds();
  return hours+":"+minutes+":"+seconds;
}

const clientInverse = new InverseClient({
  key: API_KEY,
  secret: API_SECRET,
  testnet: useTestnet
});

bot.hears("apikey", async (ctx) => {
  if(API_KEY != "" && API_SECRET != "")
  {
    await ctx.reply(API_KEY);
    await ctx.reply(API_SECRET);
    console.log(API_KEY.length);
    console.log(API_SECRET.length);
    console.log(API_KEY);
    console.log(API_SECRET);
  }else{
    ctx.reply("No");
  }
})



// Get apikey and api secret key
bot.action("yesAPI", async (ctx) => {
  bot.on
  ctx.deleteMessage (ctx.inlineMessageId);
  if(API_KEY == "" && API_SECRET == "")
  {
    ctx.reply("Введіть APIKey:APISecret");
  }else{
    ctx.reply("Ваші ключі вже було введено\n", + API_KEY + "\n" + API_SECRET);
  }
})


bot.hears(/^[A-Za-z0-9а-яёі]{18}:[A-Za-z0-9а-яёі]{36}/, async (ctx) => {
  message = ctx.message.text;
  var arrayOfStrings = message.split(":");
  API_KEY = arrayOfStrings[0];
  API_SECRET = arrayOfStrings[1];
  if(API_KEY.length == 18)
  {
  await ctx.reply("Ваш API Key: " + API_KEY);
    if(API_SECRET.length == 36)
    {
      await ctx.reply("Ваш API Secret: " + API_SECRET);
      chooseApiKey = true;
    }else{ctx.reply("Неправильний формат API Secret");}
  }else{ctx.reply("Неправильний формат API Key");}
  if(chooseApiKey == true)
  {
    ctx.reply("Тепер ви можете користуватись функціями бота", keyboardApiYes.reply());
  }
})

bot.hears("Get Wallet Balance", (ctx) =>{
  clientInverse.getWalletBalance({coin: "USDT"})
  .then(result => {
    console.log("getWalletBalance result: ", result);
  })
  .catch(err => {
    console.error("getWalletBalance error: ", err);
  });
})

bot.hears("Symbol", (ctx) => {
  ctx.reply("Зрозумів, тепер введи будь ласка пару символів, наприклад: APTUSDT / ethusdt / BtCuSdT");
  bot.hears(/[A-Za-z]/, (ctx) => {
    let message = ctx.message.text.toUpperCase();
    clientInverse.getTickers({symbol: message})
    .then((result) => {
      if(result.ret_code == 0)
      {
        let data = result.result[0], tickDirection;
        if (data.last_tick_direction == "PlusTick") {
            tickDirection = "Ціна збільшується";
          } else if (data.last_tick_direction == "MinusTick") {
            tickDirection = "Ціна зменьшується";
          } else if (data.last_tick_direction == "ZeroPlusTick") {
            tickDirection = "Ціна згоди більше ніж попередньої згоди";
          } else if (data.last_tick_direction == "ZeroMinusTick") {
            tickDirection = "Ціна згоди менше ніж попередньої згоди";
          }
          ctx.replyWithHTML(
            "<b>Символ: </b>" +
              data.symbol +
              "\n<b>Ціна індексу: </b>" +
              data.index_price +
              "$" +
              "\n<b>Напрямок ціни: </b>" +
              tickDirection +
              "\n<b>Найвища ціна за 24 год: </b>" +
              data.high_price_24h +
              "$" +
              "\n<b>Найнижча ціна за 24 год: </b>" +
              data.low_price_24h +
              "$" +
              "\n<b>Процентна зміна ціни відносно 1 год: </b>" +
              data.price_24h_pcnt.toFixed(4) +
              "%" +
              "\n<b>Ціна 24 год тому: </b>" +
              data.prev_price_24h +
              "$" +
              "\n<b>Оборот за 24 год: </b>" +
              data.turnover_24h.toFixed(2) +
              "\n<b>Об'єм за 24 год: </b>" +
              data.volume_24h.toFixed(2)
          );
      }else{
        ctx.reply("Введено неіснуючий символ, будь ласка викликайте функцію заново");
      }
    })
    .catch(err =>{
      ctx.reply("getTickers error: ", err);
    })
  })
})

bot.hears("Order book", (ctx) => {
  ctx.reply("Зрозумів, тепер введи будь ласка пару символів, наприклад: APTUSDT / ethusdt / BtCuSdT");
  bot.hears(/[A-Za-z]/, (ctx) => {
    let message = ctx.message.text.toUpperCase();
    clientInverse.getOrderBook({ symbol: message})
    .then(result => {
      if(result.ret_code == 0)
      {
        let answerBuy = '', answerSell = '', price, side, size;

        for(var i = 0; i < 50; i++)
        {
          side = result.result[i]['side'];
          size = result.result[i]['size'];
          price = result.result[i]['price'];
          //сделать нормальный необъемный вывод
          if(side == 'Buy'){
            answerBuy += "<b>Ціна :</b>" + price + "\n" + "<b>Об'єм: </b>" + size + "\n\n";
          }else if(side == 'Sell'){
            answerSell += "<b>Ціна :</b>" + price + "\n" + "<b>Об'єм: </b>" + size + "\n\n";
          }
        }
        ctx.replyWithHTML("Останні 25 ордерів за символом " + message + " на купівлю\n" + answerBuy);
        ctx.replyWithHTML("Останні 25 ордерів за символом " + message + " на продаж\n" + answerSell);
      }else{
        ctx.reply("Введено неіснуючий символ, будь ласка викликайте функцію заново");
      }

    })
    .catch(err => {
      console.error("getOrderBook error: ", err);
    });
  })
})

bot.hears("Query Kline", (ctx) => {
  ctx.reply("Зрозумів, тепер введи будь ласка, наприклад: BTCUSD:240:W:5");
  bot.hears(/[A-Za-z]/, (ctx) => {
    message = ctx.message.text;
    var arrayOfStrings = message.split(":");
    let symbol = arrayOfStrings[0], interval = arrayOfStrings[1], from = arrayOfStrings[2], limit = arrayOfStrings[3];
    if(Number.isInteger(from) == true)
    {
      
    }
    clientInverse.getKline({symbol:"BTCUSD", interval:"D", from: 1667018735})
      .then(result => {
        if(result.ret_code == 0)
        {

        }else{
          ctx.reply("Введено неіснуючий символ, будь ласка викликайте функцію заново");
        }
      })
    .catch(err => {
      console.error("getKline error: ", err);
    });
  })
})

bot.hears("Latest Big Deal", (ctx) => {
  ctx.reply("Зрозумів, тепер введи будь ласка пару символів, наприклад: APTUSDT / ethusdt / BtCuSdT");
  bot.hears(/[A-Za-z]/, (ctx) => {
    let message = ctx.message.text.toUpperCase();
    clientInverse.getLatestBigDeal({symbol: message, limit: 500})
      .then(result => {
        if(result.ret_code == 0)
        {
          let answerBuy = '', answerSell = '', value, side, b = 0, s = 0;
          for(var i = 0; i < 25; i++)
          {
            side = result.result[i]['side'];
            value = result.result[i]['value'];
            timestamp = result.result[i]['timestamp'];

            if(side == 'Buy' && b != 5){
              answerBuy += "<b>Сума: </b>" + value.toFixed(2)  + "$\n" + "<b>Час </b>" + getRunTime(timestamp) + "\n\n";
              b++;
            }else if(side == 'Sell' && s != 5){
              answerSell += "<b>Сума: </b>" + value.toFixed(2)  + "$\n" + "<b>Час </b>" + getRunTime(timestamp) + "\n\n";
              s++;
            }
          }
          ctx.replyWithHTML("Найбільші 5 угод купівлі за останні 24 години за символом " + message + "\n\n" + answerBuy);
          ctx.replyWithHTML("Найбільші 5 угод продажу за останні 24 години за символом " + message + "\n\n" + answerSell);
        }else{
          ctx.reply("Введено неіснуючий символ, будь ласка викликайте функцію заново");
        }
      })
      .catch(err => {
        console.error("getLatest error: ", err);
      });
  })
})

bot.action("noAPI", (ctx) => {
  ctx.deleteMessage(ctx.inlineMessageId);
  chooseApiKey = false;
  ctx.reply("Добре, якщо передумаєте, то зможете у будь-який час додати свої ключі");
  if(chooseApiKey == false)
  {
    ctx.reply("Тепер ви можете користуватись функціями бота", keyboardApiNo.reply());
  }
})


// clientInverse.getServerTime()
//   .then(result => {
//     console.log("getServerTime result: ", result);
//   })
//   .catch(err => {
//     console.error("getServerTime error: ", err);
//   });
// clientInverse.getApiKeyInfo()
//   .then(result => {
//     console.log("getApiKeyInfo result: ", result);
//   })
//   .catch(err => {
//     console.error("getApiKeyInfo error: ", err);
//   });
// clientInverse.getKline({symbol:"BTCUSD", interval:"60", from: 1667018735})
//   .then(result => {
//     console.log("getKline result: ", result);
//   })
//   .catch(err => {
//     console.error("getKline error: ", err);
//   });

bot.launch();