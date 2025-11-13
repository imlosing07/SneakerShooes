import { Product } from "@/src/types";
import { useState, useMemo } from "react";
import FormalProductCard from "../components/FormalProductCard";
import { Genre } from "@/src/app/lib/constants/product-constants";

interface FilterState {
  genres: Genre[];
  brands: string[];
  priceRange: { min: number; max: number } | null;
}

const GENRE_LABELS = {
  MENS: "Caballero",
  WOMENS: "Dama",
  UNISEX: "Unisex",
  KIDS: "Niños",
};

export default function FormalPage({ 
  products, 
  onProductClick 
}: { 
  products: Product[]; 
  onProductClick: (p: Product) => void 
}) {
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    brands: [],
    priceRange: null,
  });

  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.category === "FORMAL");

    // Filtrar por género
    if (filters.genres.length > 0) {
      result = result.filter(p => 
        filters.genres.includes(p.genre) || p.genre === "UNISEX"
      );
    }

    // Filtrar por marcas
    if (filters.brands.length > 0) {
      result = result.filter(p => p.brand && filters.brands.includes(p.brand.name));
    }

    // Filtrar por precio
    if (filters.priceRange) {
      result = result.filter(p => {
        const price = p.salePrice || p.price;
        return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
      });
    }

    // Ordenar
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "featured":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, filters, sortBy]);

  // Marcas disponibles en formal
  const availableBrands = useMemo(() => {
    const brands = products
      .filter(p => p.category === "FORMAL")
      .map(p => p.brand?.name)
      .filter((name): name is string => !!name);
    return Array.from(new Set(brands)).sort();
  }, [products]);

  const toggleGenre = (genre: Genre) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    setFilters({ ...filters, genres: newGenres });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    setFilters({ ...filters, brands: newBrands });
  };

  return (
    <div className="pt-16 bg-white">
      {/* Hero Elegante - Minimalista */}
      <div className="relative h-[500px] overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-neutral-900">
        {/* Patrón sutil de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} 
          />
        </div>

        {/* Contenido centrado */}
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-3xl mx-auto px-4">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-light">
                  Colección
                </span>
              </div>
              <h1 className="font-serif text-7xl md:text-8xl text-white font-light tracking-tight">
                Formal
              </h1>
              <p className="text-lg text-gray-300 font-light tracking-wide max-w-xl mx-auto">
                Elegancia atemporal y sofisticación para cada ocasión especial
              </p>
              <div className="pt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-[1px] bg-gray-600" />
                  <span className="tracking-wider">{filteredProducts.length} Estilos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-[1px] bg-gray-600" />
                  <span className="tracking-wider">Premium Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros minimalistas */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Filtro por género */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-4">
                Colección
              </h3>
              <div className="space-y-3">
                {(["MENS", "WOMENS", "UNISEX"] as Genre[]).map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`block w-full text-left px-4 py-2.5 rounded transition ${
                      filters.genres.includes(genre)
                        ? "bg-black text-white"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="text-sm font-light tracking-wide">
                      {GENRE_LABELS[genre]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por marca */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-4">
                Marcas
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {availableBrands.map((brand) => (
                  <label 
                    key={brand} 
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-4 py-2 rounded transition"
                  >
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm font-light tracking-wide">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ordenamiento */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-4">
                Ordenar por
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm font-light focus:ring-1 focus:ring-black focus:border-black"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>

              {/* Limpiar filtros */}
              {(filters.genres.length > 0 || filters.brands.length > 0) && (
                <button
                  onClick={() => setFilters({ genres: [], brands: [], priceRange: null })}
                  className="mt-3 text-xs text-gray-500 hover:text-black underline tracking-wide"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de productos - Más espacioso */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm tracking-wider">
              No se encontraron productos con los filtros seleccionados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <FormalProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer informativo */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl mb-2">🎩</div>
              <h3 className="font-medium text-sm tracking-wide">Elegancia Premium</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Diseños clásicos y atemporales
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl mb-2">✨</div>
              <h3 className="font-medium text-sm tracking-wide">Calidad Superior</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Materiales premium y acabados impecables
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-medium text-sm tracking-wide">Ocasiones Especiales</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Perfectos para eventos formales y ceremonias
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}