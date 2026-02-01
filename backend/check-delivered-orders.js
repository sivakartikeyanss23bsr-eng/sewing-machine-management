const pool = require('./db');

async function checkDeliveredOrders() {
  try {
    console.log('🔍 Checking delivered orders and sold products...');
    
    // Check delivered orders with their items
    const deliveredOrders = await pool.query(`
      SELECT 
        o.order_id,
        o.status,
        o.order_date,
        oi.order_item_id,
        oi.product_id,
        oi.quantity,
        oi.price_at_time,
        oi.total_price,
        p.name as product_name,
        p.stock as current_stock
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.status = 'Delivered'
      ORDER BY o.order_id DESC
    `);
    
    console.log('Delivered Orders with Products:');
    deliveredOrders.rows.forEach(item => {
      console.log('  - Order #' + item.order_id + ' (Delivered)');
      console.log('    Product: ' + item.product_name + ' (ID: ' + item.product_id + ')');
      console.log('    Quantity Sold: ' + item.quantity);
      console.log('    Current Stock: ' + item.current_stock);
      console.log('    Revenue: ' + item.total_price);
      console.log('');
    });
    
    // Calculate total sold per product
    const soldProducts = await pool.query(`
      SELECT 
        p.product_id,
        p.name,
        p.stock as current_stock,
        COALESCE(SUM(oi.quantity), 0) as total_sold,
        COALESCE(SUM(oi.total_price), 0) as total_revenue
      FROM products p
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.order_id AND o.status = 'Delivered'
      GROUP BY p.product_id, p.name, p.stock
      ORDER BY total_sold DESC
    `);
    
    console.log('📊 Products Sold Summary:');
    soldProducts.rows.forEach(product => {
      console.log('  - ' + product.name + ':');
      console.log('    Current Stock: ' + product.current_stock);
      console.log('    Total Sold: ' + product.total_sold);
      console.log('    Total Revenue: ' + product.total_revenue);
      if (product.total_sold > 0) {
        console.log('    ✅ This product has been sold!');
      } else {
        console.log('    ❌ This product has not been sold yet');
      }
      console.log('');
    });
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
}

checkDeliveredOrders();
