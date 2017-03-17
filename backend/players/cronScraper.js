const request = require("request");
const async = require("async");
const pg = require("pg");
// const config = require("../config");

const connectionString =  process.env.DATABASE_URL || "postgres://localhost:5432/osrs_hub";

const skillObj = {};

async.waterfall([
    (callback) => {
        const results = [];

        pg.connect(connectionString, (err, client, done) => { // eslint-disable-line consistent-return
            if (err) {
                done();
                console.log(err);
                return;
            }

            // first method of upserting player table, updates all
            const query = client.query("SELECT username FROM players");

            query.on("row", (row) => {
                results.push(row);
            });

            query.on("error", (error) => {
                done();
                results.push(error);
                return callback(true, results);
            });

            // after all data is returned, close connection and return results
            query.on("end", () => {
                done();
                return callback(null, results);
            });
        });
    },

    (players, callback) => {
        skillObj.username = [];
        async.each(players, (player, innerCallback) => {
            const hiscoreUrl = `http://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${player.username}`;
            return request(hiscoreUrl, (error, response) => {
                if (error) return innerCallback(true, error);
                const playerArr = response.body.split("\n");
                const skillTypes = [
                    "Overall", "Attack", "Defence", "Strength", "Hitpoints",
                    "Ranged", "Prayer", "Magic", "Cooking", "Woodcutting",
                    "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing",
                    "Mining", "Herblore", "Agility", "Thieving", "Slayer",
                    "Farming", "Runecraft", "Hunter", "Construction"
                ];

                for (let i = 0; i < skillTypes.length; i += 1) {
                    const skillVals = playerArr[i].split(",");
                    if (!skillObj[skillTypes[i]]) skillObj[skillTypes[i]] = [];
                    skillObj[skillTypes[i]].push(parseInt(skillVals[1]));
                }
                skillObj.username.push(`'${player.username}'`); // SQL expects ''
                return innerCallback(null);
            });
        }, () => callback(null, skillObj));
    },

    (data, callback) => {
        const results = [];
        pg.connect(connectionString, (err, client, done) => { // eslint-disable-line consistent-return
            if (err) {
                done();
                console.log(err);
                return;
            }

            const query = client.query("UPDATE players SET " +
            "Overall = data_table.Overall, Attack = data_table.Attack, " +
            "Defence = data_table.Defence, Strength = data_table.Strength, " +
            "Hitpoints = data_table.Hitpoints, Ranged = data_table.Ranged, " +
            "Prayer = data_table.Prayer, Magic = data_table.Magic, " +
            "Cooking = data_table.Cooking, Woodcutting = data_table.Woodcutting, " +
            "Fletching = data_table.Fletching, Fishing = data_table.Fishing, " +
            "Firemaking = data_table.Firemaking, Crafting = data_table.Crafting, " +
            "Smithing = data_table.Smithing, Mining = data_table.Mining, " +
            "Herblore = data_table.Herblore, Agility = data_table.Agility, " +
            "Thieving = data_table.Thieving, Slayer = data_table.Slayer, " +
            "Farming = data_table.Farming, Runecraft = data_table.Runecraft, " +
            "Hunter = data_table.Hunter, Construction = data_table.Construction " +
            `FROM (SELECT unnest(ARRAY[${data.username}]) AS username, ` +
            `unnest(ARRAY[${data.Overall}]) AS Overall, ` +
            `unnest(ARRAY[${data.Attack}]) AS Attack, ` +
            `unnest(ARRAY[${data.Defence}]) AS Defence, ` +
            `unnest(ARRAY[${data.Strength}]) AS Strength, ` +
            `unnest(ARRAY[${data.Hitpoints}]) AS Hitpoints, ` +
            `unnest(ARRAY[${data.Ranged}]) AS Ranged, ` +
            `unnest(ARRAY[${data.Prayer}]) AS Prayer, ` +
            `unnest(ARRAY[${data.Magic}]) AS Magic, ` +
            `unnest(ARRAY[${data.Cooking}]) AS Cooking, ` +
            `unnest(ARRAY[${data.Woodcutting}]) AS Woodcutting, ` +
            `unnest(ARRAY[${data.Fletching}]) AS Fletching, ` +
            `unnest(ARRAY[${data.Fishing}]) AS Fishing, ` +
            `unnest(ARRAY[${data.Firemaking}]) AS Firemaking, ` +
            `unnest(ARRAY[${data.Crafting}]) AS Crafting, ` +
            `unnest(ARRAY[${data.Smithing}]) AS Smithing, ` +
            `unnest(ARRAY[${data.Mining}]) AS Mining, ` +
            `unnest(ARRAY[${data.Herblore}]) AS Herblore, ` +
            `unnest(ARRAY[${data.Agility}]) AS Agility, ` +
            `unnest(ARRAY[${data.Thieving}]) AS Thieving, ` +
            `unnest(ARRAY[${data.Slayer}]) AS Slayer, ` +
            `unnest(ARRAY[${data.Farming}]) AS Farming, ` +
            `unnest(ARRAY[${data.Runecraft}]) AS Runecraft, ` +
            `unnest(ARRAY[${data.Hunter}]) AS Hunter, ` +
            `unnest(ARRAY[${data.Construction}]) AS Construction) AS data_table ` +
            "WHERE (players.username = data_table.username) RETURNING *;");

            query.on("row", (row) => {
                results.push(row);
            });

            query.on("error", (error) => {
                done();
                results.push(error);
                return callback(true, results);
            });

            // after all data is returned, close connection and return results
            query.on("end", () => {
                done();
                return callback(null, results);
            });
        });
    }
], (err, results) => {
    if (err) {
        console.log(err, Date.now());
        return err;
    }
    console.log("Players updated.", Date.now());
    return results;
});
