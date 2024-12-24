import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, // First Name of the user
  lastName: { type: String, required: true }, // Last Name of the user
  gender: { type: String, enum: ["male", "female", "other"], required: true }, // Gender
  community: { type: String, required: true }, // Community or caste
  dateOfBirth: { type: Date, required: true }, // Date of birth
  heightInCm: { type: Number, required: true }, // Height in centimeters
  jobTitle: { type: String, required: true }, // Current job or designation
  currentAddress: { type: String, required: true }, // Current living address
  mobileNumber: { type: String, unique: true, required: true }, // Mobile number
  isVerified: { type: Boolean, default: false }, // Mobile/Email verification status
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  passwordHash: { type: String }, // Hashed password
  subscriptionStatus: {
    type: String,
    enum: ["free", "basic", "premium"],
    default: "free",
  }, // Subscription plan/status
  createdAt: { type: Date, default: Date.now }, // Account creation timestamp
  updatedAt: { type: Date, default: Date.now }, // Last update timestamp
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
