// TODO: this seems slower than before in getData
const request = require("request");
const items = require("../../data/items.json"); // TODO: this should be updated or use official api

const itemScraper = {
    formatSearch: (string) => {
        let item = string;
        item = item.split("");
        for (let i = 0; i < item.length; i += 1) {
            if (i === 0) item[i] = item[i].toUpperCase();
            else item[i] = item[i].toLowerCase();
        }
        return item.join("");
    },

    matchID: (req, res, next) => {  // eslint-disable-line consistent-return
        const item = itemScraper.formatSearch(req.params.item);
        for (let i = 0; i < items.length; i += 1) {
            if (items[i].name === item) {
                itemScraper.id = items[i].id;
                return next();
            } else if (i === items.length - 1) console.log(`${req.params.item} not found.`);
        }
        return res.status(422).json({ data: "invalid" });
    },

    getData: (req, res) => {
        const item = {};
        const id = itemScraper.id;
        const itemInfoUrl = `http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=${id}`;
        const itemPriceUrl = `http://services.runescape.com/m=itemdb_oldschool/api/graph/${id}.json`;
        return request(itemInfoUrl, (err1, response1) => {
            if (err1) return console.log(err1);
            item.info = response1;
            return request(itemPriceUrl, (err2, response2) => {
                if (err2) return console.log(err2);
                item.price = response2;
                console.log(`${req.params.item} retrieved.`);
                return res.json(item);
            });
        });
    }
};

module.exports = itemScraper;
