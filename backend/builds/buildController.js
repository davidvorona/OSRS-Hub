const pg = require("pg");

const connectionString = process.env.DATABASE_URL;

const buildController = {
    fetchFK: (req, res, next) => {
        const username = req.body.username || req.query.username;
        const results = [];

        pg.connect(connectionString, (err, client, done) => { // eslint-disable-line consistent-return
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }
            const query = client.query(`SELECT id FROM users WHERE (username = '${username}')`);

            query.on("row", (row) => {
                results.push(row);
            });

            // after all data is returned, close connection and return results
            query.on("end", () => {
                done();
                req.body.user_id = results[0].id;
                return next();
            });
        });
    },

    postToPG: (req, res, next) => {
        const data = req.body;
        const buildName = req.params.build;
        const results = [];

        pg.connect(connectionString, (err, client, done) => { // eslint-disable-line consistent-return
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            // insert into table
            client.query("INSERT INTO builds(user_id, Name, Attack, Defence, Strength, " +
            "Hitpoints, Ranged, Magic, Prayer) values($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                [data.user_id, buildName, data.Attack, data.Defence, data.Strength,
                    data.Hitpoints, data.Ranged, data.Magic, data.Prayer]);

            // select all data
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
        const data = req.body;
        const buildName = req.params.build;
        const results = [];

        pg.connect(connectionString, (err, client, done) => { // eslint-disable-line consistent-return
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            // select stats of build
            const query = client.query("SELECT Attack, Defence, Strength, Hitpoints, " +
              `Ranged, Magic, Prayer FROM builds WHERE (Name = '${buildName}' AND user_id = '${data.user_id}')`);

            query.on("error", (error) => {
                done();
                results.push(error);
                return res.status(500).json(results);
            });

            // stream results back one row at a time
            query.on("row", (row) => {
                results.push(row);
            });

            // after all data is returned, close connection and return results
            query.on("end", () => {
                done();
                if (results.length === 0) return res.status(422).json([{ code: "invalid" }]);
                res.body = results;
                return next();
            });
        });
    },

    getBuildsList: (req, res, next) => {
        const data = req.body;
        const results = [];

        pg.connect(connectionString, (err, client, done) => { // eslint-disable-line consistent-return
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            // select stats of build
            const query = client.query("SELECT Name, Attack, Defence, Strength, Hitpoints, " +
              `Ranged, Magic, Prayer FROM builds WHERE (user_id = '${data.user_id}')`);

            query.on("error", (error) => {
                done();
                results.push(error);
                return res.status(500).json(results);
            });

            // stream results back one row at a time
            query.on("row", (row) => {
                results.push(row);
            });

            // after all data is returned, close connection and return results
            query.on("end", () => {
                done();
                if (results.length === 0) return res.status(422).json([{ code: "invalid" }]);
                res.body = results;
                return next();
            });
        });
    },

    deleteBuild: (req, res, next) => {
        req.body.buildName = req.query.buildName;
        const results = [];

        pg.connect(connectionString, (err, client, done) => { // eslint-disable-line consistent-return
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            const query = client.query("DELETE FROM builds WHERE " +
            `(user_id = '${req.body.user_id}' AND name = '${req.body.buildName}')`);

            query.on("error", (error) => {
                results.push(error);
                return res.status(500).json(results);
            });

            // after all data is returned, close connection and return results
            query.on("end", () => {
                done();
                return next();
            });
        });
    }
};

module.exports = buildController;
