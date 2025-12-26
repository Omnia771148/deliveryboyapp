import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/db";
import AcceptedOrder from "../../../../models/AcceptedOrder";

export async function GET(req) {
  try {
    await connectionToDatabase();

    const deliveryBoyId =
      req.nextUrl.searchParams.get("deliveryBoyId");

    const query = deliveryBoyId
      ? { "items.rejectedBy": { $ne: deliveryBoyId } }
      : {};

    const orders = await AcceptedOrder.find(query);

    return NextResponse.json(orders); // ✅ ALWAYS
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 }); // ✅ STILL JSON
  }
}
