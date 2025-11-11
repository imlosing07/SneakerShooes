import { Product } from "@/src/types";
import { useState } from "react";


export default function ProductDetailView({ product, onClose }: { product: Product; onClose: () => void }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-2xl">
          {/* Header con botón cerrar */}
          <div className="flex justify-between items-center p-6 border-b">
            <div className="text-sm text-gray-500">
              <span className="hover:underline cursor-pointer">Home</span> / 
              <span className="hover:underline cursor-pointer ml-1">{product.category}</span> /
              <span className="ml-1 text-black">{product.name}</span>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.images[selectedImage] ? (
                  <img
                    src={product.images[selectedImage].standardUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Miniaturas */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                        idx === selectedImage ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={img.standardUrl}
                        alt={`Vista ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info del producto */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex gap-2">
                {product.isNew && (
                  <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                    NUEVO
                  </span>
                )}
                {product.featured && (
                  <span className="bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    ⭐ DESTACADO
                  </span>
                )}
              </div>

              {/* Marca y nombre */}
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  {product.brand?.name}
                </p>
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Precio */}
              <div className="py-4 border-y">
                {hasDiscount ? (
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-red-600">
                      S/ {product.salePrice?.toFixed(2)}
                    </p>
                    <p className="text-lg text-gray-400 line-through">
                      S/ {product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      ¡Ahorra S/ {(product.price - product.salePrice!)?.toFixed(2)}!
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold">S/ {product.price.toFixed(2)}</p>
                )}
              </div>

              {/* Selector de tallas */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="font-medium">Selecciona tu talla:</p>
                  <button className="text-sm text-gray-500 hover:underline">
                    Guía de tallas
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.value)}
                      disabled={size.inventory === 0}
                      className={`py-3 rounded-lg border-2 font-medium transition ${
                        size.inventory === 0
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                          : selectedSize === size.value
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
                {product.sizes.every(s => s.inventory === 0) && (
                  <p className="text-sm text-red-600 mt-2">Agotado temporalmente</p>
                )}
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <button 
                  disabled={!selectedSize || product.sizes.every(s => s.inventory === 0)}
                  className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {selectedSize ? 'Agregar al carrito' : 'Selecciona una talla'}
                </button>
                <button className="w-full border-2 border-black py-4 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <span className="text-xl">♡</span>
                  Agregar a favoritos
                </button>
              </div>

              {/* Info adicional */}
              <div className="pt-4 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🚚</span>
                  <div>
                    <p className="font-medium">Envío gratis</p>
                    <p className="text-gray-600">En compras mayores a S/ 200</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">↩️</span>
                  <div>
                    <p className="font-medium">Devolución gratis</p>
                    <p className="text-gray-600">Tienes 30 días para devolver</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}