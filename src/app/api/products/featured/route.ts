import { NextRequest, NextResponse } from "next/server";

// GET /api/products/featured: Productos destacados
export async function GET_FEATURED(request: NextRequest) {
    try {
      const products = await productService.getFeaturedProducts();
      return NextResponse.json({ products });
    } catch (error) {
      console.error('Error in GET /api/products/featured:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  
  
  