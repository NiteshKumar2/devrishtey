import { connect } from "@/models/dbConfig";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

// Ensure the database connection is established
await connect();

// Handle GET requests
export async function GET(request) {
  try {
    // Fetch users with `otpSend` field set (filter logic might need adjustments based on your use case)
    const users = await userModel.find({ otpSend: { $exists: true } });

    if (!users || users.length === 0) {
      console.error("No users found with otpSend");
      return NextResponse.json(
        { error: "No users found", success: false },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: "Admin verified users retrieved successfully",
      users,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error", success: false },
      { status: 500 }
    );
  }
}

// Handle PUT requests
export async function PUT(request) {
  try {
    const reqBody = await request.json();
    const { mobileNumber, token, otpSend } = reqBody;

    // Input validation
    if (!mobileNumber || !token || !otpSend) {
      return NextResponse.json(
        {
          error: "mobileNumber, otpSend, and token are required",
          success: false,
        },
        { status: 400 }
      );
    }

    console.log(`Processing ${otpSend} for mobileNumber:`, mobileNumber);

    // Determine the update fields based on otpSend value
    let updateFields = {};
    if (otpSend === "processverify") {
      updateFields = {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
        otpSend,
      };
    } else if (otpSend === "processforgot") {
      updateFields = {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour expiry
        otpSend,
      };
    } else {
      return NextResponse.json(
        { error: "Invalid otpSend value", success: false },
        { status: 400 }
      );
    }

    // Update the user by mobileNumber
    const user = await userModel.findOneAndUpdate(
      { mobileNumber }, // Query by mobileNumber
      updateFields, // Fields to update
      { new: true } // Return the updated document
    );

    if (!user) {
      console.error("User not found for mobileNumber:", mobileNumber);
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    console.log("Token saved successfully for user:", user.mobileNumber);

    // Return success response
    return NextResponse.json({
      message: "Token saved successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error saving token:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error", success: false },
      { status: 500 }
    );
  }
}
