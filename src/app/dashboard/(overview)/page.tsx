'use client';

import { useState } from 'react';
import { lusitana } from '@/src/app/ui/fonts';
import { Tab } from '@headlessui/react';
import { 
  HomeIcon, 
  TagIcon, 
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import BrandsComponent from '../components/BrandsComponent';
import DashboardSummary from '../components/DashboardSummary';
import ProductsComponent from '../components/ProductsComponent';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabs = [
    { name: 'Overview', icon: HomeIcon, component: <DashboardSummary /> },
    { name: 'Brands', icon: TagIcon, component: <BrandsComponent /> },
    { name: 'Products', icon: ShoppingBagIcon, component: <ProductsComponent /> },
  ];

  return (
    <main className="flex-1 space-y-4">
      <h1 className={`${lusitana.className} mb-6 text-2xl md:text-3xl font-semibold`}>
        Dashboard
      </h1>

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow text-blue-700'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </div>
              </Tab>
            );
          })}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white p-6 shadow',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none'
              )}
            >
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </main>
  );
}