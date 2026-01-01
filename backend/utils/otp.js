const speakeasy = require('speakeasy');
const twilio = require('twilio');

// Initialize Twilio client (you'll need to get these from Twilio)
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Store OTPs in memory (in production, use Redis or similar)
const otpStore = new Map();

// Generate and send OTP
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

    // Send OTP via SMS (uncomment when you have Twilio credentials)
    // await twilioClient.messages.create({
    //   body: `Your OTP is: ${otp}. It's valid for 5 minutes.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber
    // });

    // For development, log the OTP to console
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: 'Failed to send OTP' };
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
      return { success: true };
    }

    return { success: false, error: 'Invalid OTP' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: 'Error verifying OTP' };
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};
