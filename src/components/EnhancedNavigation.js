import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gradients, colors, shadows, borderRadius, spacing } from '../styles/GlobalStyles';

const EnhancedNavigation = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/products', label: 'Products', icon: '🛍️' },
    { path: '/cart', label: 'Cart', icon: '🛒' },
    { path: '/orders', label: 'Orders', icon: '📦' },
    { path: '/service', label: 'Service', icon: '🔧' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  const adminNavItems = [
    { path: '/admin-dashboard', label: 'Admin Dashboard', icon: '👑' }
  ];

  return (
    <nav style={{
      background: gradients.dark,
      boxShadow: shadows.large,
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      background: 'rgba(44, 62, 80, 0.95)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: spacing.sm,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <div 
          onClick={() => navigate('/')}
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: colors.white,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm
          }}
        >
          <span style={{ fontSize: '2rem' }}>🧵</span>
          <span style={{
            background: gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Sewing Machine Pro
          </span>
        </div>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          gap: spacing.sm,
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                border: 'none',
                borderRadius: borderRadius.medium,
                background: isActive(item.path) ? gradients.primary : 'transparent',
                color: colors.white,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                boxShadow: isActive(item.path) ? shadows.medium : 'none',
                transform: isActive(item.path) ? 'translateY(-2px)' : 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          {/* Admin Links */}
          {user?.role === 'admin' && adminNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                border: `2px solid ${colors.accent}`,
                borderRadius: borderRadius.medium,
                background: isActive(item.path) ? gradients.admin : 'transparent',
                color: colors.white,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                boxShadow: isActive(item.path) ? shadows.glow : 'none',
                transform: isActive(item.path) ? 'translateY(-2px)' : 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.background = gradients.admin;
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = shadows.glow;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Actions */}
        <div style={{
          display: 'flex',
          gap: spacing.sm,
          alignItems: 'center'
        }}>
          {user ? (
            <>
              <div style={{
                color: colors.white,
                fontSize: '0.9rem',
                fontWeight: '500',
                padding: `${spacing.xs} ${spacing.sm}`,
                borderRadius: borderRadius.medium,
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs
              }}>
                <span style={{ fontSize: '1.2rem' }}>
                  {user.role === 'admin' ? '👑' : '👤'}
                </span>
                <span>{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  border: 'none',
                  borderRadius: borderRadius.medium,
                  background: gradients.danger,
                  color: colors.white,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: shadows.small
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = shadows.medium;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = shadows.small;
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  border: 'none',
                  borderRadius: borderRadius.medium,
                  background: gradients.success,
                  color: colors.white,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: shadows.small
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = shadows.medium;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = shadows.small;
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  border: 'none',
                  borderRadius: borderRadius.medium,
                  background: gradients.secondary,
                  color: colors.white,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: shadows.small
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = shadows.medium;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = shadows.small;
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default EnhancedNavigation;
