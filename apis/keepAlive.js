var rp = require('request-promise');

module.exports = function() {
  let options = {
    uri: 'https://cqjtu-news-bot-heroku.herokuapp.com/'
  };
  rp(options).then(data => {
    console.log(data)
  });
}