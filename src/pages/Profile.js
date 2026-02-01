import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { gradients, colors, shadows, borderRadius, spacing } from "../styles/GlobalStyles";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    address: "" 
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/profile");
      setProfile(res.data);
      setEditData({ 
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "", 
        address: res.data.address || "" 
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
      showMessage("Failed to fetch profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await api.put("/api/profile", editData);
      setProfile({ ...profile, ...editData });
      setIsEditing(false);
      showMessage("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Error updating profile:", err);
      showMessage("Failed to update profile", "error");
    }
  };

  const handleCancel = () => {
    setEditData({ 
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "", 
      address: profile.address || "" 
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        background: gradients.primary
      }}>
        <div style={{
          fontSize: '1.5rem',
          color: colors.white,
          fontWeight: 'bold'
        }}>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: gradients.primary,
      minHeight: '100vh',
      padding: spacing.lg
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        marginBottom: spacing.xl,
        boxShadow: shadows.xl,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center'
      }}>
        <h1 style={{
          margin: `0 0 ${spacing.sm} 0`,
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: gradients.light,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          My Profile
        </h1>
        <p style={{
          margin: 0,
          fontSize: '1.1rem',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          Manage your personal information and account settings
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{
          padding: '12px 16px',
          marginBottom: spacing.lg,
          borderRadius: borderRadius.medium,
          backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
          color: messageType === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        boxShadow: shadows.xl,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* User Avatar and Basic Info */}
        <div style={{
          textAlign: 'center',
          marginBottom: spacing.xl
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: gradients.secondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto ' + spacing.lg,
            fontSize: '4rem',
            boxShadow: shadows.xl
          }}>
            {profile?.role === 'admin' ? '👑' : '👤'}
          </div>
          <h2 style={{
            margin: `0 0 ${spacing.sm} 0`,
            fontSize: '2rem',
            fontWeight: 'bold',
            color: colors.white
          }}>
            {profile?.name}
          </h2>
          <div style={{
            display: 'inline-block',
            padding: `${spacing.xs} ${spacing.md}`,
            background: profile?.role === 'admin' ? gradients.admin : gradients.user,
            borderRadius: borderRadius.full,
            color: colors.white,
            fontSize: '0.9rem',
            fontWeight: 'bold',
            marginBottom: spacing.lg
          }}>
            {profile?.role === 'admin' ? 'Administrator' : 'Member'}
          </div>
        </div>

        {/* Profile Information */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: borderRadius.large,
          padding: spacing.xl,
          marginBottom: spacing.xl
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: colors.white
            }}>
              Personal Information
            </h3>
            {!isEditing && (
              <button
                onClick={handleEdit}
                style={{
                  background: gradients.success,
                  border: 'none',
                  borderRadius: borderRadius.medium,
                  padding: `${spacing.sm} ${spacing.lg}`,
                  color: colors.white,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: shadows.medium,
                  transition: 'all 0.3s ease'
                }}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <div style={{
              display: 'grid',
              gap: spacing.lg
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: spacing.sm,
                  color: colors.white,
                  fontWeight: 'bold'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    borderRadius: borderRadius.medium,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: colors.white,
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: spacing.sm,
                  color: colors.white,
                  fontWeight: 'bold'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    borderRadius: borderRadius.medium,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: colors.white,
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: spacing.sm,
                  color: colors.white,
                  fontWeight: 'bold'
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    borderRadius: borderRadius.medium,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: colors.white,
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: spacing.sm,
                  color: colors.white,
                  fontWeight: 'bold'
                }}>
                  Address
                </label>
                <textarea
                  name="address"
                  value={editData.address}
                  onChange={handleInputChange}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    borderRadius: borderRadius.medium,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: colors.white,
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{
                display: 'flex',
                gap: spacing.md,
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={handleCancel}
                  style={{
                    background: gradients.danger,
                    border: 'none',
                    borderRadius: borderRadius.medium,
                    padding: `${spacing.sm} ${spacing.lg}`,
                    color: colors.white,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    boxShadow: shadows.medium
                  }}
                >
                  ❌ Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    background: gradients.success,
                    border: 'none',
                    borderRadius: borderRadius.medium,
                    padding: `${spacing.sm} ${spacing.lg}`,
                    color: colors.white,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    boxShadow: shadows.medium
                  }}
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: spacing.lg
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md
              }}>
                <span style={{ fontSize: '1.5rem' }}>👤</span>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Full Name</div>
                  <div style={{ color: colors.white, fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {profile?.name || 'Not provided'}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md
              }}>
                <span style={{ fontSize: '1.5rem' }}>📧</span>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Email Address</div>
                  <div style={{ color: colors.white, fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {profile?.email || 'Not provided'}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md
              }}>
                <span style={{ fontSize: '1.5rem' }}>📱</span>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Phone Number</div>
                  <div style={{ color: colors.white, fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {profile?.phone || 'Not provided'}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing.md
              }}>
                <span style={{ fontSize: '1.5rem' }}>📍</span>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Address</div>
                  <div style={{ color: colors.white, fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {profile?.address || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: borderRadius.large,
          padding: spacing.xl
        }}>
          <h3 style={{
            margin: `0 0 ${spacing.lg} 0`,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: colors.white
          }}>
            Account Actions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: spacing.md
          }}>
            <button
              onClick={() => navigate('/orders')}
              style={{
                padding: spacing.md,
                background: gradients.primary,
                border: 'none',
                borderRadius: borderRadius.medium,
                color: colors.white,
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: shadows.medium,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm
              }}
            >
              📦 View Orders
            </button>
            <button
              onClick={() => navigate('/cart')}
              style={{
                padding: spacing.md,
                background: gradients.secondary,
                border: 'none',
                borderRadius: borderRadius.medium,
                color: colors.white,
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: shadows.medium,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm
              }}
            >
              🛒 Shopping Cart
            </button>
            <button
              onClick={() => navigate('/service')}
              style={{
                padding: spacing.md,
                background: gradients.warning,
                border: 'none',
                borderRadius: borderRadius.medium,
                color: colors.white,
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: shadows.medium,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm
              }}
            >
              🔧 Request Service
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: spacing.md,
                background: gradients.danger,
                border: 'none',
                borderRadius: borderRadius.medium,
                color: colors.white,
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: shadows.medium,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div style={{
          textAlign: 'center',
          marginTop: spacing.xl,
          paddingTop: spacing.lg,
          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{
            margin: `0 0 ${spacing.md} 0`,
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem'
          }}>
            Ready to leave? Click the logout button to securely sign out of your account.
          </p>
          <button
            onClick={handleLogout}
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              background: gradients.danger,
              border: 'none',
              borderRadius: borderRadius.large,
              color: colors.white,
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: shadows.large,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = shadows.xl;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = shadows.large;
            }}
          >
            🚪 Logout from Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
