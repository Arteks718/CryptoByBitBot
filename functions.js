import { clientInverse, recvWindow } from "./auth.js";

const sklonenie = (number, txt, cases = [2, 0, 1, 1, 1, 2]) =>
  txt[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];

//FUNCTION - getRunTime
function getRunTime(t) {
  date = new Date(t * 1000);
  year = date.getFullYear();
  day = date.getDate();
  month = date.getMonth() + 1;
  hours = date.getHours();
  minutes = date.getMinutes();
  seconds = date.getSeconds();
  return day + "." + month + " " + hours + ":" + minutes + ":" + seconds;
}
//FUNCTION - resultKline
async function resultKline(limit, ctx, result) {
  for (let i = 0; i < limit; i++) {
    res = result.result[i];
    await ctx.replyWithHTML(
      "<b>Початкова вартість:</b> " +
        res["open"] +
        "$\n<b>Найвища ціна:</b> " +
        res["high"] +
        "$\n<b>Найнижча ціна:</b> " +
        res["low"] +
        "$\n<b>Кінцева вартість:</b> " +
        res["close"] +
        "$\n<b>Об'єм:</b> " +
        res["volume"] +
        "$\n<b>Дата:</b> " +
        getRunTime(res["open_time"])
    );
  }
}

function getTime() {
  clientInverse
    .getServerTime()
    .then((result) => {
      let timeNow = Math.round(result.time_now * 1000),
        date = new Date().getTime();
      if (timeNow - recvWindow <= date < timeNow + 1000) {
        console.log("getServerTime result: ", timeNow);
        console.log("Time: ", date);
        console.log("recv: ", timeNow - date);
      } else {
        console.log("nea");
      }
    })
    .catch((err) => {
      console.error("getServerTime error: ", err);
    });
}

export { sklonenie, getRunTime, resultKline, getTime };
