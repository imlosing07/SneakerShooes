"use client";
import { useState, useEffect } from "react";
import { Product } from "@/src/types";

import Navbar from "./components/Navbar";
import HeroSection from "./components/Hero";
import BrandsCarousel from "./components/BrandsCarousel";
import ProductGrid from "./(category-page)/components/ProductGrid";
import MensPage from "./(category-page)/hombre/page";
import WomensPage from "./(category-page)/mujer/page";
import FormalPage from "./(category-page)/formal/page";
import KidsPage from "./(category-page)/ninos/page";
import ProductDetailView from "./producto/[id]/page";
import CartPage from "./carrito/CartPage";
import FavoritesPage from "./favoritos/FavoritePage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("/");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products once on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const json = await response.json();
        const productsList: Product[] = json?.data?.products ?? [];
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // Scroll to top cuando cambia de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-xl text-gray-500">Cargando productos...</div>
        </div>
      );
    }

    const commonProps = {
      products,
      onProductClick: handleProductClick,
    };

    // Renderizar SOLO una página a la vez
    switch (currentPage) {
      case "/carrito":
        return <CartPage onNavigate={handleNavigate} />;

      case "/favoritos":
        return (
          <FavoritesPage
            products={products}
            onProductClick={handleProductClick}
            onNavigate={handleNavigate}
          />
        );

      case "/hombre":
        return <MensPage {...commonProps} />;

      case "/mujer":
        return <WomensPage {...commonProps} />;

      case "/formal":
        return <FormalPage {...commonProps} />;

      case "/ninos":
        return <KidsPage {...commonProps} />;

      case "/":
      default:
        // HOME completo con Hero + Brands + Grid
        return (
          <>
            <HeroSection onNavigate={handleNavigate} />
            <BrandsCarousel />
            <ProductGrid
              products={products}
              title="Colección Premium"
              onProductClick={handleProductClick}
            />
          </>
        );
    }
  };

  return (
    <div className="font-sans">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Solo renderiza la página actual */}
      {renderPage()}

      {/* Modal de producto */}
      {selectedProduct && (
        <ProductDetailView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}