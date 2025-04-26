import React from 'react';
import Image from 'next/image';
import { ProductCardProps } from '@/src/types';

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, brand, price, discountPrice, imageUrl, colors, isNew, isTrending, isOnSale, rating } = product;

  // Función para renderizar estrellas de rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }

    // Estrella media
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-star-${id}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#4B5563" />
            </linearGradient>
          </defs>
          <path fill={`url(#half-star-${id})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }

    // Estrellas vacías
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-700">
      {/* Badges */}
      <div className="absolute top-0 left-0 z-10 flex flex-col gap-1 p-2">
        {isNew && (
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            Nuevo
          </span>
        )}
        {isTrending && (
          <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            Trending
          </span>
        )}
        {isOnSale && (
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            Oferta
          </span>
        )}
      </div>

      {/* Imagen */}
      <div className="h-48 sm:h-56 overflow-hidden">
        <div className="relative h-full w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <div className="flex">{renderStars(rating)}</div>
        </div>
        <p className="text-gray-400 text-sm mb-2">{brand}</p>

        {/* Colores disponibles */}
        <div className="flex mb-3 gap-1">
          {colors.map(color => (
            <div
              key={color}
              className="w-4 h-4 rounded-full border border-gray-600"
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
              title={color}
            ></div>
          ))}
        </div>

        {/* Precio y botón */}
        <div className="flex justify-between items-center mt-2">
          <div>
            {isOnSale && discountPrice ? (
              <div>
                <span className="text-gray-400 line-through text-sm mr-2">€{price.toFixed(2)}</span>
                <span className="text-lg font-bold text-pink-300">€{discountPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-pink-300">€{price.toFixed(2)}</span>
            )}
          </div>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-full text-sm transition-colors">
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};