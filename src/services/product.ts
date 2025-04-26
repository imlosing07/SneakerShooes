// src/services/product.ts
import { prismaClientGlobal } from '@/src/app/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  CreateProductDTO,
  ProductQueryDTO,
  PaginatedProductsResponse,
  UpdateProductDTO,
  Product
} from '@/src/types';


export async function getProducts(options: ProductQueryDTO): Promise<PaginatedProductsResponse> {
  const {
    page = 1,
    limit = 10,
    category,
    genre,
    brandId,
    search,
    minPrice,
    maxPrice,
    featured,
    isNew,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  // Construir el objeto de filtros
  const where: Prisma.ProductWhereInput = {};

  if (category) where.category = category;
  if (genre) where.genre = genre;
  if (brandId) where.brandId = brandId;
  if (featured !== undefined) where.featured = featured;
  if (isNew !== undefined) where.isNew = isNew;

  // Filtros de precio
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Búsqueda por texto
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Configurar el ordenamiento
  const orderBy: Prisma.ProductOrderByWithRelationInput = {
    [sortBy]: sortOrder
  };

  try {
    // Ejecutar consultas en paralelo para mejorar rendimiento
    const [products] = await Promise.all([
      prismaClientGlobal.product.findMany({
        where,
        include: {
          brand: true,
          images: {
            orderBy: { position: 'asc' }
          },
          sizes: {
            orderBy: { value: 'asc' }
          }
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy
      })
    ]);

    const total = await prismaClientGlobal.product.count({ where });

    console.log('Products found:', products); // Verifica el resultado aquí

    return {
      data: products.map(transformProductFromDB),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const result = await prismaClientGlobal.product.findUnique({
      where: { id },
      include: {
        brand: true,
        images: {
          orderBy: { position: 'asc' }
        },
        sizes: {
          orderBy: { value: 'asc' }
        }
      }
    });

    const newResult = transformProductFromDB(result); // Transformar el producto para asegurar que los precios son números

    console.log('Product found:', result); // Verifica el resultado aquí
    return newResult;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error(`Failed to fetch product ${id}`);
  }
}

export async function createProduct(data: CreateProductDTO): Promise<Product> {
  try {
    const result = await prismaClientGlobal.product.create({
      data: {
        name: data.name,
        description: data.description || null,
        category: data.category,
        genre: data.genre,
        price: data.price,
        salePrice: data.salePrice || null,
        featured: data.featured,
        isNew: data.isNew,
        brandId: data.brandId,
        images: {
          create: data.images.map(img => ({
            url: img.url,
            position: img.position
          }))
        },
        sizes: {
          create: data.sizes.map(size => ({
            value: size.value,
            inventory: size.inventory
          }))
        }
      },
      include: {
        brand: true,
        images: { orderBy: { position: 'asc' } },
        sizes: { orderBy: { value: 'asc' } }
      }
    });

    return transformProductFromDB(result); // Transformar el producto para asegurar que los precios son números
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('A product with this name already exists');
      }
    }
    throw new Error('Failed to create product');
  }
}

export async function updateProduct(id: string, data: UpdateProductDTO): Promise<Product> {
  const { images, sizes, ...productData } = data;

  try {
    // Iniciamos una transacción para gestionar relaciones
    return await prismaClientGlobal.$transaction(async (prisma) => {
      // 1. Actualizar datos básicos del producto
      await prisma.product.update({
        where: { id },
        data: productData,
        include: {
          brand: true,
          images: true,
          sizes: true
        }
      });

      // 2. Actualizar imágenes si se proporcionan
      if (images && images.length > 0) {
        for (const image of images) {
          await prisma.productImage.upsert({
            where: {
              productId_position: {
                productId: id,
                position: image.position,
              },
            },
            update: {
              url: image.url
            },
            create: {
              url: image.url,
              position: image.position,
              productId: id
            }
          });
        }
      }


      // 3. Actualizar tallas si se proporcionan
      if (sizes && sizes.length > 0) {
        for (const size of sizes) {
          await prisma.size.upsert({
            where: {
              productId_value: {
                productId: id,
                value: size.value,
              }
            },
            update: {
              inventory: size.inventory
            },
            create: {
              value: size.value,
              inventory: size.inventory,
              productId: id
            }
          });
        }
      }


      // 4. Obtener el producto actualizado con todas sus relaciones
      const result = await prisma.product.findUnique({
        where: { id },
        include: {
          brand: true,
          images: { orderBy: { position: 'asc' } },
          sizes: { orderBy: { value: 'asc' } }
        }
      });

      return transformProductFromDB(result); // Transformar el producto para asegurar que los precios son números
    });
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw new Error(`Failed to update product ${id}`);
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prismaClientGlobal.product.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new Error(`Product with ID ${id} not found`);
      }
    }
    throw new Error(`Failed to delete product ${id}`);
  }
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  try {
    const result = await prismaClientGlobal.product.findMany({
      where: { featured: true },
      take: limit,
      include: {
        brand: true,
        images: { orderBy: { position: 'asc' } },
        sizes: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return result.map(transformProductFromDB); // Transformar el producto para asegurar que los precios son números
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw new Error('Failed to fetch featured products');
  }
}

export async function getNewProducts(limit = 8): Promise<Product[]> {
  try {
    const result = await prismaClientGlobal.product.findMany({
      where: { isNew: true },
      take: limit,
      include: {
        brand: true,
        images: { orderBy: { position: 'asc' } },
        sizes: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return result.map(transformProductFromDB); // Transformar el producto para asegurar que los precios son números
  } catch (error) {
    console.error('Error fetching new products:', error);
    throw new Error('Failed to fetch new products');
  }
}

// Función helper de transformación
function transformProductFromDB(product: any): Product {
  return {
    ...product,
    price: parseFloat(product.price.toString()),
    salePrice: product.salePrice ? parseFloat(product.salePrice.toString()) : null
  };
}