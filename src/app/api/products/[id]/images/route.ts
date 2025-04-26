// app/api/products/[id]/images/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Usamos el singleton de Prisma con el repositorio y creamos el servicio
const productRepo = new ProductRepository();
const productService = new ProductService(productRepo);

// Manejar solicitudes para imágenes de producto
export async function POST(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const { imageUrl, position } = await request.json();
    const product = await productService.addProductImage(params.id, imageUrl, position);
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error in POST /api/products/[id]/images:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const { imagePositions } = await request.json();
    const product = await productService.reorderProductImages(params.id, imagePositions);
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error in PUT /api/products/[id]/images:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}