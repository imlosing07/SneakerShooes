// types.ts
import { ProductCategory, Genre } from '@/src/app/lib/constants/product-constants';

export interface Category {
  name: string;
  navigationName?: string;
  imagenDesktop: string;
  imagenMobile: string;
}

export const CATEGORIES: Category[] = [
  {
    name: 'Hombre',
    navigationName: 'hombre',
    imagenDesktop: 'categoryImages/desktopMen.jpg',
    imagenMobile: 'categoryImages/mobileMen.jpg',
  },
  {
    name: 'Mujer',
    navigationName: 'mujer',
    imagenDesktop: 'categoryImages/desktopWomen.webp',
    imagenMobile: 'categoryImages/mobileWomen.webp',
  },
  {
    name: 'Niños',
    navigationName: 'ninos',
    imagenDesktop: 'categoryImages/desktopChildren.webp',
    imagenMobile: 'categoryImages/mobileChildren.webp',
  },
  {
    name: 'Formal',
    navigationName: 'formal',
    imagenDesktop: 'categoryImages/desktopFormal.webp',
    imagenMobile: 'categoryImages/mobileFormal.webp',
  }
];

// Entidades relacionadas
export interface Size {
  id: string;
  productId: string;
  value: string;
  inventory: number;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Corregido según schema Prisma
export interface ProductImage {
  id: string;
  productId: string;
  originalUrl: string;   // Imagen de alta calidad (2000px)
  standardUrl: string;   // Imagen estándar (600-840px)
  publicId: string;      // ID público en Cloudinary
  isMain: boolean;       // Indica si es la imagen principal
  createdAt: Date;
  updatedAt: Date;
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

// ✅ DTO para creación - SIN imágenes
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
  sizes: {
    value: string;
    inventory: number;
  }[];
}

// ✅ DTO para agregar imagen a producto existente
export interface AddProductImageDTO {
  originalUrl: string;
  standardUrl: string;
  publicId: string;
  // isMain se calcula automáticamente
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

  // ✅ Eliminamos images de aquí - se maneja por separado
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
  products: Product[];
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