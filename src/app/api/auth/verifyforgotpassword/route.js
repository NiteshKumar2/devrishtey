import { connect } from "@/models/dbConfig";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// Ensure the database connection is established
await connect();

export async function PUT(request) {
  try {
    const reqBody = await request.json();
    const { mobileNumber, token, password } = reqBody;

    // Input validation
    if (!mobileNumber || !token || !password) {
      return NextResponse.json(
        { error: "mobileNumber, password and token are required" },
        { status: 400 }
      );
    }

    console.log("Verifying token for mobileNumber:", mobileNumber);

    // Find the user with the provided mobileNumber, token, and valid token expiry
    const user = await userModel.findOne({
      mobileNumber,
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      console.error("Invalid token or user not found");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    console.log("User found:", user.mobileNumber);

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Update user verification status
    user.isVerified = true;
    user.forgotPasswordToken = undefined; // Clear the verification token
    user.forgotPasswordTokenExpiry = undefined; // Clear the token expiry
    user.otpSend = undefined;
    user.passwordHash = hashedPassword;
    await user.save();

    // Return success response
    return NextResponse.json({
      message: "password reset successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
