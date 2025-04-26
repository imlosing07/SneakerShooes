import React from 'react';
import { SidebarFiltersProps } from '@/src/types';

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({ filters, onFilterChange, brands, colors }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">Filtros</h3>
      
      {/* Filtro por marca */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-200 mb-2">Marca</h4>
        <select 
          value={filters.brand} 
          onChange={(e) => onFilterChange('brand', e.target.value)}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-200"
        >
          <option value="">Todas las marcas</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>
      
      {/* Filtro por rango de precio */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-200 mb-2">Rango de precio</h4>
        <select 
          value={filters.priceRange} 
          onChange={(e) => onFilterChange('priceRange', e.target.value)}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-200"
        >
          <option value="">Cualquier precio</option>
          <option value="0-50">Menos de €50</option>
          <option value="50-100">€50 - €100</option>
          <option value="100-150">€100 - €150</option>
          <option value="150-200">€150 - €200</option>
          <option value="200-10000">Más de €200</option>
        </select>
      </div>
      
      {/* Filtro por color */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-200 mb-2">Color</h4>
        <div className="grid grid-cols-2 gap-2">
          {colors.map(color => (
            <div 
              key={color} 
              className={`flex items-center p-2 rounded cursor-pointer transition-all ${filters.color === color ? 'bg-pink-500/30 border border-pink-500' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => onFilterChange('color', filters.color === color ? '' : color)}
            >
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ 
                  backgroundColor: color === 'white' ? '#ffffff' : 
                                 color === 'black' ? '#000000' : 
                                 color === 'pink' ? '#f472b6' : 
                                 color === 'gray' ? '#6b7280' :
                                 color === 'blue' ? '#3b82f6' :
                                 color === 'red' ? '#ef4444' :
                                 color === 'green' ? '#10b981' :
                                 color === 'beige' ? '#e5d3b3' :
                                 color === 'purple' ? '#8b5cf6' :
                                 color === 'gold' ? '#fbbf24' : color
                }}
              ></div>
              <span className="text-sm text-gray-200">{color.charAt(0).toUpperCase() + color.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Filtro de ofertas */}
      <div className="mb-6">
        <div 
          className={`flex items-center p-3 rounded cursor-pointer transition-all ${filters.isOnSale ? 'bg-pink-500/30 border border-pink-500' : 'bg-gray-700 hover:bg-gray-600'}`}
          onClick={() => onFilterChange('isOnSale', !filters.isOnSale)}
        >
          <div className={`w-5 h-5 flex items-center justify-center mr-2 rounded border ${filters.isOnSale ? 'border-pink-500 bg-pink-500' : 'border-gray-500'}`}>
            {filters.isOnSale && <span className="text-white text-xs">✓</span>}
          </div>
          <span className="text-gray-200">Solo ofertas</span>
        </div>
      </div>
      
      {/* Botón para limpiar filtros */}
      <button 
        onClick={() => {
          onFilterChange('brand', '');
          onFilterChange('priceRange', '');
          onFilterChange('color', '');
          onFilterChange('isOnSale', false);
        }}
        className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
      >
        Limpiar filtros
      </button>
    </div>
  );
};