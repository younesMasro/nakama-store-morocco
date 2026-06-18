import HomeCollection from "@/components/sections/HomeCollection";
import HomeCraft from "@/components/sections/HomeCraft";
import { getProductBySlug, formatPrice } from "@/lib/wordpress";

export default async function Home() {
  const [black, white] = await Promise.all([
    getProductBySlug("black-dragon"),
    getProductBySlug("white-dragon"),
  ]);

  const collectionImages = {
    "black-dragon": black?.image?.sourceUrl ?? null,
    "white-dragon": white?.image?.sourceUrl ?? null,
  };

  const collectionPrices = {
    "black-dragon": formatPrice(black?.price) ?? null,
    "white-dragon": formatPrice(white?.price) ?? null,
  };

  return (
    <>
      <HomeCollection images={collectionImages} prices={collectionPrices} showHero />
      <HomeCraft />
    </>
  );
}
