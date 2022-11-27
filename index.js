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
// let API_KEY = "", API_SECRET = "";
let API_KEY = "SEdm8VmLyERyvdTunO",
    API_SECRET = "Tcy325WsyTIriwORN3GRRIluceBYPY5n4Jys";
//SEdm8VmLyERyvdTunO:Tcy325WsyTIriwORN3GRRIluceBYPY5n4Jys
const useTestnet = false, recvWindow = 15000;
let clientInverse = new InverseClient( {
  key: API_KEY,
  secret: API_SECRET,
  testnet: useTestnet,
  recv_window: recvWindow
});

const keyboardApiYes = Keyboard.make(
  ['Symbol', "Order book", "Query Kline", "Latest Big Deal", "Get Active Order", "Cancel Active Order", "Place Active Order", "Cancel All Active Orders", "Get Wallet Balance"], {
    pattern: [4, 2, 2]
  });
const keyboardApiNo = Keyboard.make(
  ["Symbol", "Order book", "Query Kline", "Latest Big Deal"]);

//FUNCTION - Start
bot.start(async (ctx) => {
  chooseButton = "";
  await bot.telegram.sendMessage(ctx.chat.id, "Привіт, вітаю тебе у боті CryptoBybitBot!",
  {
    reply_markup: {
      remove_keyboard: true
    }
  })
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
//FUNCTION - YesApi action
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

//FUNCTION - NoApi action
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
//FUNCTION - info command
bot.command('info', ctx => {
  ctx.replyWithHTML("Натисніть на кнопку потрібної Вам функції, для отримання більш детальної інформації:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Symbol", callback_data: "infoSymbol" }],
        [{ text: "Order Book", callback_data: "infoOrderBook" }],
        [{ text: "Query Kline", callback_data: "infoQueryKline" }],
        [{ text: "Latest Big Deal", callback_data: "infoLatestBigDeal" }],
        [{ text: "Get Wallet Balance", callback_data: "infoGetWalletBalance" }],
        [{ text: "Get Active Order", callback_data: "infoGetActiveOrder" }],
        [{ text: "Place Active Order", callback_data: "infoPlaceActiveOrder" }],
        [{ text: "Cancel Active Order", callback_data: "infoCancelActiveOrder" }],
        [{ text: "Cancel All Active Order", callback_data: "infoCancelAllActiveOrder" }]
      ],
    },
  });
})

