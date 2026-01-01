CREATE DATABASE sewing_machine_db;

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
);

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  price NUMERIC,
  category VARCHAR(50),
  stock INT,
  image_url VARCHAR(255),
  description TEXT,
  condition VARCHAR(50)
);

CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  total NUMERIC,
  status VARCHAR(50)
);

CREATE TABLE services (
  service_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  issue TEXT,
  status VARCHAR(50)
);
