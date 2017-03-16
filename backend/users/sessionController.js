const pg = require("pg");

const connectionString = process.env.DATABASE_URL;

const sessionController = {
    setCookie: (req, res, next) => {
        res.cookie("nm", res.body.user[0].username, { httpOnly: true });
        return next();
    },

    setSSIDCookie: (req, res, next) => {
        const SSID = req.session.id;
        res.cookie("user", SSID, { httpOnly: true });
        res.body.user[0].sessId = SSID;
        return next();
    },

    startSession: (req, res, next) => {
        req.session.secret = req.body.hashed;
        console.log("Session started for user:", req.session.secret);
        return next();
    },

    isLoggedIn: (req, res, next) => { // eslint-disable-line consistent-return
        if (!req.cookies.user) {
            return res.json(res.body);
        }
        pg.connect(connectionString, (err, client, done) => { // eslint-disable-line consistent-return
            const sessId = req.cookies.user;
            const results = [];

            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ success: false, data: err });
            }
            const query = client.query("SELECT username, rsName FROM users " +
              "WHERE (hashed_id = (SELECT sess ->> 'secret' FROM session " +
              `WHERE sid = '${sessId}'))`);

            // stream results back one row at a time
            query.on("row", (row) => {
                if (row.username === req.cookies.nm) results.push(row);
            });

            query.on("error", (error) => {
                done();
                results.push(error);
                res.json(results);
                return next();
            });

            // after all data is returned, close connection and return results
            query.on("end", () => {
                if (results.length > 0) {
                    done();
                    res.body = {};
                    res.body.user = results;
                    res.body.user[0].password = 8;    // random length b/c you can't decrypt
                    res.body.user[0].sessId = req.cookies.user;
                    return next();
                }
                return res.json({ data: "You need to log in." });
            });
        });
    },

    endSession: (req, res, next) => {
        res.clearCookie("user");
        res.clearCookie("nm");
        req.session.destroy();
        return next();
    }
};

module.exports = sessionController;
