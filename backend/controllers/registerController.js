const pool = require("../db");
const bcrypt = require("bcrypt");
const { sendOTP, verifyOTP } = require("../utils/otp");

// Input validation function
const validateInput = (data, isOTPVerification = false) => {
  const { name, email, password, gender, phone, dob, address, otp } = data;
  const errors = [];

  if (!isOTPVerification) {
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
  } else {
    // OTP verification validation
    if (!otp || !/^\d{4}$/.test(otp)) {
      errors.push("Valid 4-digit OTP is required");
    }
    if (!phone) {
      errors.push("Phone number is required for OTP verification");
    }
  }

  return errors;
};

// Send OTP to phone number
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || !/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Valid phone number is required'
      });
    }

    const result = await sendOTP(phone);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'OTP sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error || 'Failed to send OTP'
      });
    }
  } catch (error) {
    console.error('Error in sendOTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify OTP and complete registration
exports.verifyAndRegister = async (req, res) => {
  try {
    // First validate the OTP
    const otpValidationErrors = validateInput(req.body, true);
    if (otpValidationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'OTP verification failed',
        errors: otpValidationErrors
      });
    }

    const { otp, phone } = req.body;
    const otpResult = verifyOTP(phone, otp);

    if (!otpResult.success) {
      return res.status(400).json({
        success: false,
        message: 'OTP verification failed',
        error: otpResult.error || 'Invalid OTP'
      });
    }

    // OTP verified, now validate registration data
    const validationErrors = validateInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const { name, email, password, gender, dob, address } = req.body;

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
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, gender, phone, dob, address]
    );

    if (result.rows.length === 0) {
      throw new Error('Failed to create user');
    }

    const newUser = result.rows[0];
    console.log('User registered successfully:', newUser.email);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
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
