"use client"
import React, { useState, useEffect } from 'react';
import { ProductCatalogProps, Product, Filters } from '@/src/types';
import {SidebarFilters} from './SidebarFilters';
import {ProductGrid} from './ProductGrid';

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ products }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    brand: '',
    priceRange: '',
    color: '',
    isOnSale: false
  });

  // Extraer marcas únicas
  const brands = [...new Set(products.map(product => product.brand))];

  // Extraer colores únicos
  const allColors = products.flatMap(product => product.colors);
  const colors = [...new Set(allColors)];

  // Efecto para filtrar los productos
  useEffect(() => {
    let result = products;

    // Filtro por búsqueda
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por marca
    if (filters.brand) {
      result = result.filter(product => product.brand === filters.brand);
    }

    // Filtro por rango de precio
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(product => {
        const price = product.discountPrice || product.price;
        return price >= min && price <= max;
      });
    }

    // Filtro por color
    if (filters.color) {
      result = result.filter(product =>
        product.colors.includes(filters.color)
      );
    }

    // Filtro por ofertas
    if (filters.isOnSale) {
      result = result.filter(product => product.isOnSale);
    }

    setFilteredProducts(result);
  }, [searchTerm, filters, products]);

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterName: string, value: string | boolean): void => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Botón para mostrar/ocultar filtros en móvil */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Filtros</h2>
          <button
            onClick={toggleMobileFilter}
            className="px-4 py-2 bg-pink-500 text-white rounded-full flex items-center"
          >
            <span>{isMobileFilterOpen ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
            <svg
              className={`ml-2 w-4 h-4 transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        {/* Sidebar con filtros (oculto en móvil por defecto) */}
        <div className={`lg:w-1/4 ${isMobileFilterOpen ? 'block' : 'hidden'} lg:block`}>
          <SidebarFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            brands={brands}
            colors={colors}
          />
        </div>

        {/* Grid de productos */}
        <ProductGrid
          products={filteredProducts}
          searchTerm={searchTerm}
          onSearch={handleSearchChange}
          resultsCount={filteredProducts.length}
        />
      </div>
    </div>
  );
};