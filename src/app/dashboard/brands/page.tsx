// dashboard/brands/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Brand } from '@/src/types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/src/app/ui/fonts';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('');

  // Selected brand for editing
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [editName, setEditName] = useState('');
  const [editLogo, setEditLogo] = useState('');

  // Fetch brands on page load and when pagination changes
  useEffect(() => {
    fetchBrands();
  }, [pagination.page]);

  async function fetchBrands() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/brands?page=${pagination.page}&pageSize=${pagination.pageSize}`);
      if (!res.ok) throw new Error('Failed to fetch brands');
      const data = await res.json();
      setBrands(data.brands);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBrand(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName, logoUrl: newBrandLogo }),
      });
      if (!res.ok) throw new Error('Failed to create brand');
      // Reset form
      setNewBrandName('');
      setNewBrandLogo('');
      setShowCreateForm(false);
      // Refresh list
      fetchBrands();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectBrand(brand: Brand) {
    setSelectedBrand(brand);
    setEditName(brand.name);
    setEditLogo(brand.logoUrl || '');
  }

  async function handleUpdateBrand(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBrand) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/brands/${selectedBrand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, logoUrl: editLogo }),
      });
      if (!res.ok) throw new Error('Failed to update brand');
      // Reset edit form
      setSelectedBrand(null);
      // Refresh list
      fetchBrands();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteBrand(id: string) {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete brand');
      // Refresh list
      fetchBrands();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`${lusitana.className} text-2xl font-bold`}>Brands Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          {showCreateForm ? 'Cancel' : 'Add Brand'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create Brand Form */}
      {showCreateForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Create New Brand</h2>
          <form onSubmit={handleCreateBrand}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Brand Name:</label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Logo URL:</label>
                <input
                  type="text"
                  value={newBrandLogo}
                  onChange={(e) => setNewBrandLogo(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Brand'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Brand Modal */}
      {selectedBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Brand</h2>
            <form onSubmit={handleUpdateBrand}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Brand Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Logo URL:</label>
                <input
                  type="text"
                  value={editLogo}
                  onChange={(e) => setEditLogo(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedBrand(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brands List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading && !brands.length ? (
            <div className="p-8 text-center text-gray-500">Loading brands...</div>
          ) : brands.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{brand.name}</td>
                    <td className="px-6 py-4">{brand.logoUrl || 'No logo'}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`/dashboard/products?brandId=${brand.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View Products
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleSelectBrand(brand)}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                        title="Edit Brand"
                      >
                        <PencilIcon className="h-5 w-5 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Brand"
                      >
                        <TrashIcon className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">No brands found.</div>
          )}
        </div>

        {/* Pagination */}
        {brands.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1 || loading}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${pagination.page <= 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages || loading}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${pagination.page >= pagination.totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{brands.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.pageSize, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page <= 1 || loading}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${pagination.page <= 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= pagination.totalPages || loading}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${pagination.page >= pagination.totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}