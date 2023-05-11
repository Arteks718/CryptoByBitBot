const { Markup } = require("telegraf");

const mainKeyboard = Markup.keyboard([
  "Ринок Деривативів(USDT безстрокові)",
  "Ринок Споту",
]).oneTime();

const settingKeyboard = Markup.keyboard([
  "Змінити API ключі",
  "Підписатись на оновлення",
]).resize();

const directivesAPI = Markup.keyboard([
  ["Get Tickers", "Get OrderBook", "Get Kline"],
  ["Amend Order", "Place Order", "Cancel Order", "Cancel All Orders"],
  ["Get Open Orders", "Get Orders History", "Get Wallet Balance"],
  ["Повернутись на головну"],
]).resize().oneTime();

const directivesWithoutAPI = Markup.keyboard([
  ["Get Tickers", "Get OrderBook", "Get Kline"],
  ["Повернутись на головну"],
]).resize().oneTime();

const spotAPI = Markup.keyboard([
  ["Get Tickers", "Get OrderBook", "Get Kline"],
  ["Amend Order", "Place Order", "Cancel Order", "Cancel All Orders"],
  ["Get Open Orders", "Get Orders History", "Get Wallet Balance"],
  ["Повернутись на головну"],
]).resize().oneTime();

const spotWithoutAPI = Markup.keyboard([
  ["Get Tickers", "Get OrderBook", "Get Kline"],
  ["Повернутись на головну"],
]).resize().oneTime();


module.exports = {
  mainKeyboard,
  settingKeyboard,
  directivesAPI,
  directivesWithoutAPI,
  spotAPI,
  spotWithoutAPI
};
