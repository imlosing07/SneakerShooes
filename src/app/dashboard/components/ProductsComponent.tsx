'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/src/app/lib/hooks/useProducts';
import { Brand, Product } from '@/src/types';
import {
  ProductCategory,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS
} from '@/src/app/lib/constants/product-constants';
import { PlusIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/src/app/ui/fonts';
import ProductForm from './subcomponents/ProductForm';
import ProductsTable from './subcomponents/ProductTable';

export default function ProductsComponent() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    productsData,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    searchProducts: searchProductsHook,
  } = useProducts({
    initialPage: currentPage,
    initialPageSize: pageSize,
    fetchOnMount: false,
  });

  const products = productsData?.products || [];
  const pagination = productsData?.meta || null;

  useEffect(() => {
    fetchProducts({
      category: selectedCategory || undefined,
      brandId: selectedBrandId || undefined,
      page: currentPage,
      pageSize,
      query: searchQuery || undefined,
    });
  }, [currentPage, selectedCategory, selectedBrandId, searchQuery]);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch('/api/brands');
        const data = await res.json();
        setBrands(data.brands || data.data || []);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      }
    }
    fetchBrands();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    if (searchQuery.trim()) {
      searchProductsHook(searchQuery);
    } else {
      fetchProducts({
        category: selectedCategory || undefined,
        brandId: selectedBrandId || undefined,
        page: 1,
        pageSize,
      });
    }
  };

  async function handleCreate(data: any) {
    try {
      const payload = {
        name: data.name,
        description: data.description || null,
        price: data.price,
        salePrice: data.salePrice || null,
        category: data.category,
        genre: data.genre,
        brandId: data.brandId,
        featured: data.featured || false,
        isNew: data.isNew ?? true,
        sizes: data.sizes || []
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const result = await response.json();
      const newProduct = result.data || result;

      if (data.imageUrls && data.imageUrls.length > 0) {
        
        for (const url of data.imageUrls) {
          try {
            const imageResponse = await fetch('/api/images/process-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url,
                folder: 'products'
              }),
            });

            if (!imageResponse.ok) {
              console.error('Failed to process image URL:', url);
              continue;
            }

            const imageData = await imageResponse.json();

            await fetch(`/api/products/${newProduct.id}/images`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                originalUrl: imageData.data.originalUrl,
                standardUrl: imageData.data.standardUrl,
                publicId: imageData.data.publicId
              }),
            });
          } catch (error) {
            console.error('Error adding image to product:', error);
          }
        }
      }

      await fetchProducts({
        category: selectedCategory || undefined,
        brandId: selectedBrandId || undefined,
        page: currentPage,
        pageSize,
      });

      setShowForm(false);
      alert('Product created successfully!');
    } catch (err: any) {
      console.error("Error creating product:", err);
      alert(`Error creating product: ${err.message}`);
    }
  }

  async function handleUpdate(data: any) {
    if (!selectedProduct) {
      console.error('❌ No selected product for update');
      return;
    }

    try {
      const payload = {
        name: data.name,
        description: data.description || null,
        price: data.price,
        salePrice: data.salePrice || null,
        category: data.category,
        genre: data.genre,
        brandId: data.brandId,
        featured: data.featured || false,
        isNew: data.isNew ?? true,
        sizes: data.sizes || []
      };

      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      if (data.imageUrls && data.imageUrls.length > 0) {
        const currentImageUrls = selectedProduct.images?.map(img => img.standardUrl) || [];
        const newImageUrls = data.imageUrls.filter((url: string) => !currentImageUrls.includes(url));

        for (const url of newImageUrls) {
          try {
            const imageResponse = await fetch('/api/images/process-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url,
                folder: 'products'
              }),
            });

            if (!imageResponse.ok) continue;

            const imageData = await imageResponse.json();

            await fetch(`/api/products/${selectedProduct.id}/images`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                originalUrl: imageData.data.originalUrl,
                standardUrl: imageData.data.standardUrl,
                publicId: imageData.data.publicId
              }),
            });
          } catch (error) {
            console.error('Error adding image to product:', error);
          }
        }
      }

      await fetchProducts({
        category: selectedCategory || undefined,
        brandId: selectedBrandId || undefined,
        page: currentPage,
        pageSize,
      });

      setSelectedProduct(null);
      setShowForm(false);
      alert('Product updated successfully!');
    } catch (err: any) {
      console.error("Error updating product:", err);
      alert(`Error updating product: ${err.message}`);
    }
  }

  async function handleSelectProduct(product: Product) {
    try {

      const fullProduct = await fetch(`/api/products/${product.id}`).then(res => res.json()).then(data => data.data || data);
      
      if (!fullProduct) {
        throw new Error('No product data received');
      }

      setSelectedProduct(fullProduct);
      setShowForm(true);
    } catch (err: any) {
      console.error("❌ Error in handleSelectProduct:", err);
      alert(`Error loading product: ${err.message}`);
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await fetchProducts({
        category: selectedCategory || undefined,
        brandId: selectedBrandId || undefined,
        page: currentPage,
        pageSize,
      });

      alert('Product deleted successfully!');
    } catch (err: any) {
      console.error("Error deleting product:", err);
      alert(`Error deleting product: ${err.message}`);
    }
  }

  function handleManageImages(product: Product) {
    handleSelectProduct(product);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`${lusitana.className} text-2xl font-bold`}>
          Products Management
        </h2>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          {showForm ? 'Cancel' : 'Add Product'}
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
                <option key={brand.id} value={brand.id}>
                  {brand.name}
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
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {PRODUCT_CATEGORY_LABELS[category]}
                </option>
              ))}
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

      {/* Product Form (Create/Edit) */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <ProductForm
            key={selectedProduct?.id || 'new-product'} // ← CRÍTICO: Fuerza re-render
            brands={brands}
            initialData={selectedProduct}
            onSubmit={selectedProduct ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setSelectedProduct(null);
            }}
            loading={loading}
            isEdit={!!selectedProduct}
          />
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <ProductsTable
          products={products}
          loading={loading}
          onEdit={handleSelectProduct}
          onDelete={handleDeleteProduct}
          onManageImages={handleManageImages}
        />

        {/* Pagination */}
        {!loading && products.length > 0 && pagination && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={pagination.page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}