import { chooseApiKey } from "../../auth.js";

let chooseButton;

export default (bot) => {
  bot.hears("Get Wallet Balance", (ctx) => {
    if (chooseApiKey) {
      ctx.reply(
        "Зрозумів, тепер введіть будь ласка символ за яким буде виведено баланс, наприклад: USDT / BTC / ETH"
      );
      chooseButton = "Get Wallet Balance";
    } else {
      ctx.reply("Дану функцію неможна використовувати без API ключей");
    }
  });

  /**
   *
   * Market Data Endpoints
   *
   */

  //BUTTON- Symbol
  bot.hears("Symbol", (ctx) => {
    ctx.reply(
      "Зрозумів, тепер введіть будь ласка пару символів, наприклад: APTUSDT / ethusdt / BtCuSdT"
    );
    chooseButton = "Symbol";
  });
  //BUTTON - Order book
  bot.hears("Order book", (ctx) => {
    ctx.reply(
      "Зрозумів, тепер введіть будь ласка пару символів, наприклад: APTUSDT / solbtc / BtCuSdC"
    );
    chooseButton = "Order book";
  });
  //BUTTON - Query Kline
  bot.hears("Query Kline", (ctx) => {
    ctx.replyWithHTML(
      "Зрозумів, тепер введіть будь ласка параметри за наступним виглядом\n<i>symbol:interval:from:limit</i>\nЗ яких:\n<b>symbol</b> - це символ пошуку(наприклад BTCUSD, ETHUSD)\n<b>interval</b> - це інтервал між запитами, допускаються лише такі параметри: 1 3 5 15 30 60 120 240 360 720 'D' 'M' 'W' (цифри в мінутах)\n<b>from</b> - це відколи буде починатися пошук запитів, параметри аналогічні з інтервалом\n<b>limit</b> - це кількість запитів для отримання (не може бути більше 25)\nНаприклад: BTCUSD:240:W:5"
    );
    chooseButton = "Query Kline";
  });

  /**
   *
   * Market Data : Advanced
   *
   */

  //BUTTON - Latest Big Deal
  bot.hears("Latest Big Deal", (ctx) => {
    ctx.reply(
      "Зрозумів, тепер введіть будь ласка пару символів, наприклад: APTUSDT / solusdt / BtCuSdT"
    );
    chooseButton = "Latest Big Deal";
  });

  /**
   * Active orders
   */

  //BUTTON - Get active
  bot.hears("Get Active Order", (ctx) => {
    if (chooseApiKey == true) {
      ctx.reply(
        "Зрозумів, тепер введіть будь ласка символ за яким буде пошук активних ордерів, наприклад: BTC / eth / xRp"
      );
      chooseButton = "Get Active Order";
    } else {
      ctx.reply("Дану функцію неможна використовувати без API ключей");
    }
  });
  //BUTTON - Place active order
  bot.hears("Place Active Order", (ctx) => {
    chooseApiKey = true;
    if (chooseApiKey == true) {
      // ({side: "Sell", symbol:"BTCUSD", order_type: "Limit", qty: 1, price: 20000, time_in_force: "GoodTillCancel"})
      ctx.replyWithHTML(
        "Зрозумів, тепер введіть будь ласка параметри за наступним виглядом:\n<i>side:symbol:order_type:qty:price:time_in_force</i>\nЗ яких:\n<b>side</b> - це сторона продажу або куплі, яка має лише два варіанти(Buy / Sell)\n<b>symbol</b> - це символ пошуку(наприклад BTC, ETH)\n<b>order_type</b> - це тип ордеру, який буде лише двох видів(Limit / Market\n<b>qty</b> - сума замовлення у $\n<b>price</b> - ціна замовлення\n<b>time_in_force</b> - період активності ордера, буває трьох типів(GoodTillCancel / FillOrKill / ImmediateOrCancel)\nБільш детальну інформацію можна переглянути у /info"
      );
      chooseButton = "Place Active Order";
    } else {
      ctx.reply("Дану функцію неможна використовувати без API ключей");
    }
  });
  //BUTTON - Cancel active order
  bot.hears("Cancel Active Order", (ctx) => {
    if (chooseApiKey == true) {
      ctx.replyWithHTML(
        "Зрозумів, тепер введіть будь ласка символ та номер ордера за яким буде пошук активних замовлень для відміни.\nЗа форматом: symbol:orderID\nНаприклад: BTC:ae2ecb3f-4447-4599-a178-d95a16e537d7"
      );
      chooseButton = "Cancel Active Order";
    } else {
      ctx.reply("Дану функцію неможна використовувати без API ключей");
    }
  });
  //BUTTON - Cancel all active order
  bot.hears("Cancel All Active Orders", (ctx) => {
    if (chooseApiKey == true) {
      ctx.replyWithHTML(
        "Зрозумів, тепер введіть будь ласка символ за яким буде пошук активних ордерів для відміни.\nНаприклад: BTC, Eth"
      );
      chooseButton = "Cancel All Active Orders";
    } else {
      ctx.reply("Дану функцію неможна використовувати без API ключей");
    }
  });
};

export { chooseButton };
