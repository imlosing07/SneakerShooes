'use client';

import { useState } from 'react';
import { lusitana } from '@/src/app/ui/fonts';
import { 
  HomeIcon, 
  TagIcon, 
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import BrandsComponent from '../components/BrandsComponent';
import DashboardSummary from '../components/DashboardSummary';
import ProductsComponent from '../components/ProductsComponent';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Resumen', icon: HomeIcon, component: <DashboardSummary /> },
    { name: 'Marcas', icon: TagIcon, component: <BrandsComponent /> },
    { name: 'Productos', icon: ShoppingBagIcon, component: <ProductsComponent /> },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header fijo más compacto */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className={`${lusitana.className} py-4 text-xl sm:text-2xl font-semibold`}>
            Dashboard
          </h1>
          
          {/* Tabs más compactos y responsive */}
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(idx)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                    border-b-2 transition-colors
                    ${activeTab === idx 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenido con padding reducido */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {tabs[activeTab].component}
      </div>
    </main>
  );
}