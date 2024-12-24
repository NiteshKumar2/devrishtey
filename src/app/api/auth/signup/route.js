import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import userModel from "@/models/userModel";
import bcryptjs from "bcryptjs";

// Ensure the database connection is established
await connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const {
      firstName,
      lastName,
      gender,
      community,
      dateOfBirth,
      heightInCm,
      jobTitle,
      currentAddress,
      mobileNumber,
      password,
    } = reqBody;

    // Input validation
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !community ||
      !dateOfBirth ||
      !heightInCm ||
      !jobTitle ||
      !currentAddress ||
      !mobileNumber ||
      !password
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ mobileNumber });
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this mobile number already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a new user
    const newUser = new userModel({
      firstName,
      lastName,
      gender,
      community,
      dateOfBirth,
      heightInCm,
      jobTitle,
      currentAddress,
      mobileNumber,
      passwordHash: hashedPassword,
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Return success response
    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: {
          id: savedUser._id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          mobileNumber: savedUser.mobileNumber,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
