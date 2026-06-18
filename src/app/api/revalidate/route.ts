import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs";

const SECRET = process.env.REVALIDATE_SECRET ?? "dc88e069699082941a341b22b53df19b1918868d158e4a39";

function deleteDiskCache() {
  try {
    const file = path.join(process.cwd(), ".nakama-cache", "products.json");
    if (fs.existsSync(file)) fs.unlinkSync(file);
  } catch {
    // non-fatal
  }
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!SECRET || secret !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  deleteDiskCache();

  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true });
}
