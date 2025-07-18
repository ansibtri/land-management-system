const OTP = require('../model/OTPSchema.model'); // path to your OTP model


/**
 * Generates a 6-digit numeric OTP
 */
function generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

async function createOTP(email, userId, landId) {
    const otp = generateOTP();
    const ttlMinutes = 60 * 24; // OTP expires in 24hrs
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    const findLandId = await OTP.findOne({ landId });
    
    if (findLandId) {
        await OTP.deleteOne({ landId });
    }

    const newOTP = new OTP({
        email,
        userId,
        landId,
        otp,
        expiresAt,
    });

    await newOTP.save();
    return otp;
}

module.exports = { createOTP }