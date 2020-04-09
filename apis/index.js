let request = require('sync-request');
let cheerio = require('cheerio');
var rp = require('request-promise');

// 爬取 10 条最新新闻
function crawlNowNews10() {
  // 时政要闻网页
  let url = 'http://news.cqjtu.edu.cn/list.jsp?urltype=tree.TreeTempUrl&wbtreeid=1021';
  let html = request('get', url, {
    headers: {
      'User-Agent': 'Request-Promise'
    }
  }).getBody().toString();
  let $ = cheerio.load(html);
  // 找到网页上的“最新新闻“版块
  let nowNewsList = $('.zxxw>li');
  let returnList= [];
  for(let i = 0; i < 10; i++) {
    let obj = new Object();
    obj.url = 'http://news.cqjtu.edu.cn' + nowNewsList[i].children[0].attribs.href;
    obj.title = nowNewsList[i].children[0].attribs.title;
    returnList.push(obj);
  }
  return returnList;
  // console.log($('.zxxw>li')[0].children[0].attribs.href);
}

// 爬取 新闻详情
function crawlNewDetail(url) {
  let html = request('get', url, {
    headers: {
      'User-Agent': 'Request-Promise'
    }
  }).getBody().toString();
  let $ = cheerio.load(html);
  return {
    // type: $('.currt-nav')[0].children[3].children[0].data || '',
    
    time: $('.article-editor p')[0].children[2].data.trim() || '',
    content: 'content'
  }
}

// 保持程序运行
function keepAlive() {
  let options = {
    uri: 'https://cqjtu-news-bot-heroku.herokuapp.com/'
  };
  rp(options).then(data => {
    console.log(data)
  });
}

module.exports = {
  crawlNowNews10: crawlNowNews10,
  crawlNewDetail: crawlNewDetail,
  keepAlive: keepAlive
}