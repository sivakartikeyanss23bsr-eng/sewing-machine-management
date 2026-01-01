const pool = require("./db");

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
      ADD COLUMN IF NOT EXISTS phone VARCHAR(15),
      ADD COLUMN IF NOT EXISTS dob DATE,
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
    `);
    await pool.query(`ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';`);
    console.log("Migration completed");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    pool.end();
  }
}

migrate();
