'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/src/app/lib/hooks/useProducts';
import { Product, ProductImage } from '@/domain/product/product.entity';
import { ProductCategory, Genre } from '@prisma/client';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/src/app/ui/fonts';
import { brandApiClient } from '@/src/app/lib/api/brand-client';
import { Brand } from '@/domain/brand/brand.entity';

// Interfaces necesarias para los formularios
interface FormData {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  genre: Genre;
  inventory: number;
  brandId: string;
  salePrice?: number | null;
  featured?: boolean;
  isNew?: boolean;
}

export default function ProductsComponent() {
  // Estados para UI
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageProduct, setImageProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Estados de filtros
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Formularios
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: 0,
    category: ProductCategory.SNEAKERS,
    genre: Genre.UNISEX,
    inventory: 0,
    brandId: '',
  });

  const [editFormData, setEditFormData] = useState<FormData>({
    name: '',
    description: '',
    price: 0,
    category: ProductCategory.SNEAKERS,
    genre: Genre.UNISEX,
    inventory: 0,
    brandId: '',
  });

  // Usar el hook de productos
  const {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProductById,
    searchProducts: searchProductsHook,
  } = useProducts({
    initialPage: currentPage,
    initialPageSize: pageSize,
    fetchOnMount: false,
  });

  // Cargar productos cuando cambian los filtros
  useEffect(() => {
    fetchProducts({
      category: selectedCategory || undefined,
      page: currentPage,
      pageSize,
      query: searchQuery || undefined,
    });
  }, [currentPage, selectedCategory, selectedBrandId, searchQuery, fetchProducts]);

  // Cargar marcas para los dropdowns
  useEffect(() => {
    async function fetchBrands() {
      try {
        const data = await brandApiClient.getAllBrands(1, 100);
        console.log('Brands:', data.brands);
        setBrands(data.brands);
      } catch (err: any) {
        console.error("Failed to fetch brands:", err);
      }
    }

    fetchBrands();
  }, []);

  // Función para resetear el formulario de creación
  function resetForm() {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: ProductCategory.SNEAKERS,
      genre: Genre.UNISEX,
      inventory: 0,
      brandId: '',
    });
  }

  // Función para buscar productos
  const handleSearch = () => {
    setCurrentPage(1); // Reiniciar a la primera página
    if (searchQuery.trim()) {
      searchProductsHook(searchQuery);
    } else {
      fetchProducts({
        category: selectedCategory || undefined,
        page: 1,
        pageSize,
      });
    }
  };

  // Función para crear un producto
  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Utilizar el cliente API directamente
      await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // Resetear y cerrar formulario
      resetForm();
      setShowCreateForm(false);
      
      // Actualizar lista
      fetchProducts({
        category: selectedCategory || undefined,
        page: currentPage,
        pageSize,
      });
    } catch (err: any) {
      console.error("Error creating product:", err);
    }
  }

  // Función para seleccionar un producto para editar
  async function handleSelectProduct(product: Product) {
    try {
      const fullProduct = await fetchProductById(product.id);
      if (fullProduct) {
        setSelectedProduct(fullProduct);
        setEditFormData({
          name: fullProduct.name,
          description: fullProduct.description || '',
          price: fullProduct.price,
          category: fullProduct.category,
          genre: fullProduct.genre || Genre.UNISEX,
          inventory: 0, // Esto deberá ser calculado si es necesario
          brandId: fullProduct.brandId,
          salePrice: fullProduct.salePrice,
          featured: fullProduct.featured,
          isNew: fullProduct.isNew,
        });
      }
    } catch (err) {
      console.error("Error fetching full product details:", err);
    }
  }

  // Función para actualizar un producto
  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      
      // Resetear y cerrar formulario
      setSelectedProduct(null);
      
      // Actualizar lista
      fetchProducts({
        category: selectedCategory || undefined,
        page: currentPage,
        pageSize,
      });
    } catch (err: any) {
      console.error("Error updating product:", err);
    }
  }

  // Función para eliminar un producto
  async function handleDeleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      // Actualizar lista
      fetchProducts({
        category: selectedCategory || undefined,
        page: currentPage,
        pageSize,
      });
    } catch (err: any) {
      console.error("Error deleting product:", err);
    }
  }

  // Función para añadir imagen
  async function handleAddImage(e: React.FormEvent) {
    e.preventDefault();
    if (!imageProduct) return;
  
    try {
      const position = imageProduct.images ? imageProduct.images.length : 0;
      
      await fetch(`/api/products/${imageProduct.id}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: newImageUrl,
          position,
        }),
      });
      
      // Si tenemos un producto seleccionado, actualizarlo
      if (selectedProduct && selectedProduct.id === imageProduct.id) {
        const updatedProduct = await fetchProductById(selectedProduct.id);
        if (updatedProduct) {
          setSelectedProduct(updatedProduct);
        }
      }
      
      // Actualizar lista general
      fetchProducts({
        category: selectedCategory || undefined,
        page: currentPage,
        pageSize,
      });
      
      // Limpiar formulario
      setNewImageUrl('');
      setShowImageForm(false);
      setImageProduct(null);
    } catch (err: any) {
      console.error("Error adding image:", err);
    }
  }

  // Función para eliminar imagen
  async function handleRemoveImage(imageId: string) {
    if (!confirm('Are you sure you want to remove this image?')) return;

    try {
      await fetch(`/api/product-images/${imageId}`, {
        method: 'DELETE',
      });
      
      // Si tenemos un producto seleccionado, actualizarlo
      if (selectedProduct) {
        const updatedProduct = await fetchProductById(selectedProduct.id);
        if (updatedProduct) {
          setSelectedProduct(updatedProduct);
        }
      }
      
      // Actualizar lista general
      fetchProducts({
        category: selectedCategory || undefined,
        page: currentPage,
        pageSize,
      });
      
      setShowImageForm(false);
      setImageProduct(null);
    } catch (err: any) {
      console.error("Error removing image:", err);
    }
  }

  // Función para abrir el formulario de imágenes
  function openImageForm(product: Product) {
    setImageProduct(product);
    setShowImageForm(true);
  }

  // Helper para obtener el nombre de la marca
  const getBrandName = (brandId: string) => {
    const brand = brands.find(b => b.id && b.id === brandId);
    return brand ? brand.name : 'Unknown Brand';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`${lusitana.className} text-2xl font-bold`}>Products Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowCreateForm(!showCreateForm);
          }}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          {showCreateForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Search:</label>
            <div className="flex">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Brand:</label>
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand?.id} value={brand?.id}>
                  {brand?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | '')}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value={ProductCategory.SNEAKERS}>Sneaker</option>
              <option value={ProductCategory.FORMAL}>Formal</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => {
              setSelectedBrandId('');
              setSelectedCategory('');
              setSearchQuery('');
              setCurrentPage(1);
              fetchProducts({ page: 1, pageSize });
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Create Product Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create New Product</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreateProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Product Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Brand:</label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData(prev => ({ ...prev, brandId: e.target.value }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a Brand</option>
                  {brands.map((brand) => (
                    <option key={brand?.id} value={brand?.id}>
                      {brand?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Price:</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Category:</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={ProductCategory.SNEAKERS}>Sneaker</option>
                  <option value={ProductCategory.FORMAL}>Formal</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Genre:</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value as Genre }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={Genre.MENS}>Male</option>
                  <option value={Genre.WOMENS}>Female</option>
                  <option value={Genre.KIDS}>Kids</option>
                  <option value={Genre.UNISEX}>Unisex</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Inventory:</label>
                <input
                  type="number"
                  min="0"
                  value={formData.inventory}
                  onChange={(e) => setFormData(prev => ({ ...prev, inventory: parseInt(e.target.value) }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Sale Price (Optional):</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salePrice || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    salePrice: e.target.value ? parseFloat(e.target.value) : null 
                  }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="featured">Featured</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={formData.isNew || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isNew">New Arrival</label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Product</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Product Name:</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Brand:</label>
                  <select
                    value={editFormData.brandId}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, brandId: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {brands.map((brand) => (
                      <option key={brand?.id} value={brand?.id}>
                        {brand?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Price:</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Category:</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={ProductCategory.SNEAKERS}>Sneaker</option>
                    <option value={ProductCategory.FORMAL}>Formal</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Genre:</label>
                  <select
                    value={editFormData.genre}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, genre: e.target.value as Genre }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={Genre.MENS}>Male</option>
                    <option value={Genre.WOMENS}>Female</option>
                    <option value={Genre.KIDS}>Kids</option>
                    <option value={Genre.UNISEX}>Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Sale Price:</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editFormData.salePrice || ''}
                    onChange={(e) => setEditFormData(prev => ({ 
                      ...prev, 
                      salePrice: e.target.value ? parseFloat(e.target.value) : null 
                    }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="edit-featured"
                      checked={editFormData.featured || false}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="edit-featured">Featured</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="edit-isNew"
                      checked={editFormData.isNew || false}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="edit-isNew">New Arrival</label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">Description:</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>

              {/* Product Images */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Product Images</h3>
                  <button
                    type="button"
                    onClick={() => openImageForm(selectedProduct)}
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm"
                  >
                    <PlusIcon className="w-4 h-4" /> Add Image
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    selectedProduct.images.map((image: ProductImage) => (
                      <div key={image.id} className="relative border rounded p-2 flex flex-col items-center">
                        <div className="h-24 w-24 bg-gray-100 flex items-center justify-center mb-2">
                          <img
                            src={image.url}
                            alt="Product"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-xs text-gray-500">Position: {Number(image.position) + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(image.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 py-4 flex flex-col items-center text-gray-500">
                      <PhotoIcon className="w-12 h-12 mb-2" />
                      <p>No images yet</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Image Modal */}
      {showImageForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Product Image</h2>
              <button
                onClick={() => {
                  setShowImageForm(false);
                  setImageProduct(null);
                  setNewImageUrl('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddImage}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Image URL:</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowImageForm(false);
                    setImageProduct(null);
                    setNewImageUrl('');
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products List with Virtual Scrolling for Performance */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {loading && products.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-gray-300 mb-4"></div>
              <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-300 rounded"></div>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <p>Error loading products: {error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No products found. Try adjusting your filters or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-4 bg-gray-100 rounded-md overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0].url} 
                              alt={product.name} 
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <PhotoIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description ? 
                              (product.description.length > 50 ? 
                                `${product.description.substring(0, 50)}...` : 
                                product.description) : 
                              'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.brand ? product.brand.name : getBrandName(product.brandId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.category === ProductCategory.SNEAKERS ? 
                          'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                      }`}>
                        {product.category}
                      </span>
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {product.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        {product.salePrice ? (
                          <>
                            <span className="text-sm font-medium text-gray-900">${product.salePrice.toFixed(2)}</span>
                            <span className="text-xs text-gray-500 line-through">${product.price.toFixed(2)}</span>
                            <span className="text-xs text-green-600">
                              {Math.round(((product.price - product.salePrice) / product.price) * 100)}% off
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {product.featured && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Featured
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            New
                          </span>
                        )}
                        {!product.featured && !product.isNew && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Standard
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => openImageForm(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Manage Images"
                      >
                        <PhotoIcon className="inline-block w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleSelectProduct(product)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Product"
                      >
                        <PencilIcon className="inline-block w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Product"
                      >
                        <TrashIcon className="inline-block w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!loading && products.length > 0 && pagination && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((pagination.page - 1) * pageSize) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pageSize, pagination.totalPages)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalPages}</span> products
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Generate page buttons */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    // Logic to center current page in pagination display
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={currentPage === pagination.totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === pagination.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Mobile Pagination */}
            <div className="flex sm:hidden items-center justify-between w-full">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'text-gray-300 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === pagination.totalPages ? 'text-gray-300 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}