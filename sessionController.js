const pg = require("pg");
const bcrypt = require("bcrypt");

const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/osrs_hub";

const sessionController = {
    setCookie: (req, res, next) => {
        res.cookie("thisType", "someType");
        return next();
    },

    setSSIDCookie: (req, res, next) => {
        const SSID = req.session.id;
        res.cookie("user", SSID, { httpOnly: true });
        return next();
    },

    startSession: (req, res, next) => {
        req.session.secret = req.body.hashed;
        return next();
    },

    isLoggedIn: (req, res, next) => {
        pg.connect(connectionString, (err, client, done) => {
            const hashed = req.cookies.user;
            const results = [];

            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }

            if (req.cookies.user) {
                // SQL Query > Find User
                const query = client.query("SELECT id, username FROM users " +
                  "WHERE (hashed_id = (SELECT sess ->> 'secret' FROM session " +
                  `WHERE sid = '${hashed}'))`);

                // stream results back one row at a time
                query.on("row", (row) => {
                    results.push(row);
                });

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
                    res.body.user = results;
                    return next();
                });
            }
        });
    }
};

module.exports = sessionController;
