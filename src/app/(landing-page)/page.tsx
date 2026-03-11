import HeroSection from "./components/Hero";
import BrandsCarousel from "./components/BrandsCarousel";
import FeaturedShowcase from "./components/FeaturedShowcase";
import { getProducts } from "@/src/services/product";

export default async function HomePage() {
  // Fetch destacados + nuevos para la sección principal
  const response = await getProducts({ limit: 12, featured: true });
  const products = response.products;

  return (
    <>
      <HeroSection />
      <BrandsCarousel />
      <FeaturedShowcase products={products} />
    </>
  );
}