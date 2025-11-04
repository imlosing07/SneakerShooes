"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ImagenHeader from '@/public/mujerImagenes/muijer fondo.webp'

// Componentes
import Carousel from '../components/Carousel';
import { ProductCard } from '../components/ProductCard';
import { ProductCatalog } from '../components/ProductCatalog';
import NewsletterForm from '../components/NewsletterForm';
import { ProductCategory, Genre, Size, Brand, ProductImage } from '@prisma/client';

// Tipos
interface Product {
  id: string;
  name: string;
  description?: string | null;
  category: ProductCategory;
  genre: Genre;
  sizes: Size[];
  price: number;
  salePrice?: number | null;
  featured: boolean;
  isNew: boolean;
  brandId: string;
  brand?: Brand;
  images: ProductImage[];
  wishlistItems?: any[];
  createdAt: Date;
  updatedAt: Date;
}

// Datos de ejemplo
const popularSneakers: Product[] = [
  {
    id: 1,
    name: "Cloud Runner",
    brand: "Nike",
    price: 129.99,
    imageUrl: "/images/sneakers/cloud-runner.jpg",
    colors: ["white", "black", "pink"],
    isNew: true,
    isTrending: true,
    rating: 4.8
  },
  {
    id: 2,
    name: "Urban Street",
    brand: "Adidas",
    price: 149.99,
    discountPrice: 119.99,
    imageUrl: "/images/sneakers/urban-street.jpg",
    colors: ["gray", "white", "blue"],
    isOnSale: true,
    rating: 4.7
  },
  {
    id: 3,
    name: "Comfort Plus",
    brand: "Puma",
    price: 99.99,
    imageUrl: "/images/sneakers/comfort-plus.jpg",
    colors: ["beige", "pink", "black"],
    isTrending: true,
    rating: 4.5
  },
];

// Catálogo completo
export const allSneakers: Product[] = [
  ...popularSneakers,
  {
    id: 4,
    name: "Retro Classic",
    brand: "Reebok",
    price: 109.99,
    imageUrl: "/images/sneakers/retro-classic.jpg",
    colors: ["white", "red", "blue"],
    rating: 4.3
  },
  {
    id: 5,
    name: "Eco Friendly",
    brand: "Veja",
    price: 139.99,
    imageUrl: "/images/sneakers/eco-friendly.jpg",
    colors: ["beige", "green", "white"],
    isNew: true,
    rating: 4.6
  },
  {
    id: 6,
    name: "City Walker",
    brand: "New Balance",
    price: 119.99,
    discountPrice: 99.99,
    imageUrl: "/images/sneakers/city-walker.jpg",
    colors: ["gray", "pink", "white"],
    isOnSale: true,
    rating: 4.4
  },
  {
    id: 7,
    name: "Sporty Chic",
    brand: "Converse",
    price: 89.99,
    imageUrl: "/images/sneakers/sporty-chic.jpg",
    colors: ["black", "white", "gold"],
    rating: 4.5
  },
  {
    id: 8,
    name: "Fit Motion",
    brand: "Skechers",
    price: 79.99,
    imageUrl: "/images/sneakers/fit-motion.jpg",
    colors: ["purple", "gray", "white"],
    rating: 4.2
  },
];

export default function WomenSneakersPage() {
  const [filteredSneakers, setFilteredSneakers] = useState<Product[]>(allSneakers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    brand: '',
    priceRange: '',
    color: '',
    isOnSale: false
  });

  // Efecto para filtrar los sneakers
  useEffect(() => {
    let result = allSneakers;

    // Filtro por búsqueda
    if (searchTerm) {
      result = result.filter(sneaker =>
        sneaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sneaker.brand?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por marca
    if (filters.brand) {
      result = result.filter(sneaker => sneaker.brand?.name === filters.brand);
    }

    // Filtro por rango de precio
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(sneaker => {
        const price = sneaker.salePrice || sneaker.price;
        return price >= min && price <= max;
      });
    }

    // Filtro por ofertas
    if (filters.isOnSale) {
      result = result.filter(sneaker => sneaker.salePrice);
    }

    setFilteredSneakers(result);
  }, [searchTerm, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterName: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Obtener sneakers en oferta
  const onSaleSneakers = allSneakers.filter(sneaker => sneaker.salePrice);

  // Obtener sneakers trending
  const trendingSneakers = allSneakers.filter(sneaker => sneaker.isNew);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20">
      {/* Encabezado */}
      <header className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <Image
          src={ImagenHeader}
          alt="Sneakers para Mujer"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 z-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
            Sneakers para Mujer
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-xl">
            Combina estilo, comodidad y versatilidad con nuestra exclusiva colección de zapatillas deportivas para mujer
          </p>
        </div>
      </header>

      {/* Carrusel de modelos populares */}
      <section className="py-12 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-amber-200">
            Modelos Más Populares
          </span>
        </h2>
        <Carousel items={popularSneakers.map(sneaker => (
          <div key={sneaker.id} className="px-2">
            <ProductCard product={sneaker} />
          </div>
        ))} />
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



      {/* Sección de tendencias */}
      {trendingSneakers.length > 0 && (
        <section className="py-12 px-4 md:px-8 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-amber-200">
                Tendencias del Momento
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingSneakers.map(sneaker => (
                <div key={sneaker.id} className="group relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <div className="absolute top-0 right-0 bg-pink-500 text-white px-3 py-1 z-10 rounded-bl-lg">
                    Trending
                  </div>
                  <div className="h-64 overflow-hidden">
                    <Image
                      src={sneaker.imageUrl}
                      alt={sneaker.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{sneaker.name}</h3>
                    <p className="text-gray-300 mb-2">{sneaker.brand}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-pink-300">€{sneaker.price.toFixed(2)}</span>
                      <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors">
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sección de ofertas */}
      {onSaleSneakers.length > 0 && (
        <section className="py-12 px-4 md:px-8">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-amber-200">
                Ofertas Exclusivas
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onSaleSneakers.map(sneaker => (
                <div key={sneaker.id} className="group relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-pink-500/30">
                  <div className="absolute top-0 right-0 bg-pink-500 text-white px-3 py-1 z-10 rounded-bl-lg">
                    Oferta
                  </div>
                  <div className="h-64 overflow-hidden">
                    <Image
                      src={sneaker.imageUrl}
                      alt={sneaker.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{sneaker.name}</h3>
                    <p className="text-gray-300 mb-2">{sneaker.brand}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-400 line-through mr-2">€{sneaker.price.toFixed(2)}</span>
                        <span className="text-lg font-bold text-pink-300">€{sneaker.discountPrice?.toFixed(2)}</span>
                      </div>
                      <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors">
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}