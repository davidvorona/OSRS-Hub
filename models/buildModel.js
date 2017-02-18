const pg = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/osrs_hub";

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  "CREATE TABLE builds(id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), " +
    "Name VARCHAR(40) not null, Attack INTEGER not null, " +
    "Defence INTEGER not null, Strength INTEGER not null, " +
    "Hitpoints INTEGER not null, Ranged INTEGER not null," +
    "Magic INTEGER not null, Prayer INTEGER not null)");
query.on("end", () => { client.end(); });
