import { connect } from "@/models/dbConfig";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// Ensure the database connection is established
await connect();

export async function PUT(request) {
  try {
    const reqBody = await request.json();
    const { mobileNumber, oldpassword, newpassword } = reqBody;

    // Input validation
    if (!mobileNumber || !oldpassword || !newpassword) {
      return NextResponse.json(
        { error: "mobileNumber,old password and new password are required" },
        { status: 400 }
      );
    }

    console.log("Verifying token for mobileNumber:", mobileNumber);

    // Find the user with the provided mobileNumber, token, and valid token expiry
    const user = await userModel.findOne({ mobileNumber });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid mobile number or old password" },
        { status: 400 }
      );
    }

    // Check if password is correct
    const validPassword = await bcryptjs.compare(
      oldpassword,
      user.passwordHash
    );
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid mobile number or old password" },
        { status: 400 }
      );
    }

    console.log("User found:", user.mobileNumber);

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newpassword, salt);

    // Update user verification status

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
