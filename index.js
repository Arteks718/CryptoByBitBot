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
let API_KEY = "";
let API_SECRET = "";
const useTestnet = false;
const recvWindow = 5000;
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

function getTickets(choose)
{

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

function getTickers(symbol)
{
  clientInverse.getTickers({symbol: symbol})
  .then(result => {
    console.log("getTickers result: ", result);
  })
  .catch(err =>{
    console.error("getTickers error: ", err);
  })
}

bot.hears("balance", (ctx) =>{
  clientInverse.getWalletBalance({coin: "BTC"})
  .then(result => {
    console.log("getWalletBalance result: ", result);
  })
  .catch(err => {
    console.error("getWalletBalance error: ", err);
  });
})


  // requestLibraryOptions


// For public-only API calls, simply don't provide a key & secret or set them to undefined
// const client = new InverseClient({});


// clientInverse.getServerTime()
//   .then(result => {
//     console.log("getServerTime result: ", result);
//   })
//   .catch(err => {
//     console.error("getServerTime error: ", err);
//   });



// clientInverse.getTickers({symbol: "APTUSDT"})
//   .then(result => {
//     console.log("getTickers result: ", result);
//   })
//   .catch(err =>{
//     console.error("getTickers error: ", err);
//   })
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





// client.getLongShortRatio({symbol: "APTUSD", period:"5min"})
//   .then(result => {
//     console.log("getApiKeyInfo result: ", result);
//   })
//   .catch(err => {
//     console.error("getApiKeyInfo error: ", err);
//   });
// client.getOrderBook({ symbol: 'BTCUSD' })
//   .then(result => {
//     console.log("getOrderBook result: ", result);
//   })
//   .catch(err => {
//     console.error("getOrderBook error: ", err);
//   });

// clientUnified.getBalances({coin: "USDT"})
//   .then(result => {
//     console.log("getBalances result: ", result);
//   })
//   .catch(err => {
//     console.error("getBalances error: ", err);
//   });

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
bot.hears("Symbol", (ctx) => {
  clientInverse.getTickers({symbol: "symbol"})
  .then(result => {
    console.log("getTickers result: ", result);
    ctx.reply("getTickers result: ", result.ret_msg);
  })
  .catch(err =>{
    ctx.reply("getTickers error: ", err);
  })
})
// send messege if user doesn't want enter api key and secret key
bot.action("noAPI", (ctx) => {
  ctx.deleteMessage(ctx.inlineMessageId);
  chooseApiKey = false;
  ctx.reply("Добре, якщо передумаєте, то зможете у будь-який час додати свої ключі");
  if(chooseApiKey == false)
  {
    ctx.reply("Тепер ви можете користуватись функціями бота", keyboardApiNo.reply());
  }
})

bot.launch();