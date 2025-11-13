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

export default function App() {
  const [currentPage, setCurrentPage] = useState("/");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const renderPage = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-gray-500">Cargando productos...</div>
        </div>
      );
    }

    const props = {
      products: products,
      onProductClick: (product: Product) => setSelectedProduct(product)
    };



    // ✅ SOLO renderiza UNA página a la vez
    switch (currentPage) {
      case "/hombre":
        return <MensPage {...props} />;
      case "/mujer":
        return <WomensPage {...props} />;
      case "/formal":
        return <FormalPage {...props} />;
      case "/ninos":
        return <KidsPage {...props} />;
      case "/":
      default:
        // ✅ HOME completo con Hero + Brands + Grid
        return (
          <>
            <HeroSection onNavigate={setCurrentPage}/>
            <BrandsCarousel />
            <ProductGrid 
              products={products} 
              title="Colección Premium" 
              onProductClick={props.onProductClick}
            />
          </>
        );
    }
  };

  return (
    <div className="font-sans">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      
      {/* ✅ Solo renderiza la página actual */}
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