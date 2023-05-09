const { users } = require("./config.js");
const { mainKeyboard, directivesAPI, directivesWithoutAPI, spotAPI, spotWithoutAPI } = require("./keyboards.js");

const callSpotMarket = async (ctx) => {
  await users.findOne({ idTelegram: ctx.chat.id, chooseButtonAPI: true })
  ? ctx.reply('Ласкаво просимо до ринку споту', spotAPI)
  : ctx.reply('Ласкаво просимо до ринку споту', spotWithoutAPI);
  await users.updateOne( { idTelegram: ctx.chat.id }, {$set: {status: "spotMarket"}})
}

const calldirectivesMarket = async (ctx) => {
  await users.findOne({ idTelegram: ctx.chat.id, chooseButtonAPI: true })
  ? ctx.reply('Ласкаво просимо до ринку диревативів', directivesAPI)
  : ctx.reply('Ласкаво просимо до ринку диревативів', directivesWithoutAPI);
  await users.updateOne( { idTelegram: ctx.chat.id }, {$set: {status: "directivesMarket" }})
}

const callMainMenu = async (ctx) => {
  ctx.reply("Оберіть один з ринків", mainKeyboard);
  await users.updateOne( { idTelegram: ctx.chat.id }, { $set: { status: "mainMenu" }})
}

module.exports = { callSpotMarket, calldirectivesMarket, callMainMenu };