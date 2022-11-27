const Telegraf = require("telegraf").Telegraf,
  os = require("node:os"),
  BOT_TOKEN = "5687253547:AAHqiWGBpGg_dgW_kLgamFBEJkio-eqceI8",
   //"2032874895:AAFdhZ_Qz5eaWFU2JQ6u4mkr9DaLFp0ig9A", // 
  bot = new Telegraf(BOT_TOKEN),
  { Keyboard, Key } = require("telegram-keyboard");

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

let chooseApiKey, chooseButton;
let API_KEY = "", API_SECRET = "", clientInverse;

// let API_KEY = "SEdm8VmLyERyvdTunO",
//     API_SECRET = "Tcy325WsyTIriwORN3GRRIluceBYPY5n4Jys";
//SEdm8VmLyERyvdTunO:Tcy325WsyTIriwORN3GRRIluceBYPY5n4Jys
const useTestnet = false, recvWindow = 15000;

const keyboardApiYes = Keyboard.make(
  ['Symbol', "Order book", "Query Kline", "Latest Big Deal", "Get Active Order", "Cancel Active Order", "Place Active Order", "Cancel All Active Orders", "Get Wallet Balance"], {
    pattern: [4, 2, 2]
  });
const keyboardApiNo = Keyboard.make(
  ["Symbol", "Order book", "Query Kline", "Latest Big Deal"]);


//TODO - Start
bot.start(async (ctx) => {
  chooseButton = "";
  await bot.telegram.sendMessage(ctx.chat.id, "Привіт, вітаю тебе у боті CryptoBybitBot!",
  {
    reply_markup: {
      remove_keyboard: true
    }
  })
   //ctx.reply("Test", Keyboard.remove())
  //  await ctx.reply("Привіт, вітаю тебе у боті CryptoBybitBot!");
  await ctx.reply("Для працездібності більшості функцій тобі потрібно ввести свій API Key та API Secret Key ");
  await ctx.replyWithHTML("Чи бажаєте ви ввести ключі?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Так", callback_data: "yesAPI" }],
          [{ text: "Ні", callback_data: "noAPI" }],
        ],
      },
    });
})

// Get apikey and api secret key
//TODO - YesApi action
bot.action("yesAPI", async (ctx) => {
  bot.on
  ctx.deleteMessage (ctx.inlineMessageId);
  chooseApiKey = true;
  if(API_KEY == "" && API_SECRET == "")
  {
    if(chooseApiKey == true)
    {
      ctx.reply("Введіть APIKey:APISecret");
    }
  }else{
    ctx.reply("Ваші ключі вже було введено\nAPI Key: " + API_KEY + "\nAPI Secret: " + API_SECRET, keyboardApiYes.reply());
  }
})

//TODO - NoApi action
bot.action("noAPI", (ctx) => {
  ctx.deleteMessage(ctx.inlineMessageId);
  chooseApiKey = false;
  ctx.reply("Добре, якщо передумаєте, то зможете у будь-який час додати свої ключі");
  if(API_KEY == "" && API_SECRET == "")
  {
    if(chooseApiKey == false)
    {
      ctx.reply("Тепер ви можете користуватись функціями бота", keyboardApiNo.reply());
    }
  }else{
    ctx.reply("Ваші ключі вже було введено\nAPI Key: " + API_KEY + "\nAPI Secret: " + API_SECRET, keyboardApiYes.reply());
  }
})
//TODO - info command
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

function getTime() {
clientInverse.getServerTime()
  .then(result => {
    timeNow = Math.round(result.time_now * 1000);
    date = new Date().getTime()
    if(timeNow - recvWindow <= date < timeNow + 1000)
    {
      console.log("getServerTime result: ", timeNow);
      console.log("Time: ", date)
      console.log("recv: ", timeNow - date)   
    }else{
      console.log("nea");
    }

  })
  .catch(err => {
    console.error("getServerTime error: ", err);
  });
}

