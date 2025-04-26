// app/api/brands/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBrands, createBrand } from '@/src/services/brand'

// Manejar solicitudes GET y POST a /api/brands
export async function GET(request: NextRequest) {
  try {
    const results = await getBrands();
    console.log('Api results brands:', results);

    const resultsData = results.map((brand) => {
      return {
        id: brand.id,
        name: brand.name,
        logoUrl: brand.logoUrl,
      }
    }
    )

    return NextResponse.json(resultsData, { status: 200 })
  } catch (error) {
    console.error('Error in GET /api/brands:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const brandData = await request.json();
    const newBrand = await createBrand(brandData);

    return NextResponse.json(newBrand, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

