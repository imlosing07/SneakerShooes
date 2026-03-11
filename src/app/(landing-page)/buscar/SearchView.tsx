"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/src/types";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import ProductCard from "../(category-page)/components/ProductCard";
import {
  ProductCategory,
  Genre,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  GENRE_LABELS,
} from "@/src/app/lib/constants/product-constants";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const PRICE_RANGES = [
  { min: 0, max: 100, label: "Menos de S/100" },
  { min: 100, max: 200, label: "S/100 - S/200" },
  { min: 200, max: 300, label: "S/200 - S/300" },
  { min: 300, max: 500, label: "S/300 - S/500" },
  { min: 500, max: 99999, label: "Más de S/500" },
];

export default function SearchView({
  products,
  initialQuery,
}: {
  products: Product[];
  initialQuery: string;
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(initialQuery);
  const searchParams = useSearchParams();

  // Estados inicializados desde URL si existen
  const [selectedGenre, setSelectedGenre] = useState<Genre | "ALL">(
    (searchParams.get("genre") as Genre) || "ALL"
  );
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(
    searchParams.get("cats")?.split(",").filter(Boolean) as ProductCategory[] || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brands")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(
    searchParams.get("pmin") ? { 
      min: Number(searchParams.get("pmin")), 
      max: Number(searchParams.get("pmax")) 
    } : null
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "featured"
  );
  const [showFilters, setShowFilters] = useState(false);
  const [stickyOffset, setStickyOffset] = useState(64); // 64px = top-16
  const [lastScrollY, setLastScrollY] = useState(0);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedGenre !== "ALL") params.set("genre", selectedGenre); else params.delete("genre");
    if (selectedCategories.length > 0) params.set("cats", selectedCategories.join(",")); else params.delete("cats");
    if (selectedBrands.length > 0) params.set("brands", selectedBrands.join(",")); else params.delete("brands");
    if (priceRange) {
      params.set("pmin", priceRange.min.toString());
      params.set("pmax", priceRange.max.toString());
    } else {
      params.delete("pmin");
      params.delete("pmax");
    }
    if (sortBy !== "featured") params.set("sort", sortBy); else params.delete("sort");

    const newPath = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath);
  }, [selectedGenre, selectedCategories, selectedBrands, priceRange, sortBy, searchParams]);

  // Manejar offset del sticky basado en el scroll (sincronizado con navbar)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setStickyOffset(0);
      } else {
        setStickyOffset(64);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Extraer marcas únicas de los productos
  const availableBrands = useMemo(() => {
    const brands = products
      .map((p) => p.brand?.name)
      .filter((name): name is string => !!name);
    return Array.from(new Set(brands)).sort();
  }, [products]);

  // Filtrado client-side
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Filtrar por texto de búsqueda (LIVE)
    const query = searchInput.toLowerCase().trim();
    if (query) {
      result = result.filter((p) => 
        p.name.toLowerCase().includes(query) ||
        p.brand?.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // 2. Filtrar por género
    if (selectedGenre !== "ALL") {
      result = result.filter(
        (p) => p.genre === selectedGenre || p.genre === "UNISEX"
      );
    }

    // 3. Filtrar por categorías
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // 4. Filtrar por marcas
    if (selectedBrands.length > 0) {
      result = result.filter(
        (p) => p.brand && selectedBrands.includes(p.brand.name)
      );
    }

    // 5. Filtrar por precio
    if (priceRange) {
      result = result.filter((p) => {
        const price = p.salePrice || p.price;
        return price >= priceRange.min && price <= priceRange.max;
      });
    }

    // 6. Ordenar
    switch (sortBy) {
      case "price-asc":
        result.sort(
          (a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)
        );
        break;
      case "price-desc":
        result.sort(
          (a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)
        );
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "featured":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchInput, selectedGenre, selectedCategories, selectedBrands, priceRange, sortBy]);

  // Búsqueda server-side (nuevo fetch)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/buscar`);
    }
  };

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedGenre("ALL");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange(null);
    setSortBy("featured");
  };

  const activeFiltersCount =
    (selectedGenre !== "ALL" ? 1 : 0) +
    selectedCategories.length +
    selectedBrands.length +
    (priceRange ? 1 : 0);

  const genres: { value: Genre | "ALL"; label: string }[] = [
    { value: "ALL", label: "Todos" },
    { value: "MENS", label: "Hombre" },
    { value: "WOMENS", label: "Mujer" },
    { value: "KIDS", label: "Niños" },
  ];

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Search Header - Mejora del sticky dinámico */}
      <div 
        className="bg-white/95 border-b sticky z-30 shadow-sm backdrop-blur-md transition-all duration-300"
        style={{ top: `${stickyOffset}px` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Search Bar - Más compacta */}
          <form onSubmit={handleSearch} className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar zapatillas, marcas, estilos..."
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black transition bg-gray-50 focus:bg-white"
              id="search-page-input"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  router.push("/buscar");
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-black"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Genre Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {genres.map((g) => (
              <button
                key={g.value}
                onClick={() => setSelectedGenre(g.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedGenre === g.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {g.label}
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0" />

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                showFilters || activeFiltersCount > 0
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="bg-white text-black text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-black underline whitespace-nowrap ml-1"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Expandable Filters Panel */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showFilters ? "max-h-[600px] opacity-100 border-t" : "max-h-0 opacity-0"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categorías */}
              <div>
                <h3 className="font-semibold text-sm text-gray-900 mb-3">
                  Categoría
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        selectedCategories.includes(cat)
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {PRODUCT_CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Marcas */}
              <div>
                <h3 className="font-semibold text-sm text-gray-900 mb-3">
                  Marca
                </h3>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        selectedBrands.includes(brand)
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div>
                <h3 className="font-semibold text-sm text-gray-900 mb-3">
                  Precio
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.label}
                      onClick={() =>
                        setPriceRange(
                          priceRange?.min === range.min &&
                            priceRange?.max === range.max
                            ? null
                            : range
                        )
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        priceRange?.min === range.min &&
                        priceRange?.max === range.max
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            {initialQuery ? (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                resultados para{" "}
                <span className="font-medium text-gray-900">
                  &quot;{initialQuery}&quot;
                </span>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                productos disponibles
              </p>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:ring-black focus:border-black bg-white appearance-none cursor-pointer"
              id="search-sort-select"
            >
              <option value="featured">Destacados</option>
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-300 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-lg text-gray-500 mb-2">
              No se encontraron productos
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Intenta con otros términos de búsqueda o ajusta los filtros
            </p>
            <button
              onClick={() => {
                clearAllFilters();
                setSearchInput("");
                router.push("/buscar");
              }}
              className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition text-sm"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