function getRunTime(t) {
  console.log(t);
  date = new Date(t*1000);
  console.log(date);
  year = date.getFullYear();
  day = date.getDate();
  month = date.getMonth() + 1;
  hours = date.getHours();
  minutes = date.getMinutes();
  seconds = date.getSeconds();
  return  day + "." + month + " " + hours+":"+minutes+":"+seconds;
}

async function resultKline(limit, ctx, result)
{
  for(let i = 0; i < limit; i++)
  {
    res = result.result[i];
    await ctx.replyWithHTML("<b>Початкова вартість:</b> " + res['open'] + "$\n<b>Найвища ціна:</b> " + res['high'] + "$\n<b>Найнижча ціна:</b> " + res['low'] + "$\n<b>Кінцева вартість:</b> " + res['close'] + "$\n<b>Об'єм:</b> " + res['volume'] + "$\n<b>Дата:</b> " + getRunTime(res['open_time']));
  }
}

bot.hears("time", ctx=> {
  getTime();
})

//TODO - Get ApiKey

bot.hears("apikey", async (ctx) => {
  if(API_KEY != "" && API_SECRET != "")
  {
    await ctx.reply(API_KEY);
    await ctx.reply(API_SECRET);
    console.log(API_KEY.length);
    console.log(API_SECRET.length);
    console.log(API_KEY);
    console.log(API_SECRET);
    console.log(clientInverse);
  }else{
    ctx.reply("No");
  }
})

//TODO - Get ApiKeyInfo

bot.hears("apikeyinfo", async (ctx) => {
  clientInverse.getApiKeyInfo()
  .then(result => {
    console.log("getApiKeyInfo result: ", result.result[0]['permissions']);
  })
  .catch(err => {
    console.error("getApiKeyInfo error: ", err);
  });
})

/**
 *
 * Wallet Data Endpoints
 *
 */

//TODO - Wallet Balance +
bot.hears("Get Wallet Balance", (ctx) =>{
  if(chooseApiKey == true)
  {
    ctx.reply("Зрозумів, тепер введить будь ласка символ за яким буде виведенний баланс, наприклад: USDT / BTC / ETH");
    chooseButton = "Get Wallet Balance";
  }else{
    ctx.reply("Дану функцію неможна використовувати без API ключей");
  }
})

/**
 *
 * Market Data Endpoints
 *
 */

//TODO- Symbol +
bot.hears("Symbol", (ctx) => {
  ctx.reply("Зрозумів, тепер введи будь ласка пару символів, наприклад: APTUSDT / ethusdt / BtCuSdT");
  chooseButton = "Symbol";
})
//TODO - Order book +
bot.hears("Order book", (ctx) => {
  ctx.reply("Зрозумів, тепер введи будь ласка пару символів, наприклад: APTUSDT / ethusdt / BtCuSdT");
  chooseButton = "Order book";
})
//TODO - Query Kline +
bot.hears("Query Kline", (ctx) => {
  ctx.replyWithHTML("Зрозумів, тепер введіть будь ласка параметри за наступним виглядом\n<i>symbol:interval:from:limit</i>\nЗ яких:\n<b>symbol</b> - це символ пошуку(наприклад BTCUSD, ETHUSD)\n<b>interval</b> - це інтервал між запитами, допускаються лише такі параметри: 1 3 5 15 30 60 120 240 360 720 'D' 'M' 'W' (цифри в мінутах)\n<b>from</b> - це відколи буде починатися пошук запитів, параметри аналогічні з інтервалом\n<b>limit</b> - це кількість запитів для отримання (не може бути більше 25)\nНаприклад: BTCUSD:240:W:5");
  chooseButton = "Query Kline";
})

/**
 *
 * Market Data : Advanced
 *
 */

//TODO - Latest Big Deal +
bot.hears("Latest Big Deal", (ctx) => {
  ctx.reply("Зрозумів, тепер введи будь ласка пару символів, наприклад: APTUSDT / ethusdt / BtCuSdT");
  chooseButton = "Latest Big Deal";
})

