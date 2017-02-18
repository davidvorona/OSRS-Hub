const pg = require("pg");
const bcrypt = require("bcrypt");

const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/osrs_hub";

const userController = {
    createUser: (req, res, next) => {
        const username = req.body.username;
        const password = bcrypt.hashSync(req.body.password, 10);
        const dateCreated = req.body.dateCreated;
        const results = [];

        pg.connect(connectionString, (err, client, done) => {
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            // SQL Query > Find User
            const query = client.query("INSERT INTO users (username, password, date_created) " +
              "values ($1, $2, $3) RETURNING id, username", [username, password, dateCreated]);

            query.on("error", (error) => {
                done();
                results.push(error);
                res.json(results);
                return next();
            });

            // stream results back one row at a time
            query.on("row", (row) => {
                results.push(row);
            });

            query.on("end", () => {
                done();
                res.body = {};
                req.body.id = results[0].id;
                res.body.user = results;
                return next();
            });
        });
    },

    authenticateUser: (req, res, next) => {
        const username = req.body.username;
        const password = req.body.password;
        const results = [];

        pg.connect(connectionString, (err, client, done) => {
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            // SQL Query > Find User
            const query = client.query("SELECT id, username, password FROM users " +
              `WHERE (username = '${username}')`);

            // stream results back one row at a time
            query.on("row", (row) => {
                if (bcrypt.compareSync(password, row.password.toString())) results.push(row);
            });

            // after all data is returned, close connection and return results
            query.on("error", (error) => {
                done();
                results.push(error);
                res.json(results);
                return next();
            });

            // after all data is returned, close connection and return results
            query.on("end", () => {
                done();
                res.body = {};
                req.body.id = results[0].id;
                res.body.user = results;
                return next();
            });
        });
    },

    addHash: (req, res, next) => {
        req.body.hashed = bcrypt.hashSync(req.body.id.toString(), 10);

        pg.connect(connectionString, (err, client, done) => {
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            const query = client.query("UPDATE users SET hashed_id " +
              `= '${req.body.hashed}' WHERE (id = '${req.body.id}')`);

            query.on("row", (row) => {
                console.log(row);
            });

            query.on("error", (error) => {
                done();
                console.log(error);
                return next();
            });

            query.on("end", () => {
                done();
                return next();
            });
        });
    }
};

module.exports = userController;
