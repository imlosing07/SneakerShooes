import { Product } from "@/src/types";
import { useState, useMemo } from "react";
import ProductGrid from "../components/ProductGrid";
import FilterBar from "../../components/FilterBar";
import { Genre, GENRES, PRODUCT_CATEGORIES, ProductCategory } from "@/src/app/lib/constants/product-constants";

interface FilterState {
    categories: ProductCategory[];
    genres: Genre[];
    brands: string[];
    priceRange: { min: number; max: number } | null;
}

export default function MensPage({
    products,
    onProductClick
}: {
    products: Product[];
    onProductClick: (p: Product) => void
}) {
    const [filters, setFilters] = useState<FilterState>({
        categories: PRODUCT_CATEGORIES,
        genres: ["MENS"],
        brands: [],
        priceRange: null,
    });

    const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");

    // Productos filtrados
    const filteredProducts = useMemo(() => {
        let result = products.filter(p =>
            p.genre === GENRES[1] || p.genre === GENRES[4]
        );

        // Filtrar por categorías
        if (filters.categories.length > 0) {
            result = result.filter(p => filters.categories.includes(p.category));
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
            case "newest":
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
            .filter(p => filters.categories.includes(p.category))
            .map(p => p.brand?.name)
            .filter((name): name is string => !!name);
        return Array.from(new Set(brands)).sort();
    }, [products, filters.categories]);

    return (
        <div className="pt-16">
            {/* Hero Mejorado */}
            <div className="relative h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent z-10" />

                {/* Imagen de fondo - reutilizar imagen del Hero carousel */}
                <img
                    src="/categoryImages/desktopMen.jpg"
                    alt="Colección Hombre"
                    className="w-full h-full object-cover"
                />

                {/* Contenido del hero */}
                <div className="absolute inset-0 z-20 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="text-white max-w-xl">
                            <div className="text-sm font-medium mb-2 tracking-wider">COLECCIÓN</div>
                            <h1 className="text-6xl font-bold mb-4">Hombre</h1>
                            <p className="text-xl text-gray-200 mb-6">
                                Descubre nuestra selección de calzado urbano y deportivo
                            </p>
                            <div className="flex items-center gap-4">
                                <span className="text-sm">
                                    {filteredProducts.length} productos disponibles
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra de filtros */}
            <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                availableBrands={availableBrands}
                currentGenre={GENRES[1]}
            />

            {/* Controles de ordenamiento */}
            <div className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Mostrando {filteredProducts.length} productos
                        </p>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black"
                        >
                            <option value="featured">Destacados</option>
                            <option value="newest">Más recientes</option>
                            <option value="price-asc">Precio: Menor a Mayor</option>
                            <option value="price-desc">Precio: Mayor a Menor</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid de productos */}
            <div className="bg-white py-8">
                {filteredProducts.length === 0 ? (
                    <div className="max-w-7xl mx-auto px-4 text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-lg text-gray-500 mb-2">No se encontraron productos</p>
                        <p className="text-sm text-gray-400 mb-4">Intenta ajustar los filtros</p>
                        <button
                            onClick={() => setFilters({
                                categories: [],
                                genres: ["MENS"],
                                brands: [],
                                priceRange: null,
                            })}
                            className="text-sm text-black underline hover:no-underline"
                        >
                            Limpiar todos los filtros
                        </button>
                    </div>
                ) : (
                    <ProductGrid
                        products={filteredProducts}
                        title=""
                        onProductClick={onProductClick}
                    />
                )}
            </div>
        </div>
    );
}