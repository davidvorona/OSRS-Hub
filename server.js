const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const itemScraper = require("./itemScraper");
const hiscoreScraper = require("./hiscoreScraper");
const pgMethods = require("./pgMethods");
// const childProcess = require("./childProcess");

const app = express();

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ng-submit function hits these routes, returns json, and angular displays on webpage
app.get("/item/:item", itemScraper.matchID, itemScraper.getData, (req) => {
    console.log(`${req.params.item} retrieved.`);
});

app.get("/player/:player", hiscoreScraper.getData, hiscoreScraper.formatResponse, (req) => {
    console.log(`Player ${req.params.player} retrieved.`);
});

app.post("/build/:build", pgMethods.postToPG, (req) => {
    console.log(`${req.params.build} posted to database.`);
});

app.get("/build/:build", pgMethods.getFromPG, (req) => {
    console.log(`${req.params.build} retrieved from database.`);
});

// the following code was made obsolete by the MOST HIDDEN API ON THE PLANET
// app.get("/player/:player", childProcess.runPhantom, childProcess.formatResponse, (req, res) => {
//     res.json(req.player);
// });

// on server start, going to "/" serves index.html file,
// which loads up angular, modules, and controller as usual
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`You're listening on port ${process.env.PORT || 3000}.`);
});

module.exports = app;
