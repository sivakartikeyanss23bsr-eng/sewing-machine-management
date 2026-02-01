const pool = require('./db');

async function enhanceOrdersTable() {
  try {
    console.log('🔧 Enhancing orders table for tracking...');
    
    // Add new columns for order tracking
    await pool.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(50),
      ADD COLUMN IF NOT EXISTS shipping_address TEXT,
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'COD',
      ADD COLUMN IF NOT EXISTS estimated_delivery DATE
    `);
    
    // Create order_items table for individual product tracking
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        order_item_id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(product_id),
        quantity INTEGER NOT NULL,
        price_at_time NUMERIC NOT NULL,
        total_price NUMERIC NOT NULL
      )
    `);
    
    // Create order_status_history table for tracking timeline
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_status_history (
        history_id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      )
    `);
    
    console.log('✅ Orders table enhanced successfully!');
    
    // Show updated structure
    const result = await pool.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'orders\' ORDER BY ordinal_position');
    console.log('\n📋 Enhanced Orders table structure:');
    result.rows.forEach(col => {
      console.log('  -', col.column_name + ':', col.data_type);
    });
    
    console.log('\n📋 Additional tables created:');
    console.log('  - order_items: Individual product tracking');
    console.log('  - order_status_history: Status timeline tracking');
    
  } catch (error) {
    console.error('❌ Error enhancing orders table:', error);
  } finally {
    pool.end();
  }
}

enhanceOrdersTable();
