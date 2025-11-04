import React from 'react'
import Image from 'next/image'
import ImagenHeader from '@/public/childrenImages/banner_principal_ninos_desktop.webp'
import { ProductCatalog } from '../components/ProductCatalog'
import { allSneakers } from '../mujer/page'


function Ninos() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 pt-20">
            {/* Encabezado */}
            <header className="relative h-96 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
                <Image
                    src={ImagenHeader}
                    alt="Sneakers para Mujer"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 z-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
                        Sneakers para Ninos
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-xl">
                        Combina estilo, comodidad y versatilidad con nuestra exclusiva colección de zapatillas deportivas para mujer
                    </p>
                </div>
            </header>

            {/* Catálogo de productos con barra lateral */}
            <ProductCatalog products={allSneakers} />
            
        </div>

    )
}

export default Ninos