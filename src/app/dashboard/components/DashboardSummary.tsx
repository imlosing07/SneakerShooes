'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/src/app/ui/fonts';
import {
  ArrowTrendingUpIcon,
  TagIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useProducts } from '@/src/app/lib/hooks/useProducts';
import { Product } from '@/src/types';

interface DashboardStats {
  totalBrands: number;
  totalProducts: number;
  lowInventoryProducts: number;
  outOfStockProducts: number;
  productsOnSale: number;
  newProducts: number;
  averagePrice: number;
  totalInventoryValue: number;
}

export default function DashboardSummary() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBrands: 0,
    totalProducts: 0,
    lowInventoryProducts: 0,
    outOfStockProducts: 0,
    productsOnSale: 0,
    newProducts: 0,
    averagePrice: 0,
    totalInventoryValue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        // Get brands count
        const res = await fetch('/api/brands');
        const data = await res.json();
        const brandsResponse = data.total;

        // Get products count
        
        const res1 = await fetch('/api/products');
        const data1 = await res1.json();
        const productsResponse = data1.data.meta.total;

        // Get all products with full details for calculations
        const products = data1.data.products as Product[];

        // Calculate inventory statistics
        let lowInventoryCount = 0;
        let outOfStockCount = 0;
        let productsOnSaleCount = 0;
        let newProductsCount = 0;
        let totalValue = 0;
        let totalPriceSum = 0;

        products.forEach(product => {
          // Calculate total inventory for this product
          const totalInventory = product.sizes.reduce((sum, size) => sum + size.inventory, 0);

          // Low inventory (less than 10 total units)
          if (totalInventory > 0 && totalInventory < 10) {
            lowInventoryCount++;
          }

          // Out of stock (0 inventory)
          if (totalInventory === 0) {
            outOfStockCount++;
          }

          // Products on sale
          if (product.salePrice && product.salePrice > 0) {
            productsOnSaleCount++;
          }

          // New products
          if (product.isNew) {
            newProductsCount++;
          }

          // Calculate inventory value
          const currentPrice = product.salePrice || product.price;
          totalValue += totalInventory * parseFloat(currentPrice.toString());

          // Sum for average price calculation
          totalPriceSum += parseFloat(product.price.toString());
        });

        const averagePrice = products.length > 0 ? totalPriceSum / products.length : 0;

        setStats({
          totalBrands: brandsResponse,
          totalProducts: productsResponse,
          lowInventoryProducts: lowInventoryCount,
          outOfStockProducts: outOfStockCount,
          productsOnSale: productsOnSaleCount,
          newProducts: newProductsCount,
          averagePrice: averagePrice,
          totalInventoryValue: totalValue,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const primaryStats = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: ShoppingBagIcon,
      color: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-600',
      description: 'Products in catalog'
    },
    {
      title: 'Total Brands',
      value: stats.totalBrands,
      icon: TagIcon,
      color: 'bg-purple-100 text-purple-800',
      iconColor: 'text-purple-600',
      description: 'Active brands'
    },
    {
      title: 'Inventory Value',
      value: `$${stats.totalInventoryValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-100 text-green-800',
      iconColor: 'text-green-600',
      description: 'Total stock value'
    },
    {
      title: 'Average Price',
      value: `$${stats.averagePrice.toFixed(2)}`,
      icon: ChartBarIcon,
      color: 'bg-indigo-100 text-indigo-800',
      iconColor: 'text-indigo-600',
      description: 'Average product price'
    },
  ];

  const alertStats = [
    {
      title: 'Out of Stock',
      value: stats.outOfStockProducts,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-100 text-red-800',
      iconColor: 'text-red-600',
      description: 'Need immediate restock',
      priority: 'high'
    },
    {
      title: 'Low Inventory',
      value: stats.lowInventoryProducts,
      icon: ArrowTrendingUpIcon,
      color: 'bg-orange-100 text-orange-800',
      iconColor: 'text-orange-600',
      description: 'Less than 10 units',
      priority: 'medium'
    },
    {
      title: 'On Sale',
      value: stats.productsOnSale,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-100 text-yellow-800',
      iconColor: 'text-yellow-600',
      description: 'Products with discount',
      priority: 'info'
    },
    {
      title: 'New Products',
      value: stats.newProducts,
      icon: SparklesIcon,
      color: 'bg-emerald-100 text-emerald-800',
      iconColor: 'text-emerald-600',
      description: 'Recently added',
      priority: 'info'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`${lusitana.className} text-2xl font-bold`}>Dashboard Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Primary Statistics */}
          <div>
            <h3 className={`${lusitana.className} text-lg font-semibold mb-4 text-gray-700`}>
              Business Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {primaryStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.title}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className={`${lusitana.className} mt-2 text-2xl font-bold`}>
                            {stat.value}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
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
          </div>

          {/* Inventory Alerts */}
          <div>
            <h3 className={`${lusitana.className} text-lg font-semibold mb-4 text-gray-700`}>
              Inventory Alerts & Updates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {alertStats.map((stat) => {
                const Icon = stat.icon;
                const isAlert = stat.priority === 'high' || stat.priority === 'medium';

                return (
                  <div
                    key={stat.title}
                    className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${stat.priority === 'high' ? 'border-l-red-500' :
                      stat.priority === 'medium' ? 'border-l-orange-500' :
                        'border-l-gray-300'
                      } hover:shadow-lg transition-shadow`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            {isAlert && stat.value > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Action needed
                              </span>
                            )}
                          </div>
                          <p className={`${lusitana.className} mt-2 text-2xl font-bold`}>
                            {stat.value}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
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
          </div>
        </>
      )}

    </div>
  );
}