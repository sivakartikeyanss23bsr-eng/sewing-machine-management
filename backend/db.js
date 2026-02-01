const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sewing_machine_shop",
  password: "4646",
  port: 5432
});

module.exports = pool;
