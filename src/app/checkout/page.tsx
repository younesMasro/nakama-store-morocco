import { getProductBySlug } from "@/lib/wordpress";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; qty?: string }>;
}) {
  const { product, qty } = await searchParams;

  const initialSlug =
    product === "white-dragon" ? "white-dragon"
    : product === "black-dragon" ? "black-dragon"
    : null;

  const initialQty = Math.max(1, Math.min(20, parseInt(qty ?? "1", 10) || 1));

  const [wcBlack, wcWhite] = await Promise.all([
    getProductBySlug("black-dragon"),
    getProductBySlug("white-dragon"),
  ]);

  return (
    <CheckoutClient
      initialSlug={initialSlug}
      initialQty={initialQty}
      wcBlack={wcBlack}
      wcWhite={wcWhite}
    />
  );
}
