import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../../lib/db";
import DeliveryBoyUser from "../../../../../models/DeliveryBoyUser";

export async function POST(req) {
  try {
    // 1. ADD THE URL FIELDS TO DESTRUCTURING
    const { name, email, password, phone, aadharUrl, rcUrl, licenseUrl } = await req.json();

    // 2. CHECK ALL REQUIRED FIELDS (Optional: decide if URLs are required for signup)
    if (!name || !email || !password || !phone || !aadharUrl || !rcUrl || !licenseUrl) {
      return NextResponse.json(
        { message: "All fields and documents are required" },
        { status: 400 }
      );
    }

    await connectionToDatabase();

    const userExists = await DeliveryBoyUser.findOne({
      $or: [{ email }, { phone }],
    });

    if (userExists) {
      return NextResponse.json(
        { message: "User with this email or phone already exists" },
        { status: 409 }
      );
    }

    // 3. PASS THE URLS INTO THE CREATE FUNCTION
    await DeliveryBoyUser.create({
      name,
      email,
      password, 
      phone,
      aadharUrl,  // <-- Add this
      rcUrl,      // <-- Add this
      licenseUrl, // <-- Add this
    });

    return NextResponse.json(
      { message: "Signup successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}