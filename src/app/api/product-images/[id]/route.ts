// app/api/product-images/[id]/route.ts
import { ProductRepository } from '@/domain/product/product.repository';
import { ProductService } from '@/domain/product/product.service';
import { NextRequest, NextResponse } from 'next/server';

// Usamos el singleton de Prisma con el repositorio y creamos el servicio
const productRepo = new ProductRepository();
const productService = new ProductService(productRepo);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ ok: true, id: params.id });
}

// Manejar eliminación de imágenes
export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  console.log('Deleting image with ID:', params.id);
  try {
    const product = await productService.removeProductImage(params.id);
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error in DELETE /api/product-images/[id]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}