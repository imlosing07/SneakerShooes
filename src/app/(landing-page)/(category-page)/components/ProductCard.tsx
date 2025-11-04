import React from 'react';
import Image from 'next/image';
import { Product } from '@/src/types';

export const ProductCard: React.FC<Product> = ({
  name,
  brand,
  price,
  isNew,
}) => {

  return (
    <div className="group relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-700">
      {/* Badges */}
      <div className="absolute top-0 left-0 z-10 flex flex-col gap-1 p-2">
        {isNew && (
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            Nuevo
          </span>
        )}
      </div>

      {/* Imagen */}
      <div className="h-48 sm:h-56 overflow-hidden">
        <div className="relative h-full w-full">
          <Image
            src={"https://www.plasticaucho.com.pe/blog/wp-content/uploads/2021/02/C%C3%B3mo-iniciar-un-negocio-enfocado-en-la-venta-de-zapatillas-en-Lima.jpg"} // Asegúrate de que la ruta sea correcta
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
        </div>
        <p className="text-gray-400 text-sm mb-2">{brand?.name}</p>

        {/* Precio y botón */}
        <div className="flex justify-between items-center mt-2">
          <div>
            {isNew ? (
              <div>
                <span className="text-gray-400 line-through text-sm mr-2">€{price.toFixed(2)}</span>
                <span className="text-lg font-bold text-pink-300">€{price.toFixed(2)}</span>
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


