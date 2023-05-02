import { clientInverse } from "../../auth.js";
import { chooseButton } from "./choose.js";

export default (bot) => {
  if (chooseButton == "Get Wallet Balance") {
    bot.hears(/^[A-Za-z0-9]/, (ctx) => {
      // console.log("tsettsts");
      let message = ctx.message.text.toUpperCase();
      clientInverse
        .getWalletBalance({ coin: message })
        .then((result) => {
          if (result.ret_code == 0) {
            let data = result.result[message];
            ctx.replyWithHTML(
              "<b>Баланаас гаманця: </b>" +
                data["wallet_balance"].toFixed(4) +
                "$\n<b>Сума балансу та нереаалізованого PNL: </b>" +
                data["equity"].toFixed(4) +
                "$\n<b>Доступні кошти: </b>" +
                data["available_balance"].toFixed(4) +
                "$\n<b>Використовувана маржа: </b>" +
                data["used_margin"].toFixed(4) +
                "$\n<b>Реалізована PNL: </b>" +
                data["realised_pnl"].toFixed(4) +
                "$\n<b>Нереалізована PNL: </b>" +
                data["unrealised_pnl"].toFixed(4) +
                "$"
            );
          } else {
            console.log(result);
            ctx.reply("Неправильно введений символ або інша помилка!");
          }
        })
        .catch((err) => {
          console.error("getWalletBalance error: ", err);
        });
    });
  }
  // chooseButton = "";
};

export { chooseButton }