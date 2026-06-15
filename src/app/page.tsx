import HomeCollection from "@/components/sections/HomeCollection";
import HomeCraft from "@/components/sections/HomeCraft";
import { getProductBySlug } from "@/lib/wordpress";

export default async function Home() {
  const [black, white] = await Promise.all([
    getProductBySlug("black-dragon"),
    getProductBySlug("white-dragon"),
  ]);

  const collectionImages = {
    "black-dragon": black?.image?.sourceUrl ?? null,
    "white-dragon": white?.image?.sourceUrl ?? null,
  };

  return (
    <>
      <HomeCollection images={collectionImages} showHero />
      <HomeCraft />
    </>
  );
}
