// ProductGrid.jsx
import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductGridProps } from '@/src/types';

export const ProductGrid: React.FC<ProductGridProps> = ({ products, searchTerm, onSearch, resultsCount }) => {
  return (
    <div className="flex-1">
      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar sneakers..."
            value={searchTerm}
            onChange={onSearch}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {resultsCount} {resultsCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </p>
      </div>

      {/* Grid de productos */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400">No se encontraron productos que coincidan con tus filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};