import { Product } from "@/src/types";

export default function FormalProductCard({ 
  product, 
  onClick 
}: { 
  product: Product; 
  onClick?: () => void 
}) {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const mainImage = product.images.find(img => img.isMain) || product.images[0];

  return (
    <div onClick={onClick} className="group cursor-pointer">
      {/* Contenedor de imagen con aspect ratio más alto para formal */}
      <div className="relative aspect-[3/4] bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden mb-6">
        {/* Sutil badge de descuento - más discreto */}
        {hasDiscount && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-black/90 text-white text-[10px] font-medium px-3 py-1.5 tracking-widest">
              OFERTA
            </div>
          </div>
        )}

        {/* Imagen con efecto parallax sutil */}
        {mainImage ? (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={mainImage.originalUrl || mainImage.standardUrl}
              alt={product.name}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
            />
            {/* Overlay oscuro en hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-300 text-sm tracking-wider">SIN IMAGEN</span>
          </div>
        )}

        {/* Botón "Ver detalles" que aparece en hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-white/95 backdrop-blur-sm py-4 px-6 text-center">
            <span className="text-xs font-medium tracking-widest uppercase">
              Ver detalles →
            </span>
          </div>
        </div>
      </div>

      {/* Información del producto - Layout más espaciado */}
      <div className="space-y-3 px-2">
        {/* Marca en mayúsculas y más pequeña */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">
            {product.brand?.name}
          </p>
          {product.featured && (
            <span className="text-[10px] text-amber-600 uppercase tracking-wider font-medium">
              ★ Premium
            </span>
          )}
        </div>

        {/* Nombre del producto */}
        <h3 className="font-serif text-base leading-tight min-h-[2.5rem] group-hover:text-gray-600 transition">
          {product.name}
        </h3>

        {/* Precio con diseño minimalista */}
        <div className="flex items-baseline gap-3 pt-2">
          {hasDiscount ? (
            <>
              <p className="font-medium text-lg">
                S/ {product.salePrice?.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400 line-through">
                S/ {product.price.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="font-medium text-lg">
              S/ {product.price.toFixed(2)}
            </p>
          )}
        </div>

        {/* Tallas disponibles (solo mostrar que hay disponibilidad) */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              {product.sizes.length} tallas disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}