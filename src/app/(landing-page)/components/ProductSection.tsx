// ============================================
// PRODUCTS SECTION (Grid limpio sin colores)

import { Product } from "@/src/types";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      const dataProducts = data.data.products;
      setProducts(dataProducts);
    };
    fetchProducts();
  }, []);

  return (
    <section className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Colección Premium</h2>
        <a href="#todos" className="text-sm font-medium hover:underline">
          Ver todo →
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer"
          >
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
              {product.isNew && (
                <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  {"Nuevo"}
                </span>
              )}
              {product.featured && (
                <span className="absolute top-3 right-3 bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  {"Destacado"}
                </span>
              )}

              <Image
                src={product.images[0]?.standardUrl || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-contain"
              />
              <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-xl">♡</span>
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand?.name}</p>
              <h3 className="font-medium text-sm group-hover:underline">{product.name}</h3>
              <p className="font-bold">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
}