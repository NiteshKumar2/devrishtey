import { connect } from "@/models/dbConfig";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Ensure the database connection is established
    await connect();

    // Parse and validate the request body
    const {
      heightlower,
      heighthigh,
      agelower,
      agehigh,
      location,
      maritalStatus, // Add maritalStatus field
      page = 1,
      pageSize = 10,
    } = await request.json();

    // Validate height filters
    if (typeof heightlower !== "number" || typeof heighthigh !== "number") {
      return NextResponse.json(
        {
          message: "Invalid or missing filter fields for height",
          success: false,
        },
        { status: 400 }
      );
    }

    // Validate height range
    if (heightlower > heighthigh) {
      return NextResponse.json(
        {
          message: "Height range is invalid. heightlower must be <= heighthigh",
          success: false,
        },
        { status: 400 }
      );
    }

    // Validate age filters if provided
    if (
      (agelower && typeof agelower !== "number") ||
      (agehigh && typeof agehigh !== "number")
    ) {
      return NextResponse.json(
        { message: "Invalid or missing filter fields for age", success: false },
        { status: 400 }
      );
    }

    // Validate age range
    if (agelower && agehigh && agelower > agehigh) {
      return NextResponse.json(
        {
          message: "Age range is invalid. agelower must be <= agehigh",
          success: false,
        },
        { status: 400 }
      );
    }

    // Validate maritalStatus if provided
    const validStatuses = ["single", "divorced", "widowed"];
    if (maritalStatus && !validStatuses.includes(maritalStatus)) {
      return NextResponse.json(
        { message: "Invalid marital status", success: false },
        { status: 400 }
      );
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;

    // Build the query object
    const query = {
      heightInCm: { $gte: heightlower, $lte: heighthigh },
    };

    // Add age filter to the query if provided
    if (agelower || agehigh) {
      const currentDate = new Date();
      if (agelower) {
        const maxDOB = new Date(
          currentDate.getFullYear() - agelower,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        query.dateOfBirth = { ...query.dateOfBirth, $lte: maxDOB };
      }
      if (agehigh) {
        const minDOB = new Date(
          currentDate.getFullYear() - agehigh,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        query.dateOfBirth = { ...query.dateOfBirth, $gte: minDOB };
      }
    }

    // Add maritalStatus filter to the query if provided
    if (maritalStatus) {
      query.maritalStatus = maritalStatus;
    }

    // Add location filter to the query if provided
    if (location && typeof location === "string") {
      query.currentAddress = { $regex: location, $options: "i" }; // Case-insensitive regex match
    }

    // Query users based on the filter criteria with pagination
    const users = await userModel
      .find(query)
      .skip(skip)
      .limit(pageSize)
      .select(
        "-passwordHash -mobileNumber -isVerified -isAdmin -otpSend -subscriptionStatus -createdAt -updatedAt -verifyToken -verifyTokenExpiry"
      ); // Exclude sensitive fields

    // Handle no users found
    if (users.length === 0) {
      return NextResponse.json(
        { message: "No users found matching the criteria", success: false },
        { status: 404 }
      );
    }

    // Calculate total documents matching the query for pagination
    const total = await userModel.countDocuments(query);

    // Return the retrieved users with pagination info
    return NextResponse.json({
      message: "Users retrieved successfully",
      success: true,
      users,
      pagination: {
        page,
        pageSize,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching users",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
