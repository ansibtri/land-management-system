const {model,Schema} = require('mongoose');

const OTPSchema = new Schema({
    email: { type: String, required: true },
    userId:{type:Schema.Types.ObjectId,required:true},
    landId:{type:Schema.Types.ObjectId, required:true},
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
});

// TTL index: tells MongoDB to auto-delete when expiresAt is reached
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


module.exports = model('OTP', OTPSchema);