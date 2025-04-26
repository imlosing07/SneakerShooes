// types.ts

import { Genre, ProductCategory } from "@prisma/client";


// Entidades relacionadas
export interface Size {
  id: string;
  productId: string;
  value: string;
  inventory: number;
}

export interface ProductImage {
  id: string;
  url: string;
  position: number;
  productId: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Entidad principal de producto
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  category: ProductCategory;
  genre: Genre;
  sizes: Size[];
  price: number;
  salePrice?: number | null;
  featured: boolean;
  isNew: boolean;
  brandId: string;
  brand?: Brand;
  images: ProductImage[];
  wishlistItems?: any[];
  createdAt: Date;
  updatedAt: Date;
}

// DTO específico para creación - solo incluye lo necesario
export interface CreateProductDTO {
  name: string;
  description?: string | null;
  category: ProductCategory;
  genre: Genre;
  price: number;
  salePrice?: number | null;
  featured?: boolean;
  isNew?: boolean;
  brandId: string;
  
  // Arrays anidados más simples
  images: {
    url: string;
    position: number;
  }[];
  
  sizes: {
    value: string;
    inventory: number;
  }[];
}

// DTO para actualización - todo opcional excepto ID
export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  category?: ProductCategory;
  genre?: Genre;
  price?: number;
  salePrice?: number | null;
  featured?: boolean;
  isNew?: boolean;
  brandId?: string;
  
  // Opcional para actualizaciones parciales
  images?: {
    id?: string;  // Para actualizar existentes
    url: string;
    position: number;
  }[];
  
  sizes?: {
    id?: string;  // Para actualizar existentes
    value: string;
    inventory: number;
  }[];
}

// DTO para consultas y filtros
export interface ProductQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  category?: ProductCategory;
  genre?: Genre;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  isNew?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Respuesta paginada
export interface PaginatedProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
  
  // Tipos para los filtros
  export interface Filters {
    brand: string;
    priceRange: string;
    color: string;
    isOnSale: boolean;
  }
  
  // Props para cada componente
  export interface SidebarFiltersProps {
    filters: Filters;
    onFilterChange: (filterName: string, value: string | boolean) => void;
    brands: string[];
    colors: string[];
  }
  
  export interface ProductGridProps {
    products: Product[];
    searchTerm: string;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    resultsCount: number;
  }
  
  export interface ProductCardProps {
    product: Product;
  }
  
  export interface ProductCatalogProps {
    products: Product[];
  }