"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import ImagenHero from "../public/images/hero-image.webp";
import ImagenHero2 from "../public/images/hero-image-2.webp";

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(ImagenHero);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev === ImagenHero ? ImagenHero2 : ImagenHero));
        setActive(true);
      }, 500); // Tiempo antes de cambiar la imagen
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative parallax-bg pt-24 pb-16 text-white bg-cover bg-center overflow-hidden">
      {/* Overlay para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Imagen optimizada con next/image con cambio dinámico */}
      <Image
        src={currentImage}
        alt="Hero Background"
        fill
        quality={70}
        className={`image-transition ${active ? "active" : ""}`}
        priority
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Imported Footwear</h1>
            <p className="text-lg mb-8 text-gray-300 max-w-md">
              Discover our exclusive collection of imported formal shoes and casual sneakers, crafted for those who appreciate quality and style.
            </p>
            <div className="flex space-x-4">
              <a href="#zapatos" className="bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition shadow-lg">
                Shop Formal
              </a>
              <a href="#zapatillas" className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-gray-900 transition shadow-lg">
                Shop Casual
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center relative animate-fade-in">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-gradient-to-r from-gray-800 to-black rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full filter blur-3xl opacity-30"></div>
            <Image
              src="https://www.plasticaucho.com.pe/blog/wp-content/uploads/2021/02/C%C3%B3mo-iniciar-un-negocio-enfocado-en-la-venta-de-zapatillas-en-Lima.jpg"
              alt="Premium Shoes Collection"
              width={500}
              height={400}
              className="relative z-10 rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};