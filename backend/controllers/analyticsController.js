const pool = require("../db");

// Get dashboard analytics data
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Only admin can access analytics
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Get product stock data
    const productStock = await pool.query(`
      SELECT product_id, name, stock, price, category
      FROM products 
      ORDER BY stock DESC
    `);

    // Get sales data from order items - ONLY from delivered orders
    const salesData = await pool.query(`
      SELECT 
        oi.product_id,
        p.name,
        p.category,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue,
        AVG(oi.price_at_time) as avg_price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.status = 'Delivered'
      GROUP BY oi.product_id, p.name, p.category
      ORDER BY total_sold DESC
    `);

    // Get stock management by category
    const stockByCategory = await pool.query(`
      SELECT 
        category,
        COUNT(*) as total_models,
        SUM(stock) as total_stock,
        COALESCE(SUM(sold.total_sold), 0) as total_sold
      FROM products p
      LEFT JOIN (
        SELECT 
          oi.product_id,
          SUM(oi.quantity) as total_sold
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.status = 'Delivered'
        GROUP BY oi.product_id
      ) sold ON p.product_id = sold.product_id
      GROUP BY category
      ORDER BY total_stock DESC
    `);

    // Get detailed stock management for each product
    const stockManagement = await pool.query(`
      SELECT 
        p.product_id,
        p.name,
        p.category,
        p.stock as current_stock,
        p.price,
        COALESCE(sold.total_sold, 0) as total_sold,
        COALESCE(sold.total_revenue, 0) as total_revenue,
        CASE 
          WHEN p.stock = 0 THEN 'Out of Stock'
          WHEN p.stock < 5 THEN 'Critical'
          WHEN p.stock < 10 THEN 'Low'
          ELSE 'Good'
        END as stock_status
      FROM products p
      LEFT JOIN (
        SELECT 
          oi.product_id,
          SUM(oi.quantity) as total_sold,
          SUM(oi.total_price) as total_revenue
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.status = 'Delivered'
        GROUP BY oi.product_id
      ) sold ON p.product_id = sold.product_id
      ORDER BY p.category, p.name
    `);

    // Remove duplicates by keeping the entry with sales data if available
    const uniqueStockManagement = [];
    const seenProducts = new Set();
    
    for (const product of stockManagement.rows) {
      const key = product.name + '|' + product.category;
      if (!seenProducts.has(key)) {
        seenProducts.add(key);
        uniqueStockManagement.push(product);
      } else {
        // If this is a duplicate and the current one has sales, replace the existing one
        const existingIndex = uniqueStockManagement.findIndex(p => 
          p.name === product.name && p.category === product.category
        );
        if (existingIndex !== -1 && product.total_sold > uniqueStockManagement[existingIndex].total_sold) {
          uniqueStockManagement[existingIndex] = product;
        }
        // Also sum up the stock for duplicates
        if (existingIndex !== -1) {
          uniqueStockManagement[existingIndex].current_stock += product.current_stock;
        }
      }
    }

    // Get monthly revenue data - ONLY from delivered orders
    const monthlyRevenue = await pool.query(`
      SELECT 
        DATE_TRUNC('month', order_date) as month,
        COUNT(*) as orders_count,
        COALESCE(SUM(total), 0) as revenue
      FROM orders
      WHERE order_date >= NOW() - INTERVAL '12 months'
      AND status = 'Delivered'
      GROUP BY DATE_TRUNC('month', order_date)
      ORDER BY month DESC
    `);

    // Get order status distribution
    const orderStatus = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
      ORDER BY count DESC
    `);

    // Calculate total metrics - ONLY from delivered orders
    const totalMetrics = await pool.query(`
      SELECT 
        COUNT(DISTINCT o.order_id) as total_orders,
        COALESCE(SUM(o.total), 0) as total_revenue,
        COALESCE(AVG(o.total), 0) as avg_order_value,
        COUNT(DISTINCT o.user_id) as total_customers
      FROM orders o
      WHERE o.status = 'Delivered'
    `);

    // Get top selling products - ONLY from delivered orders
    const topProducts = await pool.query(`
      SELECT 
        oi.product_id,
        p.name,
        p.category,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.status = 'Delivered'
      GROUP BY oi.product_id, p.name, p.category
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    // Get low stock products
    const lowStockProducts = await pool.query(`
      SELECT product_id, name, stock, price, category
      FROM products
      WHERE stock < 10
      ORDER BY stock ASC
    `);

    res.json({
      productStock: productStock.rows,
      salesData: salesData.rows,
      stockByCategory: stockByCategory.rows,
      stockManagement: uniqueStockManagement,
      monthlyRevenue: monthlyRevenue.rows,
      orderStatus: orderStatus.rows,
      totalMetrics: totalMetrics.rows[0],
      topProducts: topProducts.rows,
      lowStockProducts: lowStockProducts.rows
    });

  } catch (err) {
    console.error("Error fetching analytics data:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get profit calculation - ONLY from delivered orders
exports.getProfitAnalysis = async (req, res) => {
  try {
    // Only admin can access analytics
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Get profit data - ONLY from delivered orders (assuming cost is 70% of selling price for demo)
    const profitData = await pool.query(`
      SELECT 
        oi.product_id,
        p.name,
        p.category,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue,
        SUM(oi.total_price * 0.7) as total_cost,
        SUM(oi.total_price * 0.3) as total_profit
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.status = 'Delivered'
      GROUP BY oi.product_id, p.name, p.category
      ORDER BY total_profit DESC
    `);

    // Get monthly profit data - ONLY from delivered orders
    const monthlyProfit = await pool.query(`
      SELECT 
        DATE_TRUNC('month', order_date) as month,
        COALESCE(SUM(total), 0) as revenue,
        COALESCE(SUM(total * 0.7), 0) as cost,
        COALESCE(SUM(total * 0.3), 0) as profit
      FROM orders
      WHERE order_date >= NOW() - INTERVAL '12 months'
      AND status = 'Delivered'
      GROUP BY DATE_TRUNC('month', order_date)
      ORDER BY month DESC
    `);

    res.json({
      profitData: profitData.rows,
      monthlyProfit: monthlyProfit.rows
    });

  } catch (err) {
    console.error("Error fetching profit analysis:", err);
    res.status(500).json({ error: err.message });
  }
};
