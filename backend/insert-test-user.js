const pool = require('./db');
const bcrypt = require('bcryptjs');

async function insertTestUser() {
  try {
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedUserPassword = await bcrypt.hash('user123', 10);

    // Insert admin user
    await pool.query(`
      INSERT INTO users (name, email, password, role, is_verified)
      VALUES ('Admin User', 'admin@example.com', $1, 'admin', true)
      ON CONFLICT (email) DO NOTHING
    `, [hashedAdminPassword]);

    // Insert customer user
    await pool.query(`
      INSERT INTO users (name, email, password, role, is_verified)
      VALUES ('Customer User', 'customer@example.com', $1, 'user', true)
      ON CONFLICT (email) DO NOTHING
    `, [hashedUserPassword]);

    console.log('Admin and customer users inserted successfully');
  } catch (error) {
    console.error('Error inserting test user:', error);
  } finally {
    pool.end();
  }
}

insertTestUser();
