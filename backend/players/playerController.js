const pg = require("pg");

const connectionString = process.env.DATABASE_URL;

const playerController = {
    addPlayer: (req, res, next) => {
        const data = req.body;
        console.log(data);
        const results = [];

        pg.connect(connectionString, (err, client, done) => { // eslint-disable-line consistent-return
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            // first method of upserting player table, updates all
            const query = client.query("INSERT INTO players (username, Overall, Attack, Defence, " +
            "Strength, Hitpoints, Ranged, Magic, Prayer, Cooking, Woodcutting, Fletching, " +
            "Fishing, Firemaking, Crafting, Smithing, Mining, Herblore, Agility, " +
            "Thieving, Slayer, Farming, Runecraft, Hunter, Construction, date_created) " +
            " values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, " +
            "$15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26) ON CONFLICT (username) " +
            `DO UPDATE SET Overall = ${data.Overall}, Attack = ${data.Attack}, Defence = ${data.Defence}, ` +
            `Strength = ${data.Strength}, Hitpoints = ${data.Hitpoints}, Ranged = ${data.Ranged}, ` +
            `Magic = ${data.Magic}, Prayer = ${data.Prayer}, Cooking = ${data.Cooking}, ` +
            `Woodcutting = ${data.Woodcutting}, Fletching = ${data.Fletching}, Fishing = ${data.Fishing}, ` +
            `Firemaking = ${data.Firemaking}, Crafting = ${data.Crafting}, Smithing = ${data.Smithing}, ` +
            `Mining = ${data.Mining}, Herblore = ${data.Herblore}, Agility = ${data.Agility}, ` +
            `Thieving = ${data.Thieving}, Slayer = ${data.Slayer}, Farming = ${data.Farming}, ` +
            `Runecraft = ${data.Runecraft}, Hunter = ${data.Hunter}, Construction = ${data.Construction}`,
                [data.player_id, data.Overall, data.Attack, data.Defence, data.Strength, data.Hitpoints,
                    data.Ranged, data.Magic, data.Prayer, data.Cooking, data.Woodcutting, data.Fletching,
                    data.Fishing, data.Firemaking, data.Crafting, data.Smithing, data.Mining,
                    data.Herblore, data.Agility, data.Thieving, data.Slayer, data.Farming,
                    data.Runecraft, data.Hunter, data.Construction, data.dateCreated]);

            query.on("row", (row) => {
                results.push(row);
            });

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

    removePlayer: () => { // eslint-disable-line consistent-return
        // IN DEVELOPMENT
    }
};

module.exports = playerController;
