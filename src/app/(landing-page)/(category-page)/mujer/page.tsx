import { Product } from "@/src/types";
import ProductGrid from "../components/ProductGrid";

export default function WomensPage({ products, onProductClick }: { products: Product[]; onProductClick: (p: Product) => void }) {
  const womensProducts = products.filter(p => p.genre === "WOMENS" || p.genre === "UNISEX");
  
  return (
    <div className="pt-20">
      <div className="relative h-64 bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-2">Mujer</h1>
          <p className="text-xl">Estilo y comodidad en cada paso</p>
        </div>
      </div>

      <ProductGrid 
        products={womensProducts} 
        title="Colección Mujer"
        onProductClick={onProductClick}
      />
    </div>
  );
}