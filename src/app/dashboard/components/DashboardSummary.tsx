'use client';

import { useState, useEffect } from 'react';
import { brandApiClient } from '@/src/app/lib/api/brand-client';
import { productApiClient } from '@/src/app/lib/api/product-client';
import { lusitana } from '@/src/app/ui/fonts';
import { ArrowTrendingUpIcon, TagIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function DashboardSummary() {
  const [stats, setStats] = useState({
    totalBrands: 0,
    totalProducts: 0,
    lowInventory: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        
        // Get brands count
        const brandsResponse = await brandApiClient.getAllBrands(1, 1);
        
        // Get products count
        const productsResponse = await productApiClient.getAllProducts(1, 1);
        
        // Get low inventory products (assuming inventory < 10 is considered low)
        const lowInventoryResponse = await productApiClient.getAllProducts(1, 1000, undefined, undefined);
        const lowInventoryCount = lowInventoryResponse.products.filter(product => 
          product.sizes.length < 10
        ).length;
        
        setStats({
          totalBrands: brandsResponse.pagination.total,
          totalProducts: productsResponse.pagination.total,
          lowInventory: lowInventoryCount,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Brands',
      value: stats.totalBrands,
      icon: TagIcon,
      color: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: ShoppingBagIcon,
      color: 'bg-green-100 text-green-800',
      iconColor: 'text-green-600',
    },
    {
      title: 'Low Inventory Items',
      value: stats.lowInventory,
      icon: ArrowTrendingUpIcon,
      color: 'bg-red-100 text-red-800',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className={`${lusitana.className} text-2xl font-bold`}>Dashboard Overview</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-32 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className={`${lusitana.className} mt-2 text-3xl font-bold`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="p-6">
          <h3 className={`${lusitana.className} text-xl font-semibold mb-4`}>Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/dashboard/brands" 
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <TagIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium">Manage Brands</h4>
                <p className="text-sm text-gray-600">Add, edit or remove brands</p>
              </div>
            </a>
            <a 
              href="/dashboard/products" 
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ShoppingBagIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium">Manage Products</h4>
                <p className="text-sm text-gray-600">Add, edit or remove products</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}