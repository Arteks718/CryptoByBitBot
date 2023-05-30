const { Markup } = require("telegraf");

const mainKeyboard = Markup.keyboard([
  "Ринок Деривативів (USDT безстрокові)",
  "Ринок Споту",
]).oneTime();

const direvativesAPI = Markup.keyboard([
  ["Get Tickers", "Get OrderBook", "Get Kline"],
  ["Amend Order", "Place Order", "Cancel Order", "Cancel All Orders"],
  ["Get Open Orders", "Get Orders History", "Get Wallet Balance"],
  ["Повернутись на головну"],
]).resize();

const direvativesWithoutAPI = Markup.keyboard([
  ["Get Tickers", "Get OrderBook", "Get Kline"],
  ["Повернутись на головну"],
]).resize();

const spotAPI = Markup.keyboard([
  ["Get Tickers", "Get OrderBook", "Get Kline"],
  ["Place Order", "Cancel Order", "Cancel All Orders"],
  ["Get Open Orders", "Get Orders History", "Get Wallet Balance"],
  ["Повернутись на головну"],
]).resize();

const spotWithoutAPI = Markup.keyboard([
  ["Get Tickers", "Get OrderBook", "Get Kline"],
  ["Повернутись на головну"],
]).resize();

const noSubscribe = Markup.keyboard([
  "Змінити API ключі",
  "Підписатись на оновлення",
  "Повернутись на головну"
]).resize();

const subscribe = Markup.keyboard([
  "Змінити API ключі",
  "Відписатись від оновлень",
  "Повернутись на головну"
]).resize();


module.exports = {
  mainKeyboard,
  direvativesAPI,
  direvativesWithoutAPI,
  spotAPI,
  spotWithoutAPI,
  noSubscribe,
  subscribe
};
