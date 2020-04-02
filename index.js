process.env.NTBA_FIX_319 = 1;
// let SavedNews10 = require('./apis/SavedNews');
let TelegramBot = require('node-telegram-bot-api');
let { crawlNowNews10, crawlNewDetail } = require('./apis');

const token = process.env.token || require('./config').token;
const bot = new TelegramBot(token, {polling: true});
bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'I am still alive');
});

bot.on("polling_error", (err) => console.log(err));

let nowNewsList = crawlNowNews10();
console.log(nowNewsList);

let savedNews10 = new SavedNews10();

console.log(savedNews10.get());

// count 表示需要插入几条新闻，也是需要向 Telegram 发送几条
let count = savedNews10.compare(nowNewsList);
console.log('count: ' + count);
for(let i = count-1; i >= 0; i--) {
  let news = crawlNewDetail(nowNewsList[i].url)
  Object.assign(news, nowNewsList[i]);
  // push to TG
  bot.sendMessage('-1001160746784', `${news.title}\n${news.url}`);
  // push TG end
  savedNews10.push(news);
}
