const pg = require("pg");

const connectionString = "postgres://localhost:5432/osrs_hub";
// const connectionString = "postgres://vijuhas:Teslapercocet45@localhost:5432/osrs_hub";
// const SALT_WORK_FACTOR = 10;

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  "CREATE TABLE users(id SERIAL PRIMARY KEY, hashed_id VARCHAR(60), " +
    "username VARCHAR(40) not null unique, password BYTEA, " +
    "rsName VARCHAR(40), date_created DATE not null)");
query.on("end", () => { client.end(); });
