import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gradients, colors, shadows, borderRadius, spacing } from '../styles/GlobalStyles';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminNavItems = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin-dashboard?tab=user-management', label: 'Users', icon: '👥' },
    { path: '/admin-dashboard?tab=products', label: 'Products', icon: '🛍️' },
    { path: '/admin-dashboard?tab=orders', label: 'Orders', icon: '📦' },
    { path: '/admin-dashboard?tab=services', label: 'Services', icon: '🔧' },
    { path: '/admin-dashboard?tab=dashboard', label: 'Analytics', icon: '📈' },
    { path: '/admin-dashboard?tab=stock', label: 'Stock', icon: '📋' }
  ];

  const isActive = (path) => {
    if (path.includes('?')) {
      const [basePath, queryParams] = path.split('?');
      return location.pathname === basePath && location.search === '?' + queryParams;
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/admin-login");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: gradients.admin,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Admin Navigation Header */}
      <header style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        padding: `${spacing.lg} 0`,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: `0 ${spacing.lg}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: colors.white,
              cursor: 'pointer'
            }}>
              👑
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: colors.white
              }}>
                Admin Dashboard
              </h1>
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                Sewing Machine Management System
              </p>
            </div>
          </div>

          {/* Admin Navigation */}
          <nav style={{
            display: 'flex',
            gap: spacing.sm,
            alignItems: 'center'
          }}>
            
            
            <div style={{
              width: '1px',
              height: '30px',
              background: 'rgba(255, 255, 255, 0.3)',
              margin: `0 ${spacing.sm}`
            }} />
            
            
            <button
              onClick={handleLogout}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                background: gradients.danger,
                border: 'none',
                borderRadius: borderRadius.medium,
                color: colors.white,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              🚪 Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: spacing.lg
      }}>
        {children}
      </main>

      {/* Admin Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.3)',
        padding: spacing.lg,
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{
          margin: 0,
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.9rem'
        }}>
          © 2024 Sewing Machine Pro - Admin Portal
        </p>
      </footer>
    </div>
  );
};

export default AdminLayout;
