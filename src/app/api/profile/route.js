import { NextResponse } from "next/server";
import { connect } from "@/models/dbConfig";
import profileModel from "@/models/profileModel";

export async function POST(request) {
  try {
    // Ensure database connection
    await connect();

    const reqBody = await request.json();
    const {
      userId,
      relationLookingFor,
      birthTime,
      education,
      annualSalary,
      partnerPreferences,
      maritalStatus,
      fatherName,
      fatherOccupation,
      avoidGotra,
      birthAddress,
      profileImage,
      dietaryPreference,
      siblings,
      hobbies,
      propertyDetails,
      whatsappNumber,
      livingWithFamily,
      bloodGroup,
      bio,
    } = reqBody;

    // Input validation
    if (!userId ) {
      return NextResponse.json(
        { success: false, error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await profileModel.findOne({ userId });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "A user with this ID already exists" },
        { status: 400 }
      );
    }

    // Create a new user
    const newUser = new profileModel({
      userId,
      relationLookingFor,
      birthTime,
      education,
      annualSalary,
      partnerPreferences,
      maritalStatus,
      fatherName,
      fatherOccupation,
      avoidGotra,
      birthAddress,
      profileImage,
      dietaryPreference,
      siblings,
      hobbies,
      propertyDetails,
      whatsappNumber,
      livingWithFamily,
      bloodGroup,
      bio,
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          id: savedUser._id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Ensure database connection
    await connect();

    const reqBody = await request.json();
    const {
      userId,
      relationLookingFor,
      birthTime,
      education,
      annualSalary,
      partnerPreferences,
      maritalStatus,
      fatherName,
      fatherOccupation,
      avoidGotra,
      birthAddress,
      profileImage,
      dietaryPreference,
      siblings,
      hobbies,
      propertyDetails,
      whatsappNumber,
      livingWithFamily,
      bloodGroup,
      bio,
    } = reqBody;

    // Find the user profile by userId and update
    const updatedUser = await profileModel.findOneAndUpdate(
      { userId }, // Find user by userId
      {
        relationLookingFor,
        birthTime,
        education,
        annualSalary,
        partnerPreferences,
        maritalStatus,
        fatherName,
        fatherOccupation,
        avoidGotra,
        birthAddress,
        profileImage,
        dietaryPreference,
        siblings,
        hobbies,
        propertyDetails,
        whatsappNumber,
        livingWithFamily,
        bloodGroup,
        bio,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during user update:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

  

