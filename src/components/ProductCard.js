import api from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const addToCart = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login to add items to cart");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      await api.post("/api/cart/add", {
        product_id: product.product_id,
        quantity: 1
      });
      setMessage("Added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      if (err.response?.status === 401) {
        setMessage("Please login to add items to cart");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(err.response?.data?.message || "Failed to add to cart");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "1rem",
      margin: "1rem",
      maxWidth: "300px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <img 
        src={product.image_url || "https://via.placeholder.com/300x200"} 
        alt={product.name}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "4px",
          marginBottom: "1rem"
        }}
      />
      <h4 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>{product.name}</h4>
      <p style={{ margin: "0 0 0.5rem 0", color: "#666", fontSize: "0.9rem" }}>
        {product.category}
      </p>
      <p style={{ margin: "0 0 0.5rem 0", color: "#28a745", fontWeight: "bold", fontSize: "1.2rem" }}>
        ₹{product.price}
      </p>
      <p style={{ margin: "0 0 1rem 0", color: "#666", fontSize: "0.9rem" }}>
        Stock: {product.stock} units
      </p>
      
      {message && (
        <div style={{
          padding: "0.5rem",
          margin: "0.5rem 0",
          borderRadius: "4px",
          fontSize: "0.9rem",
          backgroundColor: message.includes("success") ? "#d4edda" : "#f8d7da",
          color: message.includes("success") ? "#155724" : "#721c24"
        }}>
          {message}
        </div>
      )}
      
      <button
        onClick={addToCart}
        disabled={isLoading || product.stock === 0}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: isLoading || product.stock === 0 ? "#6c757d" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading || product.stock === 0 ? "not-allowed" : "pointer",
          fontSize: "1rem"
        }}
      >
        {isLoading ? "Adding..." : product.stock === 0 ? "Out of Stock" : 
         localStorage.getItem("token") ? "Add to Cart" : "Login to Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;
