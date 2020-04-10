/**
 * 使用 Set 保存
 */
class SavedNewsSet {

  // 这是一个单例类
  constructor() {
    if (!SavedNewsSet.instance) {
      this.newsSet = new Set();
      SavedNewsSet.instance = this;
    }
    return SavedNewsSet.instance;
  }

  // 返回保存的新闻
  log() {
    this.newsSet.forEach(news => {
      console.log(`log ${news.title} ${news.url}`)
    })
  }

  /**
   * 对比网站上爬取的最新新闻，返回新增加的新闻
   * @param { List } nowNewsList 网站上爬取的最新新闻
   * @return { List } 新增加的新闻
   */
  compare(nowNewsList) {
    if(this.newsSet.size === 0) {
      for(let index = 0; index < nowNewsList.length; index++) {
        this.newsSet.add(nowNewsList[index]);
      }
      return null;
    }
    let newNews = [];
    this.newsSet.forEach(item => {
      let isHere = false;
      for(let index = 0; index < nowNewsList.length; index++) {
        if(item.url === nowNewsList[index].url && item.title === nowNewsList[index].title) {
          isHere = true;
          break;
        }
      }
      if(!isHere) {
        newNews.push(nowNewsList[index]);
      }
    })
    
    for(let index = 0; index < newNews.length; index++) {
      this.newsSet.add(newNews[index]);
    }
    return newNews;
  }
}

module.exports = SavedNewsSet;