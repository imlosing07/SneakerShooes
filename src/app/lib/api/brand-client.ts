// /app/lib/api/brand-client.ts
import { Brand, CreateBrandDTO, UpdateBrandDTO } from '@/domain/brand/brand.entity';

interface PaginatedResponse<T> {
  brands: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export const brandApiClient = {
  // Get all brands with pagination
  async getAllBrands(page = 1, pageSize = 10): Promise<PaginatedResponse<Brand>> {
    try {
      const response = await fetch(`/api/brands?page=${page}&pageSize=${pageSize}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch brands');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching brands:', error);
      throw new Error(error.message || 'Failed to fetch brands');
    }
  },

  // Get a single brand by ID
  async getBrand(id: string): Promise<Brand> {
    try {
      const response = await fetch(`/api/brands/${id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch brand');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`Error fetching brand ${id}:`, error);
      throw new Error(error.message || 'Failed to fetch brand');
    }
  },

  // Create a new brand
  async createBrand(data: CreateBrandDTO): Promise<Brand> {
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create brand');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error creating brand:', error);
      throw new Error(error.message || 'Failed to create brand');
    }
  },

  // Update an existing brand
  async updateBrand(id: string, data: UpdateBrandDTO): Promise<Brand> {
    try {
      const response = await fetch(`/api/brands/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update brand');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`Error updating brand ${id}:`, error);
      throw new Error(error.message || 'Failed to update brand');
    }
  },

  // Delete a brand
  async deleteBrand(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete brand');
      }
    } catch (error: any) {
      console.error(`Error deleting brand ${id}:`, error);
      throw new Error(error.message || 'Failed to delete brand');
    }
  },

  // Search brands by name
  async searchBrands(query: string): Promise<Brand[]> {
    try {
      const response = await fetch(`/api/brands/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to search brands');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error searching brands:', error);
      throw new Error(error.message || 'Failed to search brands');
    }
  },

  // Get brands with products
  async getBrandsWithProducts(): Promise<Brand[]> {
    try {
      const response = await fetch('/api/brands/with-products');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch brands with products');
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error fetching brands with products:', error);
      throw new Error(error.message || 'Failed to fetch brands with products');
    }
  }
};