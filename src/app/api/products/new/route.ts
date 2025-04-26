import { NextRequest, NextResponse } from "next/server";

//GET /api/products/new: Productos nuevos
export async function GET_NEW(request: NextRequest) {
    try {
      const products = await productService.getNewProducts();
      return NextResponse.json({ products });
    } catch (error) {
      console.error('Error in GET /api/products/new:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  