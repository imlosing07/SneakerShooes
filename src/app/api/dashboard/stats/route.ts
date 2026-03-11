import { NextResponse } from 'next/server';
import { prismaClientGlobal as prisma } from '@/src/app/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parallel execution of counts for better performance
    const [totalProducts, totalBrands, products, productsOnSaleCount, newProductsCount] = await Promise.all([
      prisma.product.count(),
      prisma.brand.count(),
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          salePrice: true,
          isNew: true,
          sizes: {
            select: {
              inventory: true
            }
          }
        }
      }),
      prisma.product.count({
        where: {
          salePrice: {
            gt: 0
          }
        }
      }),
      prisma.product.count({
        where: {
          isNew: true
        }
      })
    ]);

    // Calculate out of stock products
    const outOfStockProducts = products.filter(product => {
      const totalInventory = product.sizes.reduce((sum, size) => sum + size.inventory, 0);
      return totalInventory === 0;
    });

    return NextResponse.json({
      totalProducts,
      totalBrands,
      outOfStockCount: outOfStockProducts.length,
      productsOnSale: productsOnSaleCount,
      newProducts: newProductsCount,
      lowStockAlerts: outOfStockProducts.map(p => ({
        id: p.id,
        name: p.name
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
