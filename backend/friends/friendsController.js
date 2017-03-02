const pg = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/osrs_hub";

const friendsController = {
    addFriend: (req, res, next) => {
        const data = req.body;
        const results = [];

        pg.connect(connectionString, (err, client, done) => {
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            const query = client.query("INSERT INTO friends (user_id, player_id) " +
            "values($1, $2)", [data.user_id, data.player_id.toLowerCase()]);

            query.on("error", (error) => {
                done();
                results.push(error);
                return res.status(500).json(results);
            });

            // after all data is returned, close connection and return results
            query.on("end", () => {
                done();
                return next();
            });
        });
    },

    getFriends: (req, res, next) => {
        const results = [];

        pg.connect(connectionString, (err, client, done) => {
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            const query = client.query("SELECT players FROM users " +
            "JOIN friends ON users.id = friends.user_id " +
            "JOIN players ON players.username = friends.player_id " +
            `WHERE (users.id = '${req.body.user_id}')`);

            query.on("row", (row) => {
                results.push(row);
            });

            // after all data is returned, close connection and return results
            query.on("end", () => {
                done();
                res.body = results;
                return next();
            });
        });
    },

    formatList: (req, res, next) => {
        const data = res.body;
        const friendsList = [];
        const attr = ["Overall", "Attack", "Defence", "Strength", "Hitpoints",
            "Ranged", "Magic", "Prayer", "Cooking", "Woodcutting", "Fletching", "Fishing",
            "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility",
            "Thieving", "Slayer", "Farming", "Runecraft", "Hunter", "Construction"];

        data.forEach((el) => {
            const playerObj = {};
            let player = el.players.split("");
            player.shift();
            player.pop();
            player = player.join("").split(",");
            const username = player[0].split(" ");
            if (username.length > 1) username.forEach((elem, i) => { username[i] = elem.replace(/"/g, ""); });
            player.shift();
            const dateCreated = player[player.length - 1];
            player.pop();
            playerObj.username = username;
            playerObj.dateCreated = dateCreated;
            player.forEach((elem, i) => {
                playerObj[attr[i]] = parseInt(elem);
            });
            friendsList.push(playerObj);
        });
        res.body = friendsList;
        return next();
    }
};

module.exports = friendsController;
