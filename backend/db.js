const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sewing_machine_db",
  password: "131105",
  port: 5432
});

module.exports = pool;
