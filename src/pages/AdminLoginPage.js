import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { gradients, colors, shadows, borderRadius, spacing } from "../styles/GlobalStyles";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      // Check if user has admin role
      if (res.data.role !== "admin") {
        setError("Access denied. Admin privileges required.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user", JSON.stringify({
        name: "Admin User",
        email: email,
        role: res.data.role
      }));
      
      console.log("Admin login successful, navigating to dashboard");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid admin credentials");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToUserLogin = () => {
    navigate("/login");
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
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
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
                Admin Portal
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

          {/* Admin Navigation Buttons */}
          <div style={{
            display: 'flex',
            gap: spacing.sm
          }}>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: borderRadius.medium,
                color: colors.white,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              🏠 Back to Site
            </button>
            <button
              onClick={goToUserLogin}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                background: gradients.user,
                border: 'none',
                borderRadius: borderRadius.medium,
                color: colors.white,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              👤 User Login
            </button>
          </div>
        </div>
      </header>

      {/* Login Form Container */}
      <main style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: borderRadius.xl,
          padding: spacing.xl,
          boxShadow: shadows.xl,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: '100%',
          maxWidth: '400px'
        }}>
          {/* Login Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: spacing.xl
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: spacing.md,
              animation: 'bounce 2s infinite'
            }}>
              🔐
            </div>
            <h2 style={{
              margin: `0 0 ${spacing.sm} 0`,
              fontSize: '2rem',
              fontWeight: 'bold',
              color: colors.white
            }}>
              Admin Login
            </h2>
            <p style={{
              margin: 0,
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              Enter your administrator credentials
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: spacing.md,
              marginBottom: spacing.lg,
              borderRadius: borderRadius.medium,
              backgroundColor: 'rgba(220, 53, 69, 0.2)',
              border: '1px solid rgba(220, 53, 69, 0.5)',
              color: '#ff6b6b',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={login} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.lg
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: spacing.sm,
                color: colors.white,
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: spacing.md,
                  borderRadius: borderRadius.medium,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: colors.white,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.white;
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: spacing.sm,
                color: colors.white,
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: spacing.md,
                  borderRadius: borderRadius.medium,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: colors.white,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.white;
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: spacing.lg,
                background: isSubmitting ? 'rgba(255, 255, 255, 0.3)' : gradients.success,
                border: 'none',
                borderRadius: borderRadius.medium,
                color: colors.white,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: shadows.medium
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = shadows.large;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = shadows.medium;
                }
              }}
            >
              {isSubmitting ? '🔄 Signing in...' : '🔐 Sign In to Admin Panel'}
            </button>
          </form>

          {/* Footer Links */}
          <div style={{
            marginTop: spacing.xl,
            paddingTop: spacing.lg,
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              marginBottom: spacing.md
            }}>
              <button
                onClick={goToUserLogin}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: borderRadius.medium,
                  color: colors.white,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                👤 Switch to User Login
              </button>
            </div>
            <p style={{
              margin: 0,
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              Default Admin: admin@example.com / admin123
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
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
}

export default AdminLoginPage;
