process.env.NTBA_FIX_319 = 1;
var http = require('http');
let request = require('sync-request');
let SavedNews10 = require('./apis/SavedNews');
let TelegramBot = require('node-telegram-bot-api');
let { crawlNowNews10, crawlNewDetail, keepAlive } = require('./apis');

const token = process.env.token || require('./config').token;
const bot = new TelegramBot(token, {polling: true});
bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'I am still alive');
});

bot.on("polling_error", (err) => console.log(err));

// 爬取
function crawl() {
  let nowNewsList = crawlNowNews10();

  let savedNews10 = new SavedNews10();

  // count 表示需要插入几条新闻，也是需要向 Telegram 发送几条
  let count = savedNews10.compare(nowNewsList);
  console.log('count: ' + count);

  // 如果 count === -1 就把爬取的 10 个新闻保存到 savedNews10 里面，不要推到 Telegram
  if(count < 0) {
    console.log('restart');
    for(let i = 9; i >= 0; i--) {
      let news = crawlNewDetail(nowNewsList[i].url)
      Object.assign(news, nowNewsList[i]);
      savedNews10.push(news);
    }
    console.log(savedNews10.get());
  } else {
    for(let i = count-1; i >= 0; i--) {
      let news = crawlNewDetail(nowNewsList[i].url)
      Object.assign(news, nowNewsList[i]);
      // push to TG
      bot.sendMessage('-1001160746784', `${news.title}\n${news.url}`);
      // push TG end
      savedNews10.push(news);
    }
  }
}

http.createServer(function (req, res) {
  res.end("I am still run");
}).listen(process.env.PORT || 5000);

crawl();
keepAlive();
setInterval(function() {
  console.log('start crawl')
  crawl();
  keepAlive();
}, 30 * 60 * 1000);


