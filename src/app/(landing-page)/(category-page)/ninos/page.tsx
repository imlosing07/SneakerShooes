import { Product } from "@/src/types";

export default function KidsPage({ onProductClick }: { onProductClick: (p: Product) => void }) {
  return (
    <div className="pt-20">
      <div className="relative h-64 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-2">Niños</h1>
          <p className="text-xl">Comodidad y diversión para los más pequeños</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">Próximamente - Colección Kids</p>
        </div>
      </section>
    </div>
  );
}