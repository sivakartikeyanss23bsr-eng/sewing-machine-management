const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/register", require("./routes/registerRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/admin-users", require("./routes/adminUserRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
