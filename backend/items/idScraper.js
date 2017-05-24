const fs = require("fs");
const path = require("path");
const ufItems = require("../../data/ufItems");

console.log(ufItems[2]);
const items = [];
const data = ufItems;

Object.keys(data).forEach((el) => {
    const temp = {};
    temp.id = el;
    temp.name = data[el].name;
    items.push(temp);
});

fs.writeFile(path.join(__dirname, "..", "..", "data/items.json"), JSON.stringify(items), (err) => {
    if (err) throw err;
    console.log("Item ids saved.");
});
