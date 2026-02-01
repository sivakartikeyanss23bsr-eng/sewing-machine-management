import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { gradients, colors, shadows, borderRadius, spacing } from "../styles/GlobalStyles";

function EnhancedFirstHome() {
  const navigate = useNavigate();
  const [companyInfo, setCompanyInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      .then(res => {
        setCompanyInfo(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching company info:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  const features = [
    {
      icon: "🧵",
      title: "Quality Products",
      description: "Premium sewing machines for all your needs",
      gradient: gradients.primary
    },
    {
      icon: "🔧",
      title: "Expert Service",
      description: "Professional repair and maintenance services",
      gradient: gradients.secondary
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Quick and reliable delivery nationwide",
      gradient: gradients.success
    },
    {
      icon: "💬",
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
      gradient: gradients.warning
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Professional Tailor",
      text: "The best sewing machines I've ever used. Excellent service and support!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Fashion Designer",
      text: "Outstanding quality and reliability. Highly recommend to all professionals.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Hobbyist",
      text: "Perfect for beginners and experts alike. Great customer service!",
      rating: 5
    }
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: gradients.primary
      }}>
        <div style={{
          fontSize: '1.5rem',
          color: colors.white,
          fontWeight: 'bold'
        }}>
          Loading amazing content...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: gradients.primary,
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <section style={{
        padding: `${spacing.xxl} ${spacing.lg}`,
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: spacing.lg,
            animation: 'bounce 2s infinite'
          }}>
            🧵
          </div>
          
          {user ? (
            // Logged-in user content
            <>
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: 'bold',
                margin: `0 0 ${spacing.lg} 0`,
                background: gradients.light,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Welcome back, {user.name}! 👋
              </h1>
              <p style={{
                fontSize: '1.3rem',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: `0 0 ${spacing.xl} 0`,
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                Great to see you again! Ready to explore our premium sewing machines and services?
              </p>
              
              {/* User Profile Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: borderRadius.xl,
                padding: spacing.xl,
                margin: `${spacing.xl} 0`,
                boxShadow: shadows.xl,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                maxWidth: '400px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: spacing.md
                }}>
                  {user.role === 'admin' ? '👑' : '👤'}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: `0 0 ${spacing.sm} 0`,
                  color: colors.white
                }}>
                  {user.name}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: `0 0 ${spacing.sm} 0`
                }}>
                  {user.email}
                </p>
                <div style={{
                  display: 'inline-block',
                  padding: `${spacing.xs} ${spacing.sm}`,
                  background: user.role === 'admin' ? gradients.admin : gradients.user,
                  borderRadius: borderRadius.full,
                  color: colors.white,
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  marginBottom: spacing.lg
                }}>
                  {user.role === 'admin' ? 'Administrator' : 'Member'}
                </div>
                
                {/* Quick Actions for logged-in users */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: spacing.sm,
                  marginTop: spacing.lg
                }}>
                  <button
                    onClick={() => navigate('/home')}
                    style={{
                      padding: spacing.sm,
                      background: gradients.primary,
                      border: 'none',
                      borderRadius: borderRadius.medium,
                      color: colors.white,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🏠 Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    style={{
                      padding: spacing.sm,
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
                    👤 Profile
                  </button>
                  <button
                    onClick={() => navigate('/products')}
                    style={{
                      padding: spacing.sm,
                      background: gradients.secondary,
                      border: 'none',
                      borderRadius: borderRadius.medium,
                      color: colors.white,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🛍️ Products
                  </button>
                  <button
                    onClick={() => navigate('/orders')}
                    style={{
                      padding: spacing.sm,
                      background: gradients.success,
                      border: 'none',
                      borderRadius: borderRadius.medium,
                      color: colors.white,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    📦 Orders
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: spacing.sm,
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
                </div>
              </div>
            </>
          ) : (
            // Logged-out user content
            <>
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: 'bold',
                margin: `0 0 ${spacing.lg} 0`,
                background: gradients.light,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Welcome to Sewing Machine Pro
              </h1>
              <p style={{
                fontSize: '1.3rem',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: `0 0 ${spacing.xl} 0`,
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                Your trusted partner for high-quality sewing machines, professional services, and expert support
              </p>
              
              {/* Call to Action Buttons */}
              <div style={{
                display: 'flex',
                gap: spacing.lg,
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    padding: `${spacing.lg} ${spacing.xl}`,
                    background: gradients.success,
                    border: 'none',
                    borderRadius: borderRadius.large,
                    color: colors.white,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: shadows.xl,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px) scale(1.05)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = shadows.xl;
                  }}
                >
                  � User Login
                </button>
                <button
                  onClick={() => navigate('/admin-login')}
                  style={{
                    padding: `${spacing.lg} ${spacing.xl}`,
                    background: gradients.danger,
                    border: 'none',
                    borderRadius: borderRadius.large,
                    color: colors.white,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: shadows.xl,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px) scale(1.05)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = shadows.xl;
                  }}
                >
                  � Admin Login
                </button>
              </div>
              
              {/* Register Section */}
              <div style={{
                marginTop: spacing.lg,
                textAlign: 'center'
              }}>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: `0 0 ${spacing.md} 0`
                }}>
                  New to our platform?
                </p>
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    padding: `${spacing.md} ${spacing.lg}`,
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: borderRadius.medium,
                    color: colors.white,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  📝 Create New Account
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Company Info Section */}
      {companyInfo && (
        <section style={{
          padding: `${spacing.xxl} ${spacing.lg}`,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: borderRadius.xl,
            padding: spacing.xl,
            boxShadow: shadows.xl,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: `0 0 ${spacing.lg} 0`,
              textAlign: 'center',
              color: colors.white
            }}>
              About {companyInfo.name}
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              margin: `0 0 ${spacing.lg} 0`,
              lineHeight: '1.6'
            }}>
              {companyInfo.description}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: spacing.lg,
              textAlign: 'center'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: spacing.lg,
                borderRadius: borderRadius.large
              }}>
                <div style={{ fontSize: '2rem', marginBottom: spacing.sm }}>📍</div>
                <h3 style={{ color: colors.white, margin: `0 0 ${spacing.sm} 0` }}>Address</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  {companyInfo.address}
                </p>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: spacing.lg,
                borderRadius: borderRadius.large
              }}>
                <div style={{ fontSize: '2rem', marginBottom: spacing.sm }}>📞</div>
                <h3 style={{ color: colors.white, margin: `0 0 ${spacing.sm} 0` }}>Contact</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  {companyInfo.contact}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section style={{
        padding: `${spacing.xxl} ${spacing.lg}`,
        background: 'rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: `0 0 ${spacing.xl} 0`,
            textAlign: 'center',
            color: colors.white
          }}>
            Why Choose Us?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: spacing.xl
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: borderRadius.xl,
                padding: spacing.xl,
                textAlign: 'center',
                boxShadow: shadows.large,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-10px)';
                e.target.style.boxShadow = shadows.xl;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = shadows.large;
              }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: spacing.lg,
                  background: feature.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: `0 0 ${spacing.md} 0`,
                  color: colors.white
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{
        padding: `${spacing.xxl} ${spacing.lg}`,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: `0 0 ${spacing.xl} 0`,
            textAlign: 'center',
            color: colors.white
          }}>
            What Our Customers Say
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: spacing.xl
          }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: borderRadius.xl,
                padding: spacing.xl,
                boxShadow: shadows.large,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: spacing.md
                }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} style={{ fontSize: '1.5rem' }}>⭐</span>
                  ))}
                </div>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontStyle: 'italic',
                  margin: `0 0 ${spacing.lg} 0`,
                  lineHeight: '1.6'
                }}>
                  "{testimonial.text}"
                </p>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: colors.white,
                    marginBottom: spacing.xs
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem'
                  }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={{
        padding: `${spacing.xxl} ${spacing.lg}`,
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: `0 0 ${spacing.lg} 0`,
            color: colors.white
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: `0 0 ${spacing.xl} 0`
          }}>
            Join thousands of satisfied customers who trust us for their sewing needs
          </p>
          <div style={{
            display: 'flex',
            gap: spacing.lg,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: `${spacing.lg} ${spacing.xl}`,
                background: gradients.success,
                border: 'none',
                borderRadius: borderRadius.large,
                color: colors.white,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: shadows.xl,
                transition: 'all 0.3s ease'
              }}
            >
              Login Now
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: `${spacing.lg} ${spacing.xl}`,
                background: gradients.secondary,
                border: 'none',
                borderRadius: borderRadius.large,
                color: colors.white,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: shadows.xl,
                transition: 'all 0.3s ease'
              }}
            >
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EnhancedFirstHome;
