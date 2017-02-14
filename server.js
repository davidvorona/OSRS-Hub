const express = require("express");
const path = require("path");
const itemScraper = require("./itemScraper");
const hiscoreScraper = require("./hiscoreScraper");
// const childProcess = require("./childProcess");

const app = express();

app.use(express.static(path.join(__dirname)));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ng-submit function hits these routes, returns json, and angular displays on webpage
app.get("/item/:item", itemScraper.matchID, itemScraper.getData, (req, res) => {
    res.json(req.item);
});

app.get("/player/:player", hiscoreScraper.getData, hiscoreScraper.formatResponse, (req, res) => {
    res.json(req.player);
});

// the following code was made obsolete by the MOST HIDDEN API ON THE PLANET
// TODO: implement selenium testing
// app.get("/player/:player", childProcess.runPhantom, childProcess.formatResponse, (req, res) => {
//     res.json(req.player);
// });

// on server start, going to "/" serves index.html file,
// which loads up angular, modules, and controller as usual
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`You"re listening on port ${process.env.PORT || 3000}.`);
});

module.exports = app;
