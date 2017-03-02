const pg = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/osrs_hub";
// const SALT_WORK_FACTOR = 10;

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  "CREATE TABLE players(" +
    "username VARCHAR(12) PRIMARY KEY not null unique, " +
    "Overall INTEGER not null, Attack INTEGER not null, " +   // username max length is 12
    "Defence INTEGER not null, Strength INTEGER not null, " +
    "Hitpoints INTEGER not null, Ranged INTEGER not null, " +
    "Magic INTEGER not null, Prayer INTEGER not null, " +
    "Cooking INTEGER not null, Woodcutting INTEGER not null, " +
    "Fletching INTEGER not null, Fishing INTEGER not null, " +
    "Firemaking INTEGER not null, Crafting INTEGER not null, " +
    "Smithing INTEGER not null, Mining INTEGER not null, " +
    "Herblore INTEGER not null, Agility INTEGER not null, " +
    "Thieving INTEGER not null, Slayer INTEGER not null, " +
    "Farming INTEGER not null, Runecraft INTEGER not null, " +
    "Hunter INTEGER not null, Construction INTEGER not null, " +
    "date_created DATE not null)");
query.on("end", () => { client.end(); });

// my problem with this is slower id lookup,
// i'd like to be able to use an integer key
