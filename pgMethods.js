const pg = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/osrs_builds";

const pgMethods = {
    postToPG: (req, res, next) => {
        const data = req.body;
        const buildName = req.params.build;
        const results = [];

        pg.connect(connectionString, (err, client, done) => {
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            // SQL Query > Insert Data
            client.query("INSERT INTO builds(Name, Attack, Defence, Strength, " +
            "Hitpoints, Ranged, Magic, Prayer) values($1, $2, $3, $4, $5, $6, $7, $8)",
                [buildName, data.Attack, data.Defence, data.Strength,
                    data.Hitpoints, data.Ranged, data.Magic, data.Prayer]);

            // SQL Query > Select Data
            const query = client.query("SELECT * FROM builds ORDER BY id ASC");

            // stream results back one row at a time
            query.on("row", (row) => {
                results.push(row);
            });

            // after all data is returned, close connection and return results
            query.on("end", () => {
                done();
                return res.json(results);
            });
        });
        next();
    },

    getFromPG: (req, res, next) => {
        const buildName = req.params.build;
        const results = [];

        pg.connect(connectionString, (err, client, done) => {
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            // SQL Query > Find Data
            const query = client.query("SELECT Attack, Defence, Strength, Hitpoints, " +
              `Ranged, Magic, Prayer FROM builds WHERE (Name = '${buildName}')`);

            // stream results back one row at a time
            query.on("row", (row) => {
                results.push(row);
            });

            // after all data is returned, close connection and return results
            query.on("end", () => {
                done();
                return res.json(results);
            });
        });
        next();
    }
};

module.exports = pgMethods;
