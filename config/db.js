const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "film_bot",
  password: "run",
  port: 5432,
});

module.exports = pool;