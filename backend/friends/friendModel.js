const pg = require("pg");

const connectionString = "postgres://localhost:5432/osrs_hub";
// const connectionString = "postgres://vijuhas:Teslapercocet45@localhost:5432/osrs_hub";

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  "CREATE TABLE friends(CONSTRAINT friends_id PRIMARY KEY (user_id, player_id), " +
  "user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE, " +
  "player_id VARCHAR(12) REFERENCES players(username) ON UPDATE CASCADE)");
query.on("end", () => { client.end(); });