bot.action("infoSymbol", (ctx) => {
  ctx.replyWithHTML("Користувач вводить символ за яким він бажає отримати детальну інформацію. Символ виглядає як пара двох символів, альткоїна(наприклад BTC) та стейблкоїна(USDT). Стейблкоїн USDT постійно дорівнюї 1$, це для того щоб легче та краще розуміти ціну визначеної криптовалюти. Після введення символа, корисувач отримує інформації, у вигляді:\nСимвол;\nЦіна;\nНапрямок ціни;\nНайвища ціна за 24 год;\nНайменша ціна за 24 год;\nроцентна зміна ціни відносно 1 год;\nЦіна 24 год тому;\nОборот за 24 год;\nОб'єм за 24 год.\n\n")
})
bot.action("infoOrderBook", (ctx) =>{
  ctx.replyWithHTML("Order Book(книга замовлень) - це список замовлень з ордерів що створюють користувачі за визначеної ціної та об'ємом, які виражаються у $ США. У боті користувач може запросити книгу замовлень за визначеним символом та отримати по 25 ордерів на купівлю та продаж. ")
})
bot.action("infoQueryKline", (ctx) =>{
  ctx.replyWithHTML("Query Kline(клин запит) - це функція яка виводить ціну за символом, яка була визначена якимось проміжком часу раніше. Користувач робить запит за параметрами які йому потрібні, кожен параметр обов'язковий. Перший з них це символ для пошуку. Другий це interval(інтервал часу), тобто, це який проміжок часу між якими буде визначатись ціни для виведення, наприклад, інтервал у 60 секунд, це значить, що різница у часі між першої ціною і другої буде у 60 секунд. Третій параметр, це відколи буде починатися пошук цін, будто місяць, тиждень, день, година або навіть 5 секунд. Та останній параметр це кількість запитів який отримає користувач, є обмеження у 25 запитів.")
})
bot.action("infoLatestBigDeal", (ctx) =>{
  ctx.replyWithHTML("Latest Big Deal(остання велика згода) - це функція яка виводить згоди, сума яких була перевищена за 500.000$. Ця функція потребує введення символу з обов'язковим стейблкоїном USDT. Також, вона буде корисна тим, що досить великі згоди впливають на ринок і буде дуже цікаво на яку ціну була згода що змінила потік ринку.")
})
bot.action("infoGetWalletBalance", (ctx) =>{
  ctx.replyWithHTML("Get Wallet Balance(отримання балансу гаманця) - ця функція виводить у подробицях баланс гаманця користувача за ринком деривіативів. Ця функція буде дуже зручно тим користувачам, у яких досить слабкий зв'язок Інтернету, для того щоб зайти на сайт/додаток біржі ByBit для перегляду балансу свого гаманця");
})
bot.action("infoGetActiveOrder", (ctx) =>{
  ctx.replyWithHTML("Get Active Order(отримання активного замовлення) - ця функція виконує виведення усіх активних замовлень користувача на ринку диривативів, вона потребує обов'язкого введення API Key та API Secret юзера, без них даною функцієї не можна буде користуватись");
})
bot.action("infoPlaceActiveOrder", (ctx) =>{
  ctx.replyWithHTML("");
})
bot.action("infoCancelActiveOrder", (ctx) =>{
  ctx.replyWithHTML("Cancel Active Order(відміна активного замовлення) - ця функція яка відміняє активне замовлення на ринку диривативів за назвою символа та ідентифікаційним номером самого ордера, який можна отримати з функції GetActiveOrder, але дана функція може відміняти ті ордери, які не були виконані або виконані частично.");
})
bot.action("infoCancelAllActiveOrder", (ctx) =>{
  ctx.replyWithHTML("Cancel All Active Orders(відміна всіх активних замовлень) - назва функції сама каже за себе, то що вона відміняє усі активні ордери користувача на ринку диривативів, які не були виконані або виконані частично");
})
//FUNCTION - getTime
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
//FUNCTION - getRunTime
function getRunTime(t) {
  date = new Date(t*1000);
  year = date.getFullYear();
  day = date.getDate();
  month = date.getMonth() + 1;
  hours = date.getHours();
  minutes = date.getMinutes();
  seconds = date.getSeconds();
  return  day + "." + month + " " + hours+":"+minutes+":"+seconds;
}
//FUNCTION - resultKline
async function resultKline(limit, ctx, result)
{
  for(let i = 0; i < limit; i++)
  {
    res = result.result[i];
    await ctx.replyWithHTML("<b>Початкова вартість:</b> " + res['open'] + "$\n<b>Найвища ціна:</b> " + res['high'] + "$\n<b>Найнижча ціна:</b> " + res['low'] + "$\n<b>Кінцева вартість:</b> " + res['close'] + "$\n<b>Об'єм:</b> " + res['volume'] + "$\n<b>Дата:</b> " + getRunTime(res['open_time']));
  }
}
//FUNCTION - sklonenie
const sklonenie = (number, txt, cases = [2, 0, 1, 1, 1, 2]) => txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
//HEAR - time
bot.hears("time", ctx=> {
  let side = 'TEXT';
  side = side.toLowerCase();
    if(side == 'text')
    {
      side = side.replace('text', 'Text');
    }
  // getTime();
})
//HEAR - Get ApiKey
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
//HEAR - Get ApiKeyInfo
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

