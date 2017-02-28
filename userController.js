const pg = require("pg");
const bcrypt = require("bcrypt");

const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/osrs_hub";

const userController = {
    createUser: (req, res, next) => {
        const username = req.body.username;
        const password = bcrypt.hashSync(req.body.password, 10);
        const dateCreated = req.body.dateCreated;
        const rsName = req.body.rsName;
        const results = [];

        pg.connect(connectionString, (err, client, done) => {
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            // SQL Query > Find User
            const query = client.query("INSERT INTO users (username, password, rsName, date_created) " +
              "values ($1, $2, $3, $4) RETURNING id, username, rsName", [username, password, rsName, dateCreated]);

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
                res.body.username = results[0].username;
                results[0].password = req.body.password.length;
                res.body.user = results;
                res.body.user[0].id = null;   // might need to change this
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
            const query = client.query("SELECT hashed_id, username, password, rsName FROM users " +
              `WHERE (username = '${username}')`);

            // stream results back one row at a time
            query.on("row", (row) => {
                console.log("Found user.");
                if (bcrypt.compareSync(password, row.password.toString())) {
                    results.push(row);
                    console.log("Password correct.");
                }
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
                if (results.length > 0) {
                    console.log("Response to be sent: ", results);
                    res.body = {};
                    req.body.hashed = results[0].hashed_id;   // should this be moved for security?
                    req.body.username = results[0].username;
                    results[0].password = password.length;
                    results[0].id = null;
                    results[0].hashed_id = null;
                    res.body.user = results;
                    return next();
                }
                return res.json({ data: "User does not exist." });
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
                req.body.id = null;
                return next();
            });
        });
    },

    modifyUser: (req, res, next) => {
        const type = req.body.type.toLowerCase();
        let value;
        if (type === "password") value = bcrypt.hashSync(req.body.value, 10);
        else value = req.body.value;
        const currentUser = req.body.currentUser;
        const results = [];

        pg.connect(connectionString, (err, client, done) => {
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            // SQL Query > Find User
            const query = client.query(`UPDATE users SET ${type}  = ` +
              `'${value}' WHERE (username = '${currentUser}') ` +
              "RETURNING hashed_id, username, rsName");

            // stream results back one row at a time
            query.on("row", (row) => {
                console.log("Updated user: ", row);
                results.push(row);
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
                if (results.length > 0) {
                    console.log("Response to be sent: ", results);
                    res.body = {};
                    req.body.hashed = results[0].hashed_id;
                    req.body.username = results[0].username;
                    results[0].password = null;
                    if (req.body.type === "password") results[0].password = req.body.value.length;
                    results[0].id = null;
                    results[0].hashed_id = null;
                    res.body.user = results;
                    return next();
                }
                return res.json({ data: "There was a problem." });
            });
        });
    }
};

module.exports = userController;
