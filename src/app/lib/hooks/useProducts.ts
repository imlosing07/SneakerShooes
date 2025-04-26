//lib/hooks/useProduct.ts
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/domain/product/product.entity';


interface PaginatedResponse<T> {
  products: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface UseProductsOptions {
  initialCategory?: string;
  initialPage?: number;
  initialPageSize?: number;
  fetchOnMount?: boolean;
}

interface FetchProductsParams {
  category?: string;
  page?: number;
  pageSize?: number;
  query?: string;
}

export function useProducts(options: UseProductsOptions = {}): {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null;
  fetchProducts: (params?: FetchProductsParams) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  featured: Product[];
  newArrivals: Product[];
  fetchFeatured: () => Promise<void>;
  fetchNewArrivals: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
} {
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null>(null);

  // Función para obtener productos con parámetros
  const fetchProducts = useCallback(async (params: FetchProductsParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir la URL con parámetros de consulta
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.set('category', params.category);
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());
      if (params.query) searchParams.set('query', params.query);
      
      const queryString = searchParams.toString();
      const url = `/api/products${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: PaginatedResponse<Product> = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para obtener un producto por ID
  const fetchProductById = useCallback(async (id: string): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      return data.product;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para obtener productos destacados
  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Ajusta esta URL según cómo implementes la funcionalidad de productos destacados
      const response = await fetch('/api/products?featured=true&pageSize=8');
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }
      
      const data = await response.json();
      setFeatured(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para obtener nuevos productos
  const fetchNewArrivals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Ajusta esta URL según cómo implementes la funcionalidad de nuevos productos
      const response = await fetch('/api/products?sort=createdAt&order=desc&pageSize=8');
      
      if (!response.ok) {
        throw new Error('Failed to fetch new arrivals');
      }
      
      const data = await response.json();
      setNewArrivals(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para buscar productos
  const searchProducts = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search products');
      }
      
      const data = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar productos automáticamente si se especifica
  useEffect(() => {
    if (options.fetchOnMount) {
      fetchProducts({
        category: options.initialCategory,
        page: options.initialPage || 1,
        pageSize: options.initialPageSize || 10
      });
    }
  }, [options.fetchOnMount, options.initialCategory, options.initialPage, options.initialPageSize, fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProductById,
    featured,
    newArrivals,
    fetchFeatured,
    fetchNewArrivals,
    searchProducts
  };
}