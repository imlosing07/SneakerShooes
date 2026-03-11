import { PencilIcon, TrashIcon, PhotoIcon, StarIcon, SparklesIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, SparklesIcon as SparklesIconSolid } from '@heroicons/react/24/solid';
import { Product } from '@/src/types';
import Image from 'next/image';

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onManageImages: (product: Product) => void;
  onToggleStatus: (product: Product, field: 'featured' | 'isNew') => void;
  onExportCSV: () => void;
}

export default function ProductsTable({ 
  products, 
  loading, 
  onEdit, 
  onDelete, 
  onManageImages,
  onToggleStatus,
  onExportCSV
}: ProductsTableProps) {
  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando productos...</div>;
  }

  if (products.length === 0) {
    return <div className="p-8 text-center text-gray-500">No se encontraron productos.</div>;
  }

  return (
    <>
      <div className="bg-gray-50 px-4 py-2 border-b flex justify-end">
        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
          title="Exportar a CSV"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Exportar Inventario (CSV)
        </button>
      </div>
      
      {/* Vista Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const mainImage = product.images?.find((img: any) => img.isMain) || product.images?.[0];
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    {mainImage ? (
                      <Image src={mainImage.standardUrl} alt={product.name} width={48} height={48} className="h-12 w-12 object-cover rounded" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                        <PhotoIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.category} • {product.genre}</div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900">{product.brand?.name || 'N/A'}</td>
                  <td className="px-3 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onToggleStatus(product, 'featured')}
                        className={`p-1 rounded-full transition-colors ${product.featured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-gray-400'}`}
                        title={product.featured ? 'Quitar de Destacados' : 'Marcar como Destacado'}
                      >
                        {product.featured ? <StarIconSolid className="h-5 w-5" /> : <StarIcon className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => onToggleStatus(product, 'isNew')}
                        className={`p-1 rounded-full transition-colors ${product.isNew ? 'text-blue-500 bg-blue-50' : 'text-gray-300 hover:text-gray-400'}`}
                        title={product.isNew ? 'Quitar etiqueta Nuevo' : 'Marcar como Nuevo'}
                      >
                        {product.isNew ? <SparklesIconSolid className="h-5 w-5" /> : <SparklesIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-sm font-medium text-gray-900">${product.price}</div>
                    {product.salePrice && (
                      <div className="text-xs text-green-600 font-bold">${product.salePrice}</div>
                    )}
                  </td>
                  <td className="px-3 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(product)} className="text-blue-500 hover:text-blue-700 p-1" title="Editar">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => onManageImages(product)} className="text-green-500 hover:text-green-700 p-1" title="Imágenes">
                        <PhotoIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-700 p-1" title="Eliminar">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile (Cards) */}
      <div className="md:hidden space-y-3 p-4">
        {products.map((product) => {
          const mainImage = product.images?.find((img: any) => img.isMain) || product.images?.[0];
          return (
            <div key={product.id} className="bg-white border rounded-xl p-4 shadow-sm relative overflow-hidden">
              {/* Badges para mobile */}
              <div className="absolute top-2 right-2 flex gap-1">
                {product.featured && <StarIconSolid className="h-4 w-4 text-yellow-500" />}
                {product.isNew && <SparklesIconSolid className="h-4 w-4 text-blue-500" />}
              </div>

              <div className="flex gap-3">
                {mainImage ? (
                  <Image src={mainImage.standardUrl} alt={product.name} width={80} height={80} className="h-20 w-20 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhotoIcon className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.brand?.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{product.category} • {product.genre}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    {product.salePrice && (
                      <span className="text-sm text-green-600 font-bold border border-green-200 bg-green-50 px-1.5 rounded">${product.salePrice}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-3">
                <div className="flex gap-2">
                   <button
                    onClick={() => onToggleStatus(product, 'featured')}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-lg border transition-colors ${product.featured ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                  >
                    <StarIcon className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">Destacar</span>
                  </button>
                  <button
                    onClick={() => onToggleStatus(product, 'isNew')}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-lg border transition-colors ${product.isNew ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                  >
                    <SparklesIcon className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">Nuevo</span>
                  </button>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => onEdit(product)} className="p-2 text-blue-500 border border-blue-100 rounded-lg">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => onDelete(product.id)} className="p-2 text-red-500 border border-red-100 rounded-lg">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
;
