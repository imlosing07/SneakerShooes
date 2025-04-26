// app/lib/api/product-client.ts
import { Product } from '@/domain/product/product.entity';
import { ProductCategory } from '@prisma/client';

// Define types for API responses
interface ProductApiResponse {
  product: Product;
}

interface ProductsApiResponse {
  products: Product[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Product API client
export const productApiClient = {
  // Get all products with pagination
  async getAllProducts(
    page: number = 1,
    pageSize: number = 10,
    category?: ProductCategory,
    brandId?: string
  ): Promise<ProductsApiResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    if (category) {
      queryParams.append('category', category);
    }

    if (brandId) {
      queryParams.append('brandId', brandId);
    }

    const response = await fetch(`/api/products?${queryParams.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch products');
    }

    return response.json();
  },

  // Get a single product by ID
  async getProduct(id: string) {
    const response = await fetch(`/api/products/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch product');
    }

    return response.json();
  },

  // Create a new product
  async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    inventory: number;
    brandId: string;
  }): Promise<ProductApiResponse> {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create product');
    }

    return response.json();
  },

  // Update an existing product
  async updateProduct(
    id: string,
    productData: Partial<{
      name: string;
      description: string;
      price: number;
      category: ProductCategory;
      inventory: number;
      brandId: string;
    }>
  ): Promise<ProductApiResponse> {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product');
    }

    return response.json();
  },

  // Delete a product
  async deleteProduct(id: string): Promise<boolean> {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete product');
    }

    return true;
  },

  // Add an image to a product
  async addProductImage(
    productId: string,
    imageUrl: string,
    position: number
  ): Promise<ProductApiResponse> {
    const response = await fetch(`/api/products/${productId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl, position }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add product image');
    }

    return response.json();
  },

  // Remove an image from a product
  async removeProductImage(imageId: string): Promise<ProductApiResponse> {
    const response = await fetch(`/api/product-images/${imageId}`, {
      method: 'DELETE',
    });

    console.log(response);

    if (!response.ok) {
      console.error('Failed to remove product image:', response.statusText);
    }

    return response.json();
  },

  // Reorder product images
  async reorderProductImages(
    productId: string,
    imagePositions: { id: string; position: number }[]
  ): Promise<ProductApiResponse> {
    const response = await fetch(`/api/products/${productId}/images/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imagePositions }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reorder product images');
    }

    return response.json();
  },
};