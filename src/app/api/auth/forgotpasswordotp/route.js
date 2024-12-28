import { connect } from "@/models/dbConfig";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

// Ensure the database connection is established
await connect();

export async function PUT(request) {
  try {
    const reqBody = await request.json();
    const { mobileNumber } = reqBody;

    // Input validation
    if (!mobileNumber) {
      return NextResponse.json(
        { error: "mobileNumber are required" },
        { status: 400 }
      );
    }

    console.log("Verifying mobileNumber:", mobileNumber);

    // Find the user with the provided mobileNumber, token, and valid token expiry
    const user = await userModel.findOne({
      mobileNumber, // Ensure token is not expired
    });

    if (!user) {
      console.error(" user not found");
      return NextResponse.json({ error: "Invalid" }, { status: 400 });
    }

    console.log("User found:", user.mobileNumber);

    user.otpSend = "initiateforgot";
    await user.save();

    // Return success response
    return NextResponse.json({
      message: "forgot password request send",
      success: true,
    });
  } catch (error) {
    console.error("Error during forgot password:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
