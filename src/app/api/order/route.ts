import { NextRequest, NextResponse } from "next/server";
import { orderSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order data.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const order = parsed.data;

    // Log order server-side (replace with email/DB integration later)
    console.log("[NEW ORDER]", JSON.stringify(order, null, 2));

    return NextResponse.json({ success: true, message: "Order received." });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
