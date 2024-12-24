import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { connect } from "@/models/dbConfig";
import userModel from "@/models/userModel";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { mobileNumber, password } = reqBody;

        // Input validation
        if (!mobileNumber || !password) {
            return NextResponse.json(
                { error: "Mobile number and password are required" },
                { status: 400 }
            );
        }

        // Connect to the database
        await connect();

        // Check if user exists
        const user = await userModel.findOne({ mobileNumber });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid mobile number or password" },
                { status: 400 }
            );
        }

        // Check if password is correct
        const validPassword = await bcryptjs.compare(password, user.passwordHash);
        if (!validPassword) {
            return NextResponse.json(
                { error: "Invalid mobile number or password" },
                { status: 400 }
            );
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user._id, mobileNumber: user.mobileNumber },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Send response
        return NextResponse.json({
            message: "Login successful",
            success: true,
            token, // In production, consider storing the token in an HttpOnly cookie
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
