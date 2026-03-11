"use client";
import { Product } from "@/src/types";
import ProductCard from "../(category-page)/components/ProductCard";
import Link from "next/link";

export default function FeaturedShowcase({ products }: { products: Product[] }) {
  if (!products.length) return null;

  // Separar: primeros 4 como "spotlight", resto como grid
  const spotlight = products.slice(0, 4);
  const rest = products.slice(4, 12);

  return (
    <section className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16 sm:py-24 overflow-hidden">
      {/* Elementos decorativos sutiles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-amber-100/30 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-50/40 to-transparent rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header creativo */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white text-[10px] sm:text-xs uppercase tracking-[0.2em] rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            Exclusivos & Fuera de Serie
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Modelos que no encontrarás
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900">
              en otro lugar
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Zapatillas originales fuera de serie, ediciones únicas y modelos descontinuados.
            <span className="font-medium text-gray-700"> Todos 100% nuevos, a precios que valen la pena.</span>
          </p>
        </div>

        {/* Spotlight: 4 productos destacados */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {spotlight.map((product, idx) => (
            <div key={product.id} className="group relative">
              {idx === 0 && (
                <div className="absolute -top-2 -left-1 sm:-top-3 sm:-left-2 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-widest rounded-full shadow-lg font-medium">
                  ⚡ Más vendido
                </div>
              )}
              {idx === 1 && (
                <div className="absolute -top-2 -left-1 sm:-top-3 sm:-left-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-widest rounded-full shadow-lg font-medium">
                  🔥 Último par
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Valor proposición */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {[
            { icon: "✓", title: "100% Originales", desc: "Garantía de autenticidad" },
            { icon: "📦", title: "Nuevos de caja", desc: "Sin uso, empaque original" },
            { icon: "🏷️", title: "Mejor precio", desc: "Hasta 70% vs retail" },
            { icon: "🚀", title: "Únicos aquí", desc: "Modelos fuera de serie" },
          ].map((item) => (
            <div key={item.title} className="text-center p-3 sm:p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">{item.icon}</div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5">{item.title}</h4>
              <p className="text-[10px] sm:text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Grid secundario */}
        {rest.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Más destacados</h3>
              <Link
                href="/buscar"
                className="text-xs sm:text-sm text-gray-500 hover:text-black transition flex items-center gap-1 group"
              >
                Ver todo el catálogo
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
              {rest.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
