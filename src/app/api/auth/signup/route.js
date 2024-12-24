import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import userModel from "@/models/userModel";
import bcryptjs from "bcryptjs";

await connect(); // Ensure the database connection is established

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
      passwordHash,
    } = reqBody;

    // Input validation
    if (
      !firstName ||
      !lastName ||
      !mobileNumber ||
      !gender ||
      !community ||
      !dateOfBirth ||
      !heightInCm ||
      !jobTitle ||
      !currentAddress ||
      !passwordHash
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const user = await userModel.findOne({ mobileNumber });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(passwordHash, salt);

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

    const savedUser = await newUser.save();
    console.log(savedUser);

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        savedUser,
      },
      { status: 201 }
    ); // Return 201 for successful resource creation
  } catch (error) {
    console.error("Error during user registration:", error); // Log the error for debugging
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
