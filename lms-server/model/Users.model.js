const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    firstname: {type: String, required: true, minlength: 3, },// Use minlength instead of minmaxlength: 20, // Use maxlength instead of max},
      lastname: { type: String, required: true, minlength: 3, maxlength: 20, },
      photo: { type: String },
      citizenshipDoc: { type: String, default: "", },
      grandFatherName: { type: String, require: true, },
      fatherName: { type: String, require: true },
      email: { type: String, required: true, maxlength: 50, unique: true, },
      password: { type: String, required: true, minlength: 6, },
      citizenshipNo: { type: String, required: true, },
      isVerified: { type: Boolean, default: false, },
      role: { type: String, default: "user" },
    },
  { timestamps: true }

);

module.exports = model("Users", UserSchema); // Changed model name to "User"

