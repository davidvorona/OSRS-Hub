// angular $http module sends request to url, scrapeController executes
const request = require('request');
const items = require('./public/data/items.json');

const itemScraper = {
  formatSearch: (string) => {
    let item = string;
    item = item.split('');
    for (let i = 0; i < item.length; i += 1) {
      if (i === 0) item[i] = item[i].toUpperCase();
      else item[i] = item[i].toLowerCase();
    }
    return item.join('');
  },

  matchID: (req, res, next) => {
    const item = itemScraper.formatSearch(req.params.item);
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].name === item) {
        itemScraper.id = items[i].id;
        next();
        return;
      } else if (i === items.length - 1) console.log('Item not found.'); // add logic to getData and controller for this case
    }
  },

  getData: (req, res, next) => {
    req.item = {};
    const id = itemScraper.id;
    const itemInfoUrl = `http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=${id}`;
    const itemPriceUrl = `http://services.runescape.com/m=itemdb_oldschool/api/graph/${id}.json`;
    request(itemInfoUrl, (error, response) => {
      if (error) return console.log(error);
      req.item.info = response;
      request(itemPriceUrl, (error, response) => {
        if (error) return console.log(error);
        req.item.price = response
        next();
      });
    });
  }
};

module.exports = itemScraper;
