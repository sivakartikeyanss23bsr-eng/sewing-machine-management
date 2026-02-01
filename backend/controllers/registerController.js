const pool = require("../db");
const bcrypt = require("bcrypt");

// Input validation function
const validateInput = (data) => {
  const { name, email, password, gender, phone, dob, address } = data;
  const errors = [];

  // Registration form validation
  if (!name) errors.push("Name is required");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Valid email is required");
  }
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  if (!['Male', 'Female', 'Other'].includes(gender)) {
    errors.push("Valid gender is required");
  }
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    errors.push("Valid phone number is required");
  }
  if (!dob) errors.push("Date of birth is required");
  if (!address || address.length < 10) {
    errors.push("Address is required and should be at least 10 characters");
  }

  return errors;
};

// Register user
exports.register = async (req, res) => {
  try {
    // Validate registration data
    const validationErrors = validateInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const { name, email, password, gender, phone, dob, address } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Registration failed',
        error: 'Email or phone number already in use'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users 
       (name, email, password, gender, phone, dob, address, role, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'user', true)
       RETURNING user_id, name, email, role`,
      [name, email, hashedPassword, gender, phone, dob, address]
    );

    if (result.rows.length === 0) {
      throw new Error('Failed to create user');
    }

    const newUser = result.rows[0];
    console.log('User registered successfully:', newUser.email);

    res.status(201).json({
      success: true,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific error cases
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({
        success: false,
        message: 'Registration failed',
        error: 'Email already in use'
      });
    }

    // Handle database errors
    if (error.code && error.code.startsWith('22') || // Data exception
        error.code && error.code.startsWith('23')) { // Integrity constraint violation
      return res.status(400).json({
        success: false,
        message: 'Invalid data provided',
        error: error.message
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'Registration failed due to server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};


