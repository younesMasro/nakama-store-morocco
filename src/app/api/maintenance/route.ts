import { NextRequest, NextResponse } from "next/server";

const PASSWORD = process.env.PREVIEW_PASSWORD ?? "NAKAMA@@store@123Ad";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password === PASSWORD) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("nakama-preview", "granted", {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      maxAge:   60 * 60 * 24 * 7, // 7 days
      path:     "/",
    });
    return res;
  }

  return NextResponse.json({ error: "Wrong password" }, { status: 401 });
}