//BUTTON - Wallet Balance
bot.hears("Get Wallet Balance", (ctx) =>{
  if(chooseApiKey == true)
  {
    ctx.reply("Зрозумів, тепер введіть будь ласка символ за яким буде виведено баланс, наприклад: USDT / BTC / ETH");
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

//BUTTON- Symbol
bot.hears("Symbol", (ctx) => {
  ctx.reply("Зрозумів, тепер введіть будь ласка пару символів, наприклад: APTUSDT / ethusdt / BtCuSdT");
  chooseButton = "Symbol";
})
//BUTTON - Order book
bot.hears("Order book", (ctx) => {
  ctx.reply("Зрозумів, тепер введіть будь ласка пару символів, наприклад: APTUSDT / solbtc / BtCuSdC");
  chooseButton = "Order book";
})
//BUTTON - Query Kline
bot.hears("Query Kline", (ctx) => {
  ctx.replyWithHTML("Зрозумів, тепер введіть будь ласка параметри за наступним виглядом\n<i>symbol:interval:from:limit</i>\nЗ яких:\n<b>symbol</b> - це символ пошуку(наприклад BTCUSD, ETHUSD)\n<b>interval</b> - це інтервал між запитами, допускаються лише такі параметри: 1 3 5 15 30 60 120 240 360 720 'D' 'M' 'W' (цифри в мінутах)\n<b>from</b> - це відколи буде починатися пошук запитів, параметри аналогічні з інтервалом\n<b>limit</b> - це кількість запитів для отримання (не може бути більше 25)\nНаприклад: BTCUSD:240:W:5");
  chooseButton = "Query Kline";
})

/**
 *
 * Market Data : Advanced
 *
 */

//BUTTON - Latest Big Deal
bot.hears("Latest Big Deal", (ctx) => {
  ctx.reply("Зрозумів, тепер введіть будь ласка пару символів, наприклад: APTUSDT / solusdt / BtCuSdT");
  chooseButton = "Latest Big Deal";
})

/**
 * Active orders
 */

//BUTTON - Get active
bot.hears("Get Active Order", (ctx) => {
  if(chooseApiKey == true)
  {
    ctx.reply("Зрозумів, тепер введіть будь ласка символ за яким буде пошук активних ордерів, наприклад: BTC / eth / xRp");
    chooseButton = "Get Active Order";
  }else{
    ctx.reply("Дану функцію неможна використовувати без API ключей");
  }

})
//BUTTON - Place active order
bot.hears("Place Active Order", (ctx) => {
  chooseApiKey = true
  if(chooseApiKey == true)
  {
    // ({side: "Sell", symbol:"BTCUSD", order_type: "Limit", qty: 1, price: 20000, time_in_force: "GoodTillCancel"})
    ctx.replyWithHTML("Зрозумів, тепер введіть будь ласка параметри за наступним виглядом:\n<i>side:symbol:order_type:qty:price:time_in_force</i>\nЗ яких:\n<b>side</b> - це сторона продажу або куплі, яка має лише два варіанти(Buy / Sell)\n<b>symbol</b> - це символ пошуку(наприклад BTC, ETH)\n<b>order_type</b> - це тип ордеру, який буде лише двох видів(Limit / Market\n<b>qty</b> - сума замовлення у $\n<b>price</b> - ціна замовлення\n<b>time_in_force</b> - період активності ордера, буває трьох типів(GoodTillCancel / FillOrKill / ImmediateOrCancel)\nБільш детальну інформацію можна переглянути у /info");
    chooseButton = "Place Active Order"
  }else{
    ctx.reply("Дану функцію неможна використовувати без API ключей");
  }

})
//BUTTON - Cancel active order
bot.hears("Cancel Active Order", (ctx) => {
  if(chooseApiKey == true)
  {
    ctx.replyWithHTML("Зрозумів, тепер введіть будь ласка символ та номер ордера за яким буде пошук активних замовлень для відміни.\nЗа форматом: symbol:orderID\nНаприклад: BTC:ae2ecb3f-4447-4599-a178-d95a16e537d7");
    chooseButton = "Cancel Active Order"
  }else{
    ctx.reply("Дану функцію неможна використовувати без API ключей");
  }
;
})
//BUTTON - Cancel all active order
bot.hears("Cancel All Active Orders", (ctx) => {
  if(chooseApiKey == true)
  {
    ctx.replyWithHTML("Зрозумів, тепер введіть будь ласка символ за яким буде пошук активних ордерів для відміни.\nНаприклад: BTC, Eth");
    chooseButton = "Cancel All Active Orders";
  }else{
    ctx.reply("Дану функцію неможна використовувати без API ключей");
  }

})

//BUTTON - Get APIKEY and APISECRET
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
//HEAR - Cancel Active Order
bot.hears(/^[A-Za-z0-9]+:[A-Za-z0-9\!\@\#\$\%\^\&\*\)\(+\=\._-]+$/g, (ctx) => {
  if(chooseButton == "Cancel Active Order")
  {
    message = ctx.message.text;
    var arrayOfStrings = message.split(":");
    let symbol = arrayOfStrings[0].toUpperCase() + 'USD', orderId = arrayOfStrings[1];
    clientInverse.cancelActiveOrder({symbol:symbol, order_id: orderId})
      .then(result => {
        if(result.ret_code == 0)
        {
          ctx.replyWithHTML("Замовлення за номером <i>" + orderId + "</i> було <b>успішно видалено</b>");
        }else{
          ctx.reply("Неправильний символ або номер замовлення");
        }

      })
      .catch(err => {
        console.error("getCancelActiveOrder error: ", err);
      });
  }
})
//HEAR - Place Active Order
bot.hears(/^[A-Za-z0-9]+:[A-Za-z0-9]+:[A-Za-z0-9]+:[A-Za-z0-9]+:[A-Za-z0-9]+:[A-Za-z0-9]/, async (ctx) => {
  if(chooseButton == "Place Active Order")
  {
    let message = ctx.message.text;
    var arrayOfStrings = message.split(":");
    let side = arrayOfStrings[0].toLowerCase(), symbol = arrayOfStrings[1].toUpperCase() + 'USD', order_type = arrayOfStrings[2].toLowerCase(), qty = arrayOfStrings[3], price = arrayOfStrings[4], timeInForce = arrayOfStrings[5];
    if(side == 'buy') side = side.replace('buy', 'Buy');
    else if(side == 'sell') side = side.replace('sell', 'Sell');
    if(order_type == 'limit') order_type = order_type.replace('limit', 'Limit');
    else if(order_type == 'market') order_type = order_type.replace('market', 'Market');
    clientInverse.placeActiveOrder({side: side, symbol: symbol, order_type: order_type, qty: qty, price: price, time_in_force: timeInForce})
    .then(result => {
      if(result.ret_code == 0)
      {
        let data = result.result,
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
        "Замовлення було успішно створено!" 
          +"\n<b>Символ: </b>" + data['symbol']
          + "\n<b>Сторона: </b>" + side
          + price
          + "\n<b>Сума замовлення: </b>" + data['qty']
          + "$\n<b>Тип замовлення: </b>" + type
          + "\n<b>Період активності замовлення: </b>" + timeInForce
          + "\n<b>Дата створення: </b>" + date
          + "\n<b>ID замовлення: </b>" + data['order_id']
        );
      }else{
        ctx.reply("Неправильно введено параметри, будь ласка перевірте правильність їх написання, та спробуйте ще раз");
      }
    })
    .catch(err => {
      console.error("Place Active Order error: ", err);
    });
  }
})
bot.hears(/^[A-Za-z0-9]/, (ctx) => {
  //HEAR - Symbol
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
        ctx.reply("Неправильно введений символ або інша помилка");
      }
    })
    .catch(err =>{
      ctx.reply("getTickers error: ", err);
    })
  }
  //HEAR - Order book
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
            answerBuy += "<b>Ціна :</b>" + price + "$\n<b>Об'єм: </b>" + size + "$\n\n";
          }else if(side == 'Sell'){
            answerSell += "<b>Ціна :</b>" + price + "$\n<b>Об'єм: </b>" + size + "$\n\n";
          }
        }
        ctx.replyWithHTML("Останні 25 ордерів за символом " + message + " на купівлю\n" + answerBuy);
        ctx.replyWithHTML("Останні 25 ордерів за символом " + message + " на продаж\n" + answerSell);
      }else{
        ctx.reply("Неправильно введений символ або інша помилка");
      }

    })
    .catch(err => {
      console.error("getOrderBook error: ", err);
    });
  }
  //HEAR - Query Kline
  if(chooseButton == "Query Kline")
  {
    let message = ctx.message.text;
    var arrayOfStrings = message.split(":");
    let symbol = arrayOfStrings[0].toUpperCase(), interval = arrayOfStrings[1], from = arrayOfStrings[2], limit = arrayOfStrings[3];
    if((interval == 1 || interval == 5 || interval == 15 || interval == 30 || interval == 60 || interval == 120 || interval == 240 || interval == 360 || interval == 720 || interval == 'D' || interval == 'M' || interval == 'W') && limit <=25)
    {
      fromTime = new Date();
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
      }else {
        fromTime = Math.round(fromTime / 1000);
      }

      clientInverse.getKline({symbol:symbol, interval:interval, from: fromTime, limit: limit})
      .then(async result => {
        if(result.ret_code == 0)
        {
          let resLenght = result.result.length;
          if(resLenght != limit)
          {
            ctx.reply("За зазначений Вами час було отримано лише " + resLenght + r + " " + sklonenie(resLenght, ['запис', 'записи', 'записів']) + "\nДля отримання більше записів ви можете або збільшити від коли шукати записи, або зменшити інтервал");
            resultKline(resLenght, ctx, result);
          }else{
            await ctx.reply("Запит вдалий!");
            await resultKline(limit, ctx, result);
          }
        }else{
          ctx.replyWithHTML("Неправильно введено параметри.\nПродивіться будь ласка правильність їх написання та запустіть функцію ще раз.")
        }
      })
      .catch(err => {
        console.error("getKline error: ", err);
      });
    }else{
      ctx.reply("Неправильно введений інтервал");
    }
  }
  //HEAR - Latest Big Deal
  if(chooseButton == "Latest Big Deal")
  {
    let message = ctx.message.text.toUpperCase();
    clientInverse.getLatestBigDeal({symbol: message, limit: 500})
      .then(result => {
        console.log(result);
        if(result.ret_code == 0)
        {
          if(result.result.length != 0)
          {
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
            ctx.replyWithHTML(sklonenie(b, ['Найбільша', 'Найбільші', 'Найбільших']) + " " + b + " " + sklonenie(b, ['угода', 'угоди', 'угод']) + " " + "купівлі за останні 24 години за символом " + message + "\n\n" + answerBuy);
            ctx.replyWithHTML(sklonenie(s, ['Найбільша', 'Найбільші', 'Найбільших']) + " " + s + " " + sklonenie(s, ['угода', 'угоди', 'угод']) + " " + "продажу за останні 24 години за символом " + message + "\n\n" + answerSell);
          }else{
            ctx.reply("За сьогодні не було угод які перевищували 500.000$");
          }
        }else{
          ctx.reply("Неправильно введений символ або інша помилка");
        }
      })
      .catch(err => {
        console.error("getLatest error: ", err);
      });
  }
  //HEAR - Get Wallet Balance
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
        ctx.reply("Неправильно введений символ або інша помилка");
      }
    })
    .catch(err => {
      console.error("getWalletBalance error: ", err);
    });
  }
  //HEAR - Get Active Order
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
  //HEAR - Cancel All Active Orders
  if(chooseButton == "Cancel All Active Orders")
  {
    let message = ctx.message.text.toUpperCase() + 'USD';
    clientInverse.cancelAllActiveOrders({symbol: message})
      .then(result => {
        if(result.ret_code == 0)
        {
          let resLenght = result.result.length;
          if(resLenght != 0)
          {
            let orders = '';
            for(var i = 0; i < resLenght; i++)
            {
              orders += "\nID замовлення: " + result.result[i]['clOrdID'];
            }
            ctx.reply("Було успішно видалено " + resLenght + sklonenie(resLenght, [' замовлення', ' замовлення', ' замовлень']) + sklonenie(resLenght, [' за номером:', ' за номерами:', ' за номерами:']) + orders);
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
})
bot.launch();