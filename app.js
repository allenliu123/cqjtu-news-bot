process.env.NTBA_FIX_319 = 1;
var http = require('http');
// let SavedNews10 = require('./apis/SavedNews');
let SavedNewsSet = require('./apis/SavedNewsSet');
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

  let newsSet = new SavedNewsSet();

  let newNews = newsSet.compare(nowNewsList);
  console.log('newNews: ' + newNews);

  if(newNews === null) {
    console.log('restart');
  } else {
    newNews.forEach(news => {
      // console.log(`sendMessage ${news.title} ${news.url}`)
      bot.sendMessage('-1001160746784', `${news.title}\n${news.url}`);
    })
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
