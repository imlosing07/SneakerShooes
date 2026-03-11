import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  PlusIcon, 
  TrashIcon, 
  PhotoIcon, 
  CloudArrowUpIcon,
  ShoppingBagIcon,
  TagIcon, 
  CurrencyDollarIcon,
  InboxStackIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Brand } from '@/src/types';
import {
  Genre,
  ProductCategory,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS
} from '@/src/app/lib/constants/product-constants';
import { lusitana } from '@/src/app/ui/fonts';

interface ProductFormProps {
  brands: Brand[];
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

export default function ProductForm({ brands, initialData, onSubmit, onCancel, loading, isEdit = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    salePrice: initialData?.salePrice || 0,
    category: initialData?.category || ProductCategory.SNEAKERS,
    genre: initialData?.genre || Genre.UNISEX,
    brandId: initialData?.brandId || (initialData?.brand?.id) || '',
    featured: initialData?.featured || false,
    isNew: initialData?.isNew ?? true,
  });

  const [sizes, setSizes] = useState<Array<{ value: string; inventory: number | null }>>(initialData?.sizes || []);
  const [images, setImages] = useState<Array<{ originalUrl: string; standardUrl: string; publicId: string }>>(
    initialData?.images?.map((img: any) => ({
      originalUrl: img.originalUrl,
      standardUrl: img.standardUrl,
      publicId: img.publicId
    })) || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        salePrice: initialData.salePrice || 0,
        category: initialData.category || ProductCategory.SNEAKERS,
        genre: initialData.genre || Genre.UNISEX,
        brandId: initialData.brandId || (initialData.brand?.id) || '',
        featured: initialData.featured || false,
        isNew: initialData.isNew ?? true,
      });
      setSizes(initialData.sizes || []);
      setImages(
        initialData.images?.map((img: any) => ({
          originalUrl: img.originalUrl,
          standardUrl: img.standardUrl,
          publicId: img.publicId
        })) || []
      );
    } else if (!isEdit) {
      setFormData({
        name: '',
        description: '',
        price: 0,
        salePrice: 0,
        category: ProductCategory.SNEAKERS,
        genre: Genre.UNISEX,
        brandId: '',
        featured: false,
        isNew: true,
      });
      setSizes([]);
      setImages([]);
    }
  }, [initialData?.id, isEdit]);

  const addSize = () => {
    setSizes([...sizes, { value: '', inventory: null }]);
  };
  const updateSize = (index: number, field: string, value: any) => {
    setSizes(sizes.map((size: any, i: number) => i === index ? { ...size, [field]: value } : size));
  };
  const removeSize = (index: number) => setSizes(sizes.filter((_: any, i: number) => i !== index));

  const addImageUrl = async () => {
    if (newImageUrl.trim()) {
      try {
        setUploadingImage(true);
        const response = await fetch('/api/images/process-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: newImageUrl.trim(),
            folder: 'products'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Fallo al procesar la URL');
        }

        const result = await response.json();
        setImages([...images, {
          originalUrl: result.data.originalUrl,
          standardUrl: result.data.standardUrl,
          publicId: result.data.publicId
        }]);
        setNewImageUrl('');
      } catch (error: any) {
        console.error('Error processing image URL:', error);
        alert(`Error al añadir imagen: ${error.message}`);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const removeImage = (index: number) => setImages(images.filter((_: any, i: number) => i !== index));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Subida fallida');
      }

      const result = await response.json();
      setImages([...images, {
        originalUrl: result.data.originalUrl,
        standardUrl: result.data.standardUrl,
        publicId: result.data.publicId
      }]);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Error al subir imagen: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validSizes = sizes.filter((size: any) => {
      const hasValue = size.value && size.value.trim() !== '';
      const hasInventory = size.inventory !== null && size.inventory !== undefined && size.inventory >= 0;
      return hasValue && hasInventory;
    });

    if (validSizes.length === 0) {
      alert('Por favor, añada al menos una talla con valor e inventario válidos');
      return;
    }

    if (validSizes.length < sizes.length) {
      const skipped = sizes.length - validSizes.length;
      const confirmed = window.confirm(
        `${skipped} talla(s) tienen valores inválidos y serán ignoradas. ¿Continuar?`
      );
      if (!confirmed) return;
    }

    const cleanSizes = validSizes.map((size: any) => ({
      value: size.value.trim(),
      inventory: parseInt(size.inventory as any) || 0
    }));

    await onSubmit({
      ...formData,
      sizes: cleanSizes,
      images,
    });
  };

  return (
    <div className={isEdit ? 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4' : ''}>
      <div className={`bg-gray-50 rounded-2xl shadow-2xl ${isEdit ? 'max-w-4xl w-full max-h-[95vh] flex flex-col' : 'border border-gray-200'} overflow-hidden`}>
        {/* Header */}
        <div className="bg-white px-6 py-4 flex justify-between items-center border-b sticky top-0 z-10">
          <div>
            <h2 className={`${lusitana.className} text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
              {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">Completa los detalles del producto</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`${isEdit ? 'overflow-y-auto p-4 sm:p-6' : 'p-6'} space-y-8 pb-24 sm:pb-6`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Columna Izquierda: Info y Categorización */}
            <div className="space-y-6">
              {/* Información General */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBagIcon className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-gray-800">Información General</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre del Producto *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Nike Air Max 270"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Marca *</label>
                    <select
                      value={formData.brandId}
                      onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                      required
                    >
                      <option value="">Selecciona una marca</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción (Opcional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detalles sobre el material, estilo, etc."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Precios y Toggles */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-gray-800">Precios y Visibilidad</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Precio Base *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-7 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Oferta (Opcional)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.salePrice || ''}
                        onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-7 pr-4 py-2.5 bg-emerald-50/30 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-emerald-700 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${formData.featured ? 'border-yellow-400 bg-yellow-50 text-yellow-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <StarIcon className={`w-5 h-5 ${formData.featured ? 'fill-current' : ''}`} />
                    <span className="text-sm font-bold">Destacado</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${formData.isNew ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    />
                    <SparklesIcon className={`w-5 h-5 ${formData.isNew ? 'fill-current' : ''}`} />
                    <span className="text-sm font-bold">Nuevo</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Tallas e Imágenes */}
            <div className="space-y-6">
              {/* Categoría y Género */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <TagIcon className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-gray-800">Categorización</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                      required
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{PRODUCT_CATEGORY_LABELS[cat]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Género *</label>
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value as Genre })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                      required
                    >
                      <option value={Genre.MENS}>Hombre</option>
                      <option value={Genre.WOMENS}>Mujer</option>
                      <option value={Genre.KIDS}>Niños</option>
                      <option value={Genre.UNISEX}>Unisex</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Gestión de Tallas */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <InboxStackIcon className="w-5 h-5 text-orange-500" />
                    <h3 className="font-bold text-gray-800">Tallas y Stock</h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={addSize} 
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" /> Añadir Talla
                  </button>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                  {sizes.length > 0 ? (
                    sizes.map((size: any, index: number) => (
                      <div key={index} className="flex gap-3 items-center group bg-gray-50 p-2.5 rounded-xl border border-transparent hover:border-blue-100 hover:bg-white transition-all">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Talla (ej. 42, 9, M)"
                            value={size.value}
                            onChange={(e) => updateSize(index, 'value', e.target.value)}
                            className="w-full bg-transparent p-1.5 text-sm font-semibold outline-none"
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            placeholder="Stock"
                            min="0"
                            value={size.inventory === null ? '' : size.inventory}
                            onChange={(e) => updateSize(index, 'inventory', e.target.value === '' ? null : parseInt(e.target.value))}
                            className="w-full bg-gray-100/50 p-1.5 rounded-lg text-sm text-center font-bold outline-none focus:bg-blue-50 focus:text-blue-600"
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeSize(index)} 
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 border-2 border-dotted rounded-xl text-gray-400">
                      <p className="text-sm">No hay tallas configuradas</p>
                      <button type="button" onClick={addSize} className="text-blue-500 text-xs font-bold mt-2 hover:underline tracking-wide italic uppercase">Pulsa aquí para añadir</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Imágenes: Siempre al final y ancha */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <PhotoIcon className="w-5 h-5 text-pink-500" />
              <h3 className="font-bold text-gray-800">Galería de Imágenes</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controles de carga */}
              <div className="space-y-4">
                <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${uploadingImage ? 'border-blue-400 bg-blue-50/20' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={uploadingImage}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="p-3 bg-blue-50 rounded-full mb-3">
                      <CloudArrowUpIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {uploadingImage ? 'Subiendo...' : 'Selecciona una imagen'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 5MB</p>
                  </label>
                  {uploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-2xl">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="O pega el enlace de una imagen"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={addImageUrl} 
                    disabled={!newImageUrl || uploadingImage}
                    className="bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-black transition-colors text-sm font-bold disabled:opacity-50"
                  >
                    Añadir
                  </button>
                </div>
              </div>

              {/* Preview de Imágenes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.length > 0 ? (
                  images.map((image: any, index: number) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group border-2 border-transparent hover:border-blue-500 transition-all">
                      <img src={image.standardUrl} alt={`Prod ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg transform hover:scale-110 transition-all"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded uppercase">Portada</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full h-full min-h-[160px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 border-2 border-dashed rounded-2xl">
                    <PhotoIcon className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-xs font-medium italic">Sin imágenes cargadas</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción fijos en mobile */}
          <div className={`${isEdit ? 'sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md p-4 sm:p-0 sm:pt-4 sm:bg-transparent' : 'pt-4'} border-t flex gap-3 flex-col sm:flex-row z-20`}>
            <button 
              type="button" 
              onClick={onCancel} 
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all hidden sm:block"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || uploadingImage} 
              className="flex-1 px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 transform active:scale-[0.98] transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando...
                </span>
              ) : isEdit ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
            <button 
              type="button" 
              onClick={onCancel} 
              className="sm:hidden w-full py-3 rounded-xl font-bold text-gray-400 text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