/**
 * Active orders
 */

//TODO - Get active  +
bot.hears("Get Active Order", (ctx) => {
  ctx.reply("Зрозумів, тепер введить будь ласка символ за яким буде пошук активних ордерів, наприклад: USDT / eth / BtC");
  chooseButton = "Get Active Order";
})
//TODO - Place active order ---
bot.hears("Place Active Order", (ctx) => {
  ctx.reply("Сделать интерфейс");
  chooseButton = "Place Active Order"
})
//TODO Cancel active order +
bot.hears("Cancel Active Order", (ctx) => {
  ctx.replyWithHTML("Зрозумів, тепер введіть будь ласка символ та номер замовлення за яким буде пошук активних ордерів.\nНаприклад: BTC:ae2ecb3f-4447-4599-a178-d95a16e537d7");
  chooseButton = "Cancel Active Order";
})
//TODO Cancel all active order +
bot.hears("Cancel All Active Orders", (ctx) => {
  ctx.replyWithHTML("Зрозумів, тепер введіть будь ласка символ за яким буде пошук активних ордерів.\nНаприклад: BTC, Eth");
  chooseButton = "Cancel All Active Orders";
})

//TODO - Get APIKEY and APISECRET
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
      clientInverse = new InverseClient( {
        key: API_KEY,
        secret: API_SECRET,
        testnet: useTestnet,
        recv_window: recvWindow
      })
    }else{ctx.reply("Неправильний формат API Secret");}
  }else{ctx.reply("Неправильний формат API Key");}
  if(chooseApiKey == true)
  {
    ctx.reply("Тепер ви можете користуватись функціями бота", keyboardApiYes.reply());
  }
})
bot.hears(/^[A-Za-z0-9]+:[A-Za-z0-9\!\@\#\$\%\^\&\*\)\(+\=\._-]+$/g, (ctx) => {
  if(chooseButton == "Cancel Active Order")
  {
    message = ctx.message.text;
    var arrayOfStrings = message.split(":");
    let symbol = arrayOfStrings[0].toUpperCase() + 'USD', orderId = arrayOfStrings[1];
    console.log(symbol);
    console.log(orderId);
    clientInverse.cancelActiveOrder({symbol:symbol, order_id: orderId})
      .then(result => {
        if(result.ret_code == 0)
        {
          ctx.replyWithHTML("Замовлення за номером <i>" + orderId + "</i> було <b>успішно видалено</b>");
          console.log("getCancelActiveOrder result: ", result);
        }else{
          ctx.reply("Неправильний символ або номер замовлення");
          console.log("getCancelActiveOrder result: ", result);
        }

      })
      .catch(err => {
        console.error("getCancelActiveOrder error: ", err);
      });
  }
})
bot.hears(/^[A-Za-z0-9]/, (ctx) => {
  if(chooseButton == "Symbol")
  {
    let message = ctx.message.text.toUpperCase();
    clientInverse.getTickers({symbol: message})
    .then((result) => {
      if(result.ret_code == 0)
      {
        let data = result.result[0], tickDirection;
        switch(data.last_tick_direction){
          case "PlusTick": tickDirection = "Ціна збільшується"; break;
          case "MinusTick": tickDirection = "Ціна зменьшується"; break;
          case "ZeroPlusTick": tickDirection = "Ціна згоди більше ніж попередньої згоди"; break;
          case "ZeroMinusTick": tickDirection = "Ціна згоди менше ніж попередньої згоди"; break;
        }
        ctx.replyWithHTML(
          "<b>Символ: </b>" + data.symbol
            + "\n<b>Ціна індексу: </b>" + data.index_price
            + "$\n<b>Напрямок ціни: </b>" + tickDirection
            + "\n<b>Найвища ціна за 24 год: </b>" + data.high_price_24h
            + "$\n<b>Найнижча ціна за 24 год: </b>" + data.low_price_24h
            + "$\n<b>Процентна зміна ціни відносно 1 год: </b>" + data['price_24h_pcnt']
            +"%\n<b>Ціна 24 год тому: </b>" + data.prev_price_24h
            + "$\n<b>Оборот за 24 год: </b>" + data.turnover_24h
            + "\n<b>Об'єм за 24 год: </b>" + data.volume_24h
        );
      }else{
        ctx.reply("Введено неіснуючий символ, будь ласка викликайте функцію заново");
      }
    })
    .catch(err =>{
      ctx.reply("getTickers error: ", err);
    })
  }
  if(chooseButton == "Order book")
  {
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
  }
  if(chooseButton == "Query Kline")
  {
    let message = ctx.message.text;
    var arrayOfStrings = message.split(":");
    let symbol = arrayOfStrings[0].toUpperCase(), interval = arrayOfStrings[1], from = arrayOfStrings[2], limit = arrayOfStrings[3];
    if((interval == 1 || interval == 5 || interval == 15 || interval == 30 || interval == 60 || interval == 120 || interval == 240 || interval == 360 || interval == 720 || interval == 'D' || interval == 'M' || interval == 'W') && limit <=25)
    {
      fromTime = new Date();
      console.log(fromTime);
      if(Number.isInteger(from) != true)
      {
        switch(from)
        {
          case 'm': from = 60; break;
          case 'H': from = 3600; break;
          case 'D': from = 86400; break;
          case 'W': from = 604800; break;
          case 'M': from = 2628000; break;
        }
        fromTime = Math.round(fromTime / 1000 - from);
              console.log(fromTime);
      }else {
        fromTime = Math.round(fromTime / 1000);
              console.log(fromTime);
      }

      clientInverse.getKline({symbol:symbol, interval:interval, from: fromTime, limit: limit})
      .then(async result => {
            // console.log("getKline result: ", result);
        if(result.ret_code == 0)
        {
          let resLenght = result.result.length;
          if(result.result.length != limit)
          {
            ctx.reply("За зазначений Вами час було отримано лише " + resLenght + " запис\nДля отримання більше записів ви можете або збільшити від коли шукати записи, або зменшити інтервал");
            resultKline(resLenght, ctx, result);
          }else{
            await ctx.reply("Запит вдалий!");
            await resultKline(limit, ctx, result);
          }
        }else{
          ctx.replyWithHTML("Неправильно введено параметри. \nПродивіться будь ласка правильність їх написання та запустіть функцію ще раз.")
        }
      })
      .catch(err => {
        console.error("getKline error: ", err);
      });
    }else{
      ctx.reply("Неправильно введено інтервал або ліміт");
    }
  }
  if(chooseButton == "Latest Big Deal")
  {
    let message = ctx.message.text.toUpperCase();
    clientInverse.getLatestBigDeal({symbol: message, limit: 500})
      .then(result => {
        if(result.ret_code == 0)
        {
          if(result.result.length != 0)
          {
            console.log(result);
            let answerBuy = '', answerSell = '', value, side, b = 0, s = 0;
            for(var i = 0; i < result.result.length; i++)
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
            ctx.replyWithHTML("Найбільші " + b + " угод купівлі за останні 24 години за символом " + message + "\n\n" + answerBuy);
            ctx.replyWithHTML("Найбільші " + s + " угод продажу за останні 24 години за символом " + message + "\n\n" + answerSell);
          }else{
            ctx.reply("За сьогодні не було угод які перевищували 500.000$");
          }
        }else{
          ctx.reply("Введено неіснуючий символ, будь ласка викликайте функцію заново");
        }
      })
      .catch(err => {
        console.error("getLatest error: ", err);
      });
  }
  if(chooseButton == "Get Wallet Balance")
  {
    let message = ctx.message.text.toUpperCase();
    clientInverse.getWalletBalance({coin: message})
    .then(result => {
      if(result.ret_code == 0)
      {
        let data = result.result[message];
        ctx.replyWithHTML(
          "<b>Баланс гаманця: </b>" +
          data['wallet_balance'].toFixed(4) +
          "$\n<b>Сума балансу та нереаалізованого PNL: </b>" +
          data['equity'].toFixed(4) +
          "$\n<b>Доступні кошти: </b>" +
          data['available_balance'].toFixed(4) +
          "$\n<b>Використовувана маржа: </b>" +
          data['used_margin'].toFixed(4) +
          "$\n<b>Реалізована PNL: </b>" +
          data['realised_pnl'].toFixed(4) +
          "$\n<b>Нереалізована PNL: </b>" +
          data['unrealised_pnl'].toFixed(4) + "$"
        );
      }else{
        ctx.reply("Введено неіснуючий символ, будь ласка викликайте функцію заново");
      }
    })
    .catch(err => {
      console.error("getWalletBalance error: ", err);
    });
  }
  if(chooseButton == "Get Active Order")
  {
    let message = ctx.message.text.toUpperCase() + 'USD';
    clientInverse.queryActiveOrder({symbol: message})
    .then(result => {
      if(result.ret_code == 0)
      {
        if(result.result.length != 0)
        {
          let data, side, timeInForce, type, price, date;
          for(let i = 0; i < result.result.length; i++)
          {
            data = result.result[i];
            date = new Date(data['created_at']);
            date = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            if(data['side'] == 'Buy') side = "Покупка";
            else if(data['side'] == 'Sell') side = "Продаж";

            if(data['order_type'] == 'Limit') type = "Лімітний";
            else if(data['order_type'] == 'Market') type = "Ринок";

            if(data['time_in_force'] == 'GoodTillCancel') timeInForce = "Діє до скасування";
            else if(data['time_in_force'] == 'FillOrKill') timeInForce = "Виконати відразу або анулювати";
            else if(data['time_in_force'] == 'ImmediateOrCancel') timeInForce = "Виконати відразу або скасувати";

            if(data['order_type'] == 'Limit') price = "\n<b>Ціна замовлення: </b>" + data['price'] + "$";
            else if(data['order_type'] == 'Market') price = '';

            ctx.replyWithHTML(
            "<b>Символ: </b>" + data['symbol']
              + "\n<b>Сторона: </b>" + side
              + price
              + "\n<b>Сума замовлення: </b>" + data['qty']
              + "$\n<b>Тип замовлення: </b>" + type
              + "\n<b>Період активності замовлення: </b>" + timeInForce
              + "\n<b>Дата створення: </b>" + date
              + "\n<b>ID замовлення: </b>" + data['order_id']
            );
          }
        }else{
          ctx.reply("Відсутні ордери");
        }
      }else{
        ctx.reply("Неправильно введений символ або інша помилка");
      }
    })
    .catch(err => {
      console.error("Get Active Order error: ", err);
    });
  }
  if(chooseButton == "Cancel All Active Orders")
  {
    let message = ctx.message.text.toUpperCase() + 'USD';
    clientInverse.cancelAllActiveOrders({symbol: message})
      .then(result => {
        if(result.ret_code == 0)
        {
          if(result.result.length != 0)
          {
            let orders = '';
            for(var i = 0; i < result.result.length; i++)
            {
              orders += "\nID замовлення: " + result.result[i]['clOrdID'];
            }
            ctx.reply("Було успішно видалено " + result.result.length + " замовлення за номерами:" + orders);
          }else{
            ctx.reply("Відсутні ордери");
          }
        }else{
          ctx.reply("Введено неіснуючий символ або інша помилка");
        }
      })
      .catch(err => {
        console.error("getLatest error: ", err);
      });
  }
  if(chooseButton == "Place Active Order")
  {
    clientInverse.placeActiveOrder({side: "Sell", symbol:"BTCUSD", order_type: "Limit", qty: 1, price: 20000,time_in_force: "Good till cancelled"})
    .then(result => {
      console.log("Place Active Order result: ", result);
    })
    .catch(err => {
      console.error("Place Active Order error: ", err);
    });
  }
})






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