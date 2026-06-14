import HeroSection from "@/components/sections/HeroSection";
import HomeCollection from "@/components/sections/HomeCollection";
import HomeCraft from "@/components/sections/HomeCraft";
import { getProductBySlug } from "@/lib/wordpress";

export default async function Home() {
  const [black, white] = await Promise.all([
    getProductBySlug("black-dragon"),
    getProductBySlug("white-dragon"),
  ]);

  const heroBlackImageUrl = black?.image?.sourceUrl ?? null;
  const heroWhiteImageUrl = white?.image?.sourceUrl ?? null;
  const collectionImages = {
    "black-dragon": heroBlackImageUrl,
    "white-dragon": heroWhiteImageUrl,
  };

  return (
    <>
      <HeroSection heroImageUrl={heroBlackImageUrl} heroWhiteImageUrl={heroWhiteImageUrl} />
      <HomeCollection images={collectionImages} />
      <HomeCraft />
    </>
  );
}
