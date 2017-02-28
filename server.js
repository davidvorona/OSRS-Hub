const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const pg = require("pg");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const itemScraper = require("./backend/items/itemScraper");
const hiscoreScraper = require("./backend/players/hiscoreScraper");
const buildController = require("./backend/builds/buildController");
const userController = require("./backend/users/userController");
const sessionController = require("./backend/users/sessionController");
// const childProcess = require("./backend/players/childProcess");

const app = express();

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(session({
    store: new pgSession({
        pg,   // use global pg-module
        conString: "postgres://localhost:5432/osrs_hub" || process.env.DATABASE_URL,
        tableName: "session"
    }),
    secret: "user",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
}));

app.post("/create", userController.createUser, userController.addHash, sessionController.setCookie,
  sessionController.setSSIDCookie, sessionController.startSession, (req, res) => {
      res.json(res.body);
      console.log("User created.");
  }
);

app.post("/login", userController.authenticateUser, sessionController.setCookie,
  sessionController.setSSIDCookie, sessionController.startSession, (req, res) => {
      res.json(res.body);
      console.log("User authenticated.");
  }
);

app.get("/logout", sessionController.endSession, (req, res) => {
    res.json(res.body);
    console.log("User logged out.");
});

app.put("/modify", userController.modifyUser, sessionController.setCookie,
  sessionController.setSSIDCookie, sessionController.startSession, (req, res) => {
      res.json(res.body);
      console.log("User modified.");
  }
);

app.get("/cookies", sessionController.isLoggedIn, (req, res) => {
    res.json(res.body);
    console.log("User automatically authenticated: ", res.body.user);
});

app.get("/item/:item", itemScraper.matchID, itemScraper.getData, (req) => {
    console.log(`${req.params.item} retrieved.`);
});

app.get("/player/:player", hiscoreScraper.getData, hiscoreScraper.formatResponse, (req) => {
    console.log(`Player ${req.params.player} retrieved.`);
});

app.post("/build/:build", buildController.fetchFK, buildController.postToPG, (req) => {
    console.log(`${req.params.build} posted to database.`);
});

app.get("/build/:build", buildController.fetchFK, buildController.getFromPG, (req) => {
    console.log(`${req.params.build} retrieved from database.`);
});

// the following code was made obsolete by poor web search capabalities
// app.get("/player/:player", childProcess.runPhantom, childProcess.formatResponse, (req, res) => {
//     res.json(req.player);
// });

// TODO: move server.js into backend folder w/o
// screwing up how it serves all the files
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`You're listening on port ${process.env.PORT || 3000}.`);
});

module.exports = app;
