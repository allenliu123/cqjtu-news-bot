/**
 * 用于保存 10 条新闻
 */
class SavedNews10 {

  // 这是一个单例类
  constructor() {
    if (!SavedNews10.instance) {
      this.newsList = [];
      SavedNews10.instance = this;
    }
    return SavedNews10.instance;
  }

  // 列表头部加入一条最新新闻，并删除最后一条，保持最新的 10 条新闻
  push(news) {
    this.newsList.unshift(news);
    this.newsList.length = 10;
  }

  // 返回保存的 10 条新闻
  get() {
    return this.newsList;
  }

  /**
   * 对比网站上爬取的最新新闻，返回有几条不同 
   * @param { List } nowNewsList 网站上爬取的最新新闻
   * @return { Number } 返回几，就表示需要插入几条数据，返回 10 表示没有相同的，需要全部插入
   */
  compare(nowNewsList) {
    if(this.newsList.length === 0) {
      return -1;
    }
    for(let index = 0; index < nowNewsList.length; index++) {
      if(this.newsList[0].url === nowNewsList[index].url
      && this.newsList[0].title === nowNewsList[index].title) {
        return index;
      }
    }
    return 10;
  }
}

module.exports = SavedNews10;