import { connect } from "@/models/dbConfig";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

// Ensure the database connection is established
await connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { mobileNumber, token } = reqBody;

    // Input validation
    if (!mobileNumber || !token) {
      return NextResponse.json(
        { error: "mobileNumber and token are required" },
        { status: 400 }
      );
    }

    console.log("Verifying token for mobileNumber:", mobileNumber);

    // Find the user with the provided mobileNumber, token, and valid token expiry
    const user = await userModel.findOne({
      mobileNumber,
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      console.error("Invalid token or user not found");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    console.log("User found:", user.mobileNumber);

    // Update user verification status
    user.isVerified = true;
    user.verifyToken = undefined; // Clear the verification token
    user.verifyTokenExpiry = undefined; // Clear the token expiry
    await user.save();

    // Return success response
    return NextResponse.json({
      message: "Mobile number verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error during mobileNumber verification:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
