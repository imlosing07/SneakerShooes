
import { Product } from "@/src/types";
import ProductGrid from "../components/ProductGrid";

export default function FormalPage({ products, onProductClick }: { products: Product[]; onProductClick: (p: Product) => void }) {
  const formalProducts = products.filter(p => p.category === "FORMAL");
  
  return (
    <div className="pt-20">
      {/* Hero elegante para formal */}
      <div className="relative h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
          }} />
        </div>
        <div className="relative text-center text-white space-y-4">
          <h1 className="text-6xl font-serif font-bold tracking-wider">Formal</h1>
          <p className="text-xl text-gray-300">Elegancia y distinción para toda ocasión</p>
          <div className="pt-4">
            <span className="text-sm tracking-widest text-gray-400">COLECCIÓN PREMIUM</span>
          </div>
        </div>
      </div>

      <ProductGrid 
        products={formalProducts} 
        title="Calzado Formal"
        onProductClick={onProductClick}
      />
    </div>
  );
}