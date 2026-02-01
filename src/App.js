import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminRoute from "./AdminRoute";
import UserRoute from "./UserRoute";
import Navbar from "./components/Navbar";
import EnhancedNavigation from "./components/EnhancedNavigation";
import EnhancedFooter from "./components/EnhancedFooter";
import { gradients, colors } from "./styles/GlobalStyles";

import Home from "./pages/Home";
import FirstHome from "./pages/FirstHome";
import EnhancedHome from "./pages/EnhancedHome";
import EnhancedFirstHome from "./pages/EnhancedFirstHome";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminLoginPage from "./pages/AdminLoginPage";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Service from "./pages/Service";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";

function App() {
  const [user, setUser] = useState(null);
  const [useEnhancedUI, setUseEnhancedUI] = useState(true);

  useEffect(() => {
    // Check for stored user and UI preference
    const storedUser = localStorage.getItem("user");
    const storedUI = localStorage.getItem("useEnhancedUI");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedUI !== null) {
      setUseEnhancedUI(JSON.parse(storedUI));
    }

    // Apply global styles
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    document.body.style.background = gradients.primary;
    document.body.style.minHeight = '100vh';
    document.body.style.color = '#333';
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const toggleUI = () => {
    const newUI = !useEnhancedUI;
    setUseEnhancedUI(newUI);
    localStorage.setItem("useEnhancedUI", JSON.stringify(newUI));
    document.body.style.background = newUI ? gradients.primary : '#f8f9fa';
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation */}
        {useEnhancedUI ? (
          <EnhancedNavigation user={user} onLogout={handleLogout} />
        ) : (
          <Navbar />
        )}

        {/* UI Toggle Button */}
        <div style={{
          position: 'fixed',
          top: useEnhancedUI ? '80px' : '60px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button
            onClick={toggleUI}
            style={{
              padding: '10px',
              borderRadius: '50%',
              border: 'none',
              background: gradients.secondary,
              color: colors.white,
              cursor: 'pointer',
              fontSize: '1.2rem',
              width: '50px',
              height: '50px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease'
            }}
            title={useEnhancedUI ? 'Switch to Classic UI' : 'Switch to Enhanced UI'}
          >
            {useEnhancedUI ? '🎨' : '✨'}
          </button>
        </div>

        {/* Main Content */}
        <main style={{ 
          flex: 1,
          background: useEnhancedUI ? 'transparent' : '#f8f9fa'
        }}>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={useEnhancedUI ? <EnhancedFirstHome /> : <FirstHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />

            {/* User Protected Routes */}
            <Route path="/home" element={<UserRoute>{useEnhancedUI ? <EnhancedHome /> : <Home />}</UserRoute>} />
            <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
            <Route path="/products" element={<UserRoute><Products /></UserRoute>} />
            <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
            <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
            <Route path="/orders" element={<UserRoute><Orders /></UserRoute>} />
            <Route path="/service" element={<UserRoute><Service /></UserRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          </Routes>
        </main>

        {/* Footer */}
        {useEnhancedUI && <EnhancedFooter />}
      </div>
    </Router>
  );
}

export default App;
