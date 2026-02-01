import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import DashboardCharts from "../components/DashboardCharts";
import StockManagement from "../components/StockManagement";
import ServiceCharts from "../components/ServiceCharts";
import UserManagement from "../components/UserManagement";
import AdminLayout from "../components/AdminLayout";

function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(true);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    image_url: '',
    description: '',
    condition: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [servicesRes, usersRes, ordersRes, productsRes, analyticsRes] = await Promise.all([
        api.get("/api/services"),
        api.get("/api/users"),
        api.get("/api/orders"),
        api.get("/api/products"),
        api.get("/api/analytics/dashboard")
      ]);

      setServices(servicesRes.data || []);
      setUsers(usersRes.data || []);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
      setAnalyticsData(analyticsRes.data);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post("/api/products", newProduct);
      
      // Refresh products list
      const productsRes = await api.get("/api/products");
      setProducts(productsRes.data);
      
      // Reset form and hide form
      setNewProduct({
        name: '',
        price: '',
        category: '',
        stock: '',
        image_url: '',
        description: '',
        condition: ''
      });
      setShowAddProductForm(false);
      
      console.log("Product added successfully:", response.data);
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddProductForm(true);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image_url: product.image_url,
      description: product.description,
      condition: product.condition
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.put(`/api/products/${editingProduct.product_id}`, newProduct);
      
      // Refresh products list
      const productsRes = await api.get("/api/products");
      setProducts(productsRes.data);
      
      // Reset form and hide form
      setEditingProduct(null);
      setNewProduct({
        name: '',
        price: '',
        category: '',
        stock: '',
        image_url: '',
        description: '',
        condition: ''
      });
      setShowAddProductForm(false);
      
      console.log("Product updated successfully:", response.data);
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/api/products/${productId}`);
      
      // Refresh products list
      const productsRes = await api.get("/api/products");
      setProducts(productsRes.data);
      
      console.log("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  const updateServiceStatus = async (serviceId, newStatus) => {
    try {
      await api.put(`/api/services/${serviceId}`, { status: newStatus });
      
      // Update the local state to reflect the change
      setServices(prevServices => 
        prevServices.map(service => 
          service.service_id === serviceId 
            ? { ...service, status: newStatus }
            : service
        )
      );
      
      console.log(`Service ${serviceId} status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating service status:", err);
      alert("Failed to update service status");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}`, { status: newStatus });
      
      // Update the local state to reflect the change
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.order_id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        {/* Navigation Tabs */}
        <div style={{ borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
          {['dashboard', 'stock', 'service-analytics', 'user-management', 'services', 'orders', 'products'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: activeTab === tab ? '#007bff' : 'transparent',
                color: activeTab === tab ? 'white' : 'black',
                cursor: 'pointer',
                marginRight: '5px',
                borderRadius: '4px 4px 0 0'
              }}
            >
              {tab === 'service-analytics' ? 'Service Analytics' : 
               tab === 'stock' ? 'Stock Management' : 
               tab === 'user-management' ? 'User Management' : 
               tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <DashboardCharts analyticsData={analyticsData} />
      )}
      
      {activeTab === 'stock' && (
        <StockManagement analyticsData={analyticsData} />
      )}
      
      {activeTab === 'service-analytics' && (
        <ServiceCharts services={services} />
      )}
      
      {activeTab === 'user-management' && (
        <UserManagement />
      )}
      {activeTab === 'services' && (
        <div>
          <h3>Service Requests ({services.length})</h3>
          {services.length === 0 ? (
            <p>No service requests found</p>
          ) : (
            services.map(service => (
              <div key={service.service_id} style={{ 
                border: "1px solid #ccc", 
                margin: "10px", 
                padding: "15px", 
                borderRadius: "4px",
                backgroundColor: "#f9f9f9"
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Service Request #{service.service_id}</h4>
                    
                    {/* User Information */}
                    <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                      <h5 style={{ margin: '0 0 8px 0', color: '#495057' }}>Customer Information</h5>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Name:</strong> {service.name || 'N/A'}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Email:</strong> {service.email || 'N/A'}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Phone:</strong> {service.phone || 'N/A'}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Address:</strong> {service.address || 'N/A'}
                      </p>
                    </div>
                    
                    {/* Service Issue */}
                    <div style={{ marginBottom: '15px' }}>
                      <h5 style={{ margin: '0 0 8px 0', color: '#495057' }}>Issue Description</h5>
                      <p style={{ margin: '4px 0', fontSize: '14px', lineHeight: '1.4' }}>
                        {service.issue}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Management */}
                  <div style={{ marginLeft: '20px', minWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                      Status:
                    </label>
                    <select
                      value={service.status}
                      onChange={(e) => updateServiceStatus(service.service_id, e.target.value)}
                      style={{
                        padding: '6px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        width: '100%',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                    </select>
                    
                    <div style={{
                      marginTop: '10px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      backgroundColor: service.status === 'Pending' ? '#ffc107' : 
                                       service.status === 'Processing' ? '#17a2b8' : '#28a745',
                      color: 'white'
                    }}>
                      {service.status}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h3>Orders ({orders.length})</h3>
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            orders.map(order => (
              <div key={order.order_id} style={{ 
                border: "1px solid #ccc", 
                margin: "10px", 
                padding: "15px", 
                borderRadius: "4px",
                backgroundColor: "#f9f9f9"
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Order #{order.order_id}</h4>
                    
                    {/* Customer Information */}
                    <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                      <h5 style={{ margin: '0 0 8px 0', color: '#495057' }}>Customer Information</h5>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Name:</strong> {order.name || 'N/A'}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Email:</strong> {order.email || 'N/A'}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Phone:</strong> {order.phone || 'N/A'}
                      </p>
                    </div>
                    
                    {/* Order Details */}
                    <div style={{ marginBottom: '15px' }}>
                      <h5 style={{ margin: '0 0 8px 0', color: '#495057' }}>Order Details</h5>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Total Amount:</strong> ₹{order.total}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Tracking Number:</strong> {order.tracking_number || 'N/A'}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Order Date:</strong> {order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}
                      </p>
                      {order.shipping_address && (
                        <p style={{ margin: '4px 0', fontSize: '14px' }}>
                          <strong>Shipping Address:</strong> {order.shipping_address}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Management */}
                  <div style={{ marginLeft: '20px', minWidth: '180px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                      Status:
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                      style={{
                        padding: '6px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        width: '100%',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Order Confirmed">Order Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    
                    <div style={{
                      marginTop: '10px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      backgroundColor: order.status === 'Order Confirmed' ? '#28a745' : 
                                       order.status === 'Processing' ? '#007bff' :
                                       order.status === 'Shipped' ? '#17a2b8' :
                                       order.status === 'Delivered' ? '#28a745' : '#dc3545',
                      color: 'white'
                    }}>
                      {order.status}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Products ({products.length})</h3>
            <button
              onClick={() => setShowAddProductForm(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              + Add New Product
            </button>
          </div>

          {/* Add Product Form */}
          {showAddProductForm && (
            <div style={{
              backgroundColor: '#e9ecef',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Add New Product</h4>
              <form onSubmit={handleAddProduct}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    required
                    min="0"
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="url"
                    placeholder="Image URL (optional)"
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <select
                    value={newProduct.condition}
                    onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value })}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="">Select Condition</option>
                    <option value="New">New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
                <textarea
                  placeholder="Product Description (optional)"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginTop: '1rem',
                    resize: 'vertical'
                  }}
                />
                <div style={{ marginTop: '1rem' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      marginRight: '0.5rem'
                    }}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProductForm(false);
                      setNewProduct({
                        name: '',
                        price: '',
                        category: '',
                        stock: '',
                        image_url: '',
                        description: '',
                        condition: ''
                      });
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {products.map(product => (
                <div key={product.product_id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <img
                      src={product.image_url || "https://via.placeholder.com/300x200"}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{product.name}</h4>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                      {product.category}
                    </p>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                      Condition: {product.condition || 'N/A'}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ margin: '0', color: '#28a745', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      ₹{product.price}
                    </p>
                    <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                      Stock: {product.stock} units
                    </p>
                  </div>

                  {product.description && (
                    <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
                      {product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.product_id)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
