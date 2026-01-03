import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../../lib/db";
import DeliveryBoyUser from "../../../../../models/DeliveryBoyUser";

export async function GET() {
  try {
    // 1. Ensure connection is fully established
    await connectionToDatabase();

    // 2. Fetch users
    const users = await DeliveryBoyUser.find({});

    // 3. Debugging: Log to your TERMINAL (not browser) to see what DB is sending
    console.log("Users found in DB:", users);

    // 4. Force an empty array if users is null/undefined
    return NextResponse.json(users || []); 
  } catch (err) {
    console.error("Database Error:", err);
    // Returning an object here causes your frontend error "API did not return an array"
    // To keep the frontend happy, you could return [] even on error, 
    // but a 500 status is better for debugging.
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}