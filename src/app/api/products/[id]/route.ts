// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { deleteProduct, getProductById, updateProduct } from '@/src/services/product'; // Asegúrate de que la ruta sea correcta

// Manejar solicitudes GET a /api/products/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params; 
  try {
    const result = await getProductById(id);
    return NextResponse.json({
      product: result,
    });
  } catch (error) {
    console.error('Error in GET /api/product/[id]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Manejar solicitudes PUT a /api/products/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params; 
  const body = await request.json();
  try {
    const result = await updateProduct(id, body);
    return NextResponse.json({
      product: result,
    });
  } catch (error) {
    console.error('Error in PUT /api/product/[id]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Manejar solicitudes DELETE a /api/products/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params; 
  try {
    deleteProduct(id)
    
    return NextResponse.json({ message: `Product ${id} deleted` });
  } catch (error) {
    console.error('Error in DELETE /api/product/[id]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}