import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validations";
import { getProductBySlug } from "@/lib/wordpress";
import { sendOrderEmail, sendWhatsAppNotification } from "@/lib/notifications";

/* ── WooCommerce REST helpers ────────────────────────────── */

function wcAuthHeader(): string {
  const key    = process.env.WC_CONSUMER_KEY    ?? "";
  const secret = process.env.WC_CONSUMER_SECRET ?? "";
  return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
}

interface WcLineItem {
  product_id: number;
  quantity:   number;
  total?:     string;
}

async function createWooOrder(body: {
  lineItems:  WcLineItem[];
  fullName:   string;
  phone:      string;
  city:       string;
  address:    string;
  orderNote:  string;
}): Promise<{ id: number } | null> {
  const wcUrl = process.env.WC_REST_URL ?? "https://admin.nakamastore.ma/wp-json/wc/v3";
  if (!process.env.WC_CONSUMER_KEY) return null;

  const [firstName, ...rest] = body.fullName.trim().split(" ");
  const lastName = rest.join(" ") || firstName;

  const payload = {
    status:               "on-hold",
    payment_method:       "cod",
    payment_method_title: "Cash on Delivery",
    customer_note:        body.orderNote,
    billing: {
      first_name: firstName,
      last_name:  lastName,
      address_1:  body.address,
      city:       body.city,
      country:    "MA",
      phone:      body.phone,
    },
    line_items: body.lineItems,
  };

  try {
    const res = await fetch(`${wcUrl}/orders`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Authorization": wcAuthHeader() },
      body:    JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("[WC order error]", res.status, await res.text());
      return null;
    }
    return (await res.json()) as { id: number };
  } catch (e) {
    console.error("[WC order fetch error]", e);
    return null;
  }
}

/* ── Route handler ───────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order data.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { fullName, phone, city, address, blackQty, whiteQty, accessories, hasBundle, bundleGiftDatabaseId } = parsed.data;

    console.log("[NEW ORDER]", { fullName, city, blackQty, whiteQty, accessories, hasBundle });

    /* ── Resolve product IDs for katanas ── */
    const lineItems: WcLineItem[] = [];

    if (blackQty > 0) {
      const p = await getProductBySlug("black-dragon");
      if (p?.databaseId) lineItems.push({ product_id: p.databaseId, quantity: blackQty });
    }
    if (whiteQty > 0) {
      const p = await getProductBySlug("white-dragon");
      if (p?.databaseId) lineItems.push({ product_id: p.databaseId, quantity: whiteQty });
    }

    /* ── Accessories ── */
    for (const acc of accessories) {
      if (acc.quantity > 0 && acc.databaseId > 0) {
        lineItems.push({ product_id: acc.databaseId, quantity: acc.quantity });
      }
    }

    /* ── Free gift (Double Display Stand at 0 DH) ── */
    if (hasBundle && bundleGiftDatabaseId && bundleGiftDatabaseId > 0) {
      lineItems.push({ product_id: bundleGiftDatabaseId, quantity: 1, total: "0" });
    }

    const bundleNote = hasBundle
      ? "\n\n⚠️ FREE GIFT: Double Display Stand included because customer ordered Black Dragon + White Dragon."
      : "";

    const orderNote =
      `Website order. Call customer to confirm.\nDelivery: 24H – 48H. Free delivery. Cash on delivery.${bundleNote}`;

    let orderId: number | string = `NK-${Date.now()}`;
    if (lineItems.length) {
      const wcOrder = await createWooOrder({ lineItems, fullName, phone, city, address, orderNote });
      if (wcOrder?.id) orderId = wcOrder.id;
    }

    const notifData = {
      orderId,
      fullName,
      phone,
      city,
      address,
      blackQty,
      whiteQty,
      hasBundle,
      accessories: accessories
        .filter((a) => a.quantity > 0)
        .map((a) => ({ name: a.slug.replace(/-/g, " "), quantity: a.quantity })),
    };

    Promise.all([
      sendOrderEmail(notifData),
      sendWhatsAppNotification(notifData),
    ]).catch((e) => console.error("[Nakama] Notification error:", e));

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order received.",
    });
  } catch (err) {
    console.error("[order route]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
