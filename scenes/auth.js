const { Scenes } = require("telegraf");
const { message } = require('telegraf/filters');

const authScene = new Scenes.BaseScene('auth');

authScene.enter(ctx => ctx.reply('Enter token'));

authScene.on(message("text"), async ctx => {
    if (ctx.message.text.match(/goodtoken/)) {
        await ctx.reply("Accepted");

        return ctx.scene.leave();
    } else {
        await ctx.reply('Wrong token');

        return ctx.scene.enter("auth")
    }
});

module.exports = { authScene };
