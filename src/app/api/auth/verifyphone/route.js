import { connect } from "@/models/dbConfig";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

await connect(); // Ensure the database connection is established

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

        console.log("Verifying token for mobileNumber:",mobileNumber);

        // Find the user with the provided email, token, and token expiry
        const user = await userModel.findOne({
            mobileNumber,
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            console.log("Invalid token or user not found");
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 400 }
            );
        }

        console.log("User found:", user);

        // Update user verification status
        user.isVerified = true; // Ensure correct spelling
        user.verifyToken = undefined; // Clear the verification token
        user.verifyTokenExpiry = undefined; // Clear the token expiry
        await user.save();

        return NextResponse.json({
            message: "mobileNumber verified successfully",
            success: true
        });

    } catch (error) {
        console.error("Error during mobileNumber verification:", error); // Log the error for debugging
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
