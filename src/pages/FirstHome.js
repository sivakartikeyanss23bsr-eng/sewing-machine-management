import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function FirstHome() {
  const navigate = useNavigate();
  const [companyInfo, setCompanyInfo] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for logged-in user
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    // Fetch company information from the database
    api.get("/api/company")
      .then(res => setCompanyInfo(res.data))
      .catch(err => console.error("Error fetching company info:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to Sewing Machine Company</h1>

      {user ? (
        // Logged-in user content
        <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h2>Welcome back, {user.name}! 👋</h2>
          <div style={{ margin: '1rem 0' }}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> <span style={{ 
              padding: '4px 8px', 
              borderRadius: '4px', 
              backgroundColor: user.role === 'admin' ? '#dc3545' : '#007bff',
              color: 'white',
              fontSize: '0.9rem'
            }}>
              {user.role === 'admin' ? 'Administrator' : 'Member'}
            </span></p>
          </div>
          
          <div style={{ margin: '1rem 0' }}>
            <h3>Quick Actions:</h3>
            <button
              onClick={() => navigate('/home')}
              style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              🏠 Dashboard
            </button>
            <button
              onClick={() => navigate('/profile')}
              style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              👤 Profile
            </button>
            <button
              onClick={() => navigate('/products')}
              style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              🛍️ Products
            </button>
            <button
              onClick={() => navigate('/orders')}
              style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              📦 Orders
            </button>
            <button
              onClick={handleLogout}
              style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      ) : (
        // Logged-out user content
        <div style={{ margin: '2rem 0' }}>
          <h3>Please login or register to continue</h3>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              👤 User Login
            </button>
            <button
              onClick={() => navigate('/admin-login')}
              style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              👑 Admin Login
            </button>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigate('/register')}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              📝 New User? Register Here
            </button>
          </div>
        </div>
      )}

      {companyInfo && (
        <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>About Us</h2>
          <p><strong>Name:</strong> {companyInfo.name}</p>
          <p><strong>Description:</strong> {companyInfo.description}</p>
          <p><strong>Contact:</strong> {companyInfo.contact}</p>
          <p><strong>Address:</strong> {companyInfo.address}</p>
        </div>
      )}
    </div>
  );
}

export default FirstHome;
