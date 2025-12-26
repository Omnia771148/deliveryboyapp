import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../../lib/db";
import DeliveryBoyUser from "../../../../../models/DeliveryBoyUser";

export async function POST(req) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    await connectionToDatabase();

    // check if email OR phone already exists
    const userExists = await DeliveryBoyUser.findOne({
      $or: [{ email }, { phone }],
    });
    if (userExists) {
      return NextResponse.json(
        { message: "User with this email or phone already exists" },
        { status: 409 }
      );
    }

    await DeliveryBoyUser.create({
      name,
      email,
      password, // <-- store as plain text
      phone, // <-- store number here
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
