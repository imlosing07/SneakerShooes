"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import Image from "next/image";
import ImagenHeader from "@/public/menImages/MEN PAGE.webp";
import { ProductCatalog } from "../components/ProductCatalog";
import { allSneakers } from "../mujer/page";


// Data
const popularSneakers = allSneakers.slice(0, 3);
export default function HombrePage() {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [activeFilters, setActiveFilters] = useState({
        brand: "all",
        priceRange: "all",
        color: "all",
    });
    const [searchQuery, setSearchQuery] = useState("");

    // Handle carousel navigation
    const nextSlide = () => {
        setCarouselIndex((prevIndex) =>
            prevIndex === popularSneakers.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCarouselIndex((prevIndex) =>
            prevIndex === 0 ? popularSneakers.length - 1 : prevIndex - 1
        );
    };

    // Auto-advance carousel
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [carouselIndex]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header Section */}
            <header className="relative h-screen overflow-hidden pt-24">
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
                <div className="absolute right-0 w-1/2 h-full">
                    <Image
                        src={ImagenHeader}
                        alt="Shoees men"
                        fill
                        objectFit="cover"
                        className="w-full h-0.5"
                    />
                </div>
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 z-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
                        ON FIRE
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-xl">
                        Combina estilo, comodidad y versatilidad con nuestra exclusiva colección de zapatillas deportivas para mujer
                    </p>
                </div>
            </header>

            {/* Featured Carousel Section */}
            <section className="py-16 bg-gray-800">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Modelos <span className="text-amber-400">Destacados</span>
                    </h2>

                    <div className="relative">
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-700 ease-in-out"
                                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                            >
                                {popularSneakers.map((sneaker) => (
                                    <div key={sneaker.id} className="min-w-full px-4">
                                        <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-900 rounded-2xl overflow-hidden p-8">
                                            <div className="product-image-container md:w-1/2 rounded-xl overflow-hidden">
                                                <img
                                                    alt={sneaker.name}
                                                    className="product-image w-full h-[300px] md:h-[400px] object-cover"
                                                />
                                            </div>
                                            <div className="md:w-1/2 space-y-6">
                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-bold">{sneaker.name}</h3>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                            <span className="text-3xl font-bold">${sneaker.price}</span>
                                                    </div>
                                                    <p className="text-green-500">{sneaker.price ? "¡Oferta Especial!" : "Precio Regular"}</p>
                                                </div>

                                                <div className="flex flex-wrap gap-3">
                                                    <button className="btn btn-primary flex items-center gap-2">
                                                        <ShoppingBag size={18} />
                                                        Añadir al Carrito
                                                    </button>
                                                    <button className="btn btn-outline flex items-center gap-2">
                                                        <Heart size={18} />
                                                        Favoritos
                                                    </button>
                                                </div>

                                                <div className="flex gap-4">
                                                    <div className="text-center">
                                                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-1">
                                                            <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs text-gray-400">Premium</span>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-1">
                                                            <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs text-gray-400">Duradero</span>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-1">
                                                            <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs text-gray-400">Ligero</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-gray-900/80 flex items-center justify-center text-white hover:bg-gray-900 transition-colors"
                        >
                            <ChevronLeft />
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-gray-900/80 flex items-center justify-center text-white hover:bg-gray-900 transition-colors"
                        >
                            <ChevronRight />
                        </button>

                        <div className="flex justify-center gap-2 mt-6">
                            {popularSneakers.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCarouselIndex(index)}
                                    className={`w-3 h-3 rounded-full ${index === carouselIndex ? 'bg-amber-400' : 'bg-gray-600'}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Título de sección */}
            <div className="container mx-auto py-8 px-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-amber-200">
                        Descubre Nuestra Colección
                    </span>
                </h2>
                <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
                    Encuentra el estilo perfecto para cada ocasión con nuestra selección exclusiva de zapatillas para mujer
                </p>
            </div>

            {/* Catálogo de productos con barra lateral */}
            <ProductCatalog products={allSneakers} />
        </div>)
};
