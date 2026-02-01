const pool = require('./db');

async function setupDatabase() {
  try {
    // Drop tables if they exist to avoid conflicts
    await pool.query(`DROP TABLE IF EXISTS services CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS orders CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS products CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS users CASCADE`);

    // Create users table
    await pool.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        gender VARCHAR(10),


        
        phone VARCHAR(15),
        dob DATE,
        address TEXT,
        role VARCHAR(20) DEFAULT 'user',
        is_verified BOOLEAN DEFAULT false
      )
    `);

    // Create products table
    await pool.query(`
      CREATE TABLE products (
        product_id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        price NUMERIC,
        category VARCHAR(50),
        stock INT,
        image_url VARCHAR(255),
        description TEXT,
        condition VARCHAR(50)
      )
    `);

    // Create orders table
    await pool.query(`
      CREATE TABLE orders (
        order_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        total NUMERIC,
        status VARCHAR(50)
      )
    `);

    // Create services table
    await pool.query(`
      CREATE TABLE services (
        service_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        issue TEXT,
        status VARCHAR(50)
      )
    `);

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    pool.end();
    process.exit();
  }
}

setupDatabase();
