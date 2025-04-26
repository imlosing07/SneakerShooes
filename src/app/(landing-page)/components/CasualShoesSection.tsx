"use client"
import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Heart, TrendingUp } from 'lucide-react';

const casualShoes = [
  { id: 1, name: "Urban Runner", description: "Lightweight cushioning", price: "$120", image: "/api/placeholder/240/240", rating: 4.8, trending: true },
  { id: 2, name: "Retro Classic", description: "Vintage-inspired design", price: "$95", image: "/api/placeholder/240/240", rating: 4.5, trending: false },
  { id: 3, name: "Sporty Edge", description: "Performance technology", price: "$135", image: "/api/placeholder/240/240", rating: 4.9, trending: true },
  { id: 4, name: "Street Icon", description: "Urban streetwear essential", price: "$110", image: "/api/placeholder/240/240", rating: 4.7, trending: false }
];

const CasualShoesSection = () => {
  const [hoveredShoe, setHoveredShoe] = useState<number | null>(null);
  const [animatedShoes, setAnimatedShoes] = useState<number[]>([]);

  useEffect(() => {
    // Animación de entrada escalonada para cada zapatilla
    const timer = setTimeout(() => {
      casualShoes.forEach((shoe, index) => {
        setTimeout(() => {
          setAnimatedShoes(prev => [...prev, shoe.id]);
        }, index * 150);
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="zapatillas" className="py-20 relative overflow-hidden">
      {/* Fondo con degradado moderno */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 opacity-80"></div>
      
      {/* Elementos de diseño geométricos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-yellow-200 opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-blue-200 opacity-20"></div>
        <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-pink-200 opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <TrendingUp size={16} className="mr-1" /> Trending Now
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Zapatillas Casuales</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From street style to athletic performance, our imported sneaker collection brings global trends to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {casualShoes.map((shoe) => (
            <div 
              key={shoe.id} 
              className={`bg-white rounded-xl overflow-hidden shadow-lg transition duration-500 transform ${
                animatedShoes.includes(shoe.id) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              } ${hoveredShoe === shoe.id ? 'scale-105 shadow-xl' : ''}`}
              onMouseEnter={() => setHoveredShoe(shoe.id)}
              onMouseLeave={() => setHoveredShoe(null)}
            >
              <div className="relative">
                <img 
                  src={shoe.image} 
                  alt={shoe.name} 
                  className="w-full h-56 object-cover transition duration-500 transform hover:scale-110" 
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
                    <Heart size={16} className="text-gray-500 hover:text-red-500 transition" />
                  </button>
                </div>
                {shoe.trending && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded">
                    Hot Drop
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm text-gray-600 ml-1">{shoe.rating}</span>
                  </div>
                  <div className="ml-auto text-xs text-gray-500 font-medium">
                    New Arrival
                  </div>
                </div>
                
                <h3 className="text-lg font-bold mt-1">{shoe.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{shoe.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    {shoe.price}
                  </span>
                  <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition duration-300 flex items-center">
                    <span>View</span>
                    <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
              
              {/* Franja de color única para cada zapato */}
              <div className={`h-1 w-full bg-gradient-to-r ${
                shoe.id % 4 === 0 ? 'from-purple-400 to-blue-500' : 
                shoe.id % 3 === 0 ? 'from-green-400 to-teal-500' : 
                shoe.id % 2 === 0 ? 'from-red-400 to-orange-500' : 
                'from-yellow-400 to-amber-500'
              }`}></div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <a href="#" className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/30 transition duration-300">
            Explore All Styles
            <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        
        {/* Indicador de navegación */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            {[1, 2, 3].map((dot) => (
              <button 
                key={dot} 
                className={`h-2 rounded-full transition-all ${
                  dot === 1 ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Go to slide ${dot}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CasualShoesSection;