const { users } = require("./config.js");
const { mainKeyboard, direvativesAPI, direvativesWithoutAPI, spotAPI, spotWithoutAPI } = require("./keyboards.js");

const callSpotMarket = async (ctx) => {
  await users.findOne({ idTelegram: ctx.chat.id, chooseButtonAPI: true })
  ? ctx.reply('Ласкаво просимо до ринку споту', spotAPI)
  : ctx.reply('Ласкаво просимо до ринку споту', spotWithoutAPI);
  await users.updateOne( { idTelegram: ctx.chat.id }, {$set: {status: "spotMarket"}})
}

const calldirevativesMarket = async (ctx) => {
  await users.findOne({ idTelegram: ctx.chat.id, chooseButtonAPI: true })
  ? ctx.reply('Ласкаво просимо до ринку диревативів', direvativesAPI)
  : ctx.reply('Ласкаво просимо до ринку диревативів', direvativesWithoutAPI);
  await users.updateOne( { idTelegram: ctx.chat.id }, {$set: {status: "direvativesMarket" }})
}

const callMainMenu = async (ctx) => {
  ctx.reply("Оберіть один з ринків", mainKeyboard);
  await users.updateOne( { idTelegram: ctx.chat.id }, { $set: { status: "mainMenu" }})
}

module.exports = { callSpotMarket, calldirevativesMarket, callMainMenu };