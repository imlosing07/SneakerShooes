'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/src/app/ui/fonts';
import {
  TagIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { Product } from '@/src/types';
import TopFavoriteProducts from './analytics/TopFavoriteProducts';
import TopBrandsChart from './analytics/TopBrandsChart';

interface DashboardStats {
  totalBrands: number;
  totalProducts: number;
  outOfStockCount: number;
  productsOnSale: number;
  newProducts: number;
  lowStockAlerts: { id: string; name: string }[];
}

export default function DashboardSummary() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBrands: 0,
    totalProducts: 0,
    outOfStockCount: 0,
    productsOnSale: 0,
    newProducts: 0,
    lowStockAlerts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/dashboard/stats');
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const quickStats = [
    {
      title: 'Total Productos',
      value: stats.totalProducts,
      icon: ShoppingBagIcon,
      color: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Marcas',
      value: stats.totalBrands,
      icon: TagIcon,
      color: 'bg-purple-100 text-purple-800',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Sin Stock',
      value: stats.outOfStockCount,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-100 text-red-800',
      iconColor: 'text-red-600',
    },
  ];

  const alertStats = [
    {
      title: 'En Oferta',
      value: stats.productsOnSale,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-100 text-yellow-800',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Nuevos',
      value: stats.newProducts,
      icon: SparklesIcon,
      color: 'bg-emerald-100 text-emerald-800',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`${lusitana.className} text-xl sm:text-2xl font-bold text-gray-800`}>Resumen General</h2>
        <div className="text-xs sm:text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border">
          {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow-sm">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-3" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white animate-pulse h-28 rounded-xl border"></div>
            ))}
          </div>
          <div className="bg-white animate-pulse h-80 rounded-xl border"></div>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                        <p className={`${lusitana.className} mt-1 text-2xl sm:text-3xl font-extrabold text-gray-900`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.color} shadow-inner`}>
                        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Top Favorites */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <TopFavoriteProducts />
              </div>

              {/* Top Brands */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <TopBrandsChart />
              </div>
            </div>

            {/* Sidebar Alerts */}
            <div className="space-y-6">
              {/* Alert Stats */}
              <div className="grid grid-cols-2 gap-4">
                {alertStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.title}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="p-4">
                        <div className={`p-2 w-fit rounded-lg ${stat.color} mb-3`}>
                          <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                        </div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                        <p className={`${lusitana.className} mt-1 text-xl font-bold text-gray-900`}>
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stock Alerts Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    Alertas de Stock
                  </h3>
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                    {stats.lowStockAlerts.length}
                  </span>
                </div>
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  {stats.lowStockAlerts.length > 0 ? (
                    <div className="divide-y">
                      {stats.lowStockAlerts.map((product) => (
                        <div key={product.id} className="p-3 hover:bg-red-50 transition-colors rounded-lg flex items-center justify-between group">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-red-500 font-semibold">Sin existencias</p>
                          </div>
                          <button 
                            onClick={() => window.location.href = `/dashboard?tab=productos&id=${product.id}`}
                            className="text-xs text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-2"
                          >
                            Gestionar
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500 italic">
                      No hay productos sin stock. ¡Buen trabajo!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}