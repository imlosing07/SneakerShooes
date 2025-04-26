// src/services/brand.ts
import { prismaClientGlobal } from '@/src/app/lib/prisma';
import { Prisma } from '@prisma/client';
import { Brand } from '@/src/types';

export async function getBrands(): Promise<Brand[]> {
    try {
        const brands = await prismaClientGlobal.brand.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        return brands;
    } catch (error) {
        console.error('Error fetching brands:', error);
        throw new Error('Error fetching brands');
    }
}

export async function getBrandById(id: string): Promise<Brand | null> {
    try {
        const brand = await prismaClientGlobal.brand.findUnique({
            where: { id }
        });
        return brand;
    } catch (error) {
        console.error('Error fetching brand by ID:', error);
        throw new Error('Error fetching brand by ID');
    }
}

export async function createBrand(data: Prisma.BrandCreateInput): Promise<Brand> {
    try {
        const brand = await prismaClientGlobal.brand.create({
            data
        });
        return brand;
    } catch (error) {
        console.error('Error creating brand:', error);
        throw new Error('Error creating brand');
    }
}

export async function updateBrand(id: string, data: Prisma.BrandUpdateInput): Promise<Brand> {
    try {
        const brand = await prismaClientGlobal.brand.update({
            where: { id },
            data
        });
        return brand;
    } catch (error) {
        console.error('Error updating brand:', error);
        throw new Error('Error updating brand');
    }
}

export async function deleteBrand(id: string): Promise<Brand> {
    try {
        const Brand = await prismaClientGlobal.brand.delete({
            where: { id },
        });
        return Brand;
    } catch (error) {
        console.error('Error deleting brand:', error);
        throw new Error('Error deleting brand');
    }
}
