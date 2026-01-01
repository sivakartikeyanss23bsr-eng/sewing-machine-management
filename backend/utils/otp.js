const speakeasy = require('speakeasy');

// Store OTPs in memory (in production, use Redis or similar)
const otpStore = new Map();

// Generate and store OTP
const sendOTP = async (phoneNumber) => {
  try {
    // Generate OTP
    const secret = speakeasy.generateSecret({ length: 4 });
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      step: 300, // 5 minutes validity
      digits: 4
    });

    // Store OTP with phone number
    otpStore.set(phoneNumber, {
      secret: secret.base32,
      otp,
      expiresAt: Date.now() + 300000 // 5 minutes from now
    });

    // For development, log the OTP to console
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    return { 
      success: true, 
      message: 'OTP generated successfully. Check the console for the OTP (in development).' 
    };
  } catch (error) {
    console.error('Error generating OTP:', error);
    return { success: false, error: 'Failed to generate OTP' };
  }
};

// Verify OTP
const verifyOTP = (phoneNumber, userOTP) => {
  try {
    const otpData = otpStore.get(phoneNumber);
    
    if (!otpData) {
      return { success: false, error: 'OTP expired or not requested' };
    }

    // Remove expired OTPs
    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(phoneNumber);
      return { success: false, error: 'OTP has expired' };
    }

    const isValid = speakeasy.totp.verify({
      secret: otpData.secret,
      encoding: 'base32',
      token: userOTP,
      window: 1, // Allow 1 step (30 seconds) before/after current time
      step: 300  // 5 minutes step
    });

    if (isValid) {
      // Clear the OTP after successful verification
      otpStore.delete(phoneNumber);
      return { 
        success: true, 
        message: 'OTP verified successfully' 
      };
    }

    return { 
      success: false, 
      error: 'Invalid OTP. Please check and try again.' 
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { 
      success: false, 
      error: 'An error occurred while verifying OTP' 
    };
  }
};

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [phoneNumber, otpData] of otpStore.entries()) {
    if (now > otpData.expiresAt) {
      otpStore.delete(phoneNumber);
    }
  }
}, 60000); // Run every minute

module.exports = {
  sendOTP,
  verifyOTP
};