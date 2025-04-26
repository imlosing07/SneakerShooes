"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag, Heart } from 'lucide-react';

const DynamicShoesCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [animating, setAnimating] = useState(false);
  
  // Combinamos ambos tipos de productos en un solo array
  const allProducts = [
    { id: 1, name: "Urban Runner", description: "Lightweight cushioning", price: "$120", image: "/api/placeholder/240/240", category: "casual", hot: true },
    { id: 2, name: "Italian Oxford", description: "Hand-crafted premium leather", price: "$175", image: "/api/placeholder/240/240", category: "formal", sale: "15%" },
    { id: 3, name: "Retro Classic", description: "Vintage-inspired design", price: "$95", image: "/api/placeholder/240/240", category: "casual", new: true },
    { id: 4, name: "Derby Classic", description: "Smooth calfskin leather", price: "$155", image: "/api/placeholder/240/240", category: "formal", hot: true },
    { id: 5, name: "Sporty Edge", description: "Performance technology", price: "$135", image: "/api/placeholder/240/240", category: "casual", sale: "20%" },
    { id: 6, name: "Monk Strap", description: "Buckled elegance", price: "$190", image: "/api/placeholder/240/240", category: "formal", new: true },
    { id: 7, name: "Street Icon", description: "Urban streetwear essential", price: "$110", image: "/api/placeholder/240/240", category: "casual", hot: true },
    { id: 8, name: "Brogue Detail", description: "Decorative perforations", price: "$185", image: "/api/placeholder/240/240", category: "formal", sale: "10%" }
  ];
  
  // Autoplay con tipo definido para interval
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (autoplay) {
      interval = setInterval(() => {
        nextSlide();
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, activeIndex]);
  
  const nextSlide = () => {
    if (animating) return;
    setAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex === allProducts.length - 1 ? 0 : prevIndex + 1));
    setTimeout(() => setAnimating(false), 500);
  };
  
  const prevSlide = () => {
    if (animating) return;
    setAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex === 0 ? allProducts.length - 1 : prevIndex - 1));
    setTimeout(() => setAnimating(false), 500);
  };
  
  const getVisibleProducts = () => {
    const visibleItems = [];
    // Cambiar de -2 y 2 a -3 y 3 para mostrar 7 elementos en lugar de 5
    for (let i = -3; i <= 3; i++) {
      const index = (activeIndex + i + allProducts.length) % allProducts.length;
      visibleItems.push({
        product: allProducts[index],
        position: i
      });
    }
    return visibleItems;
  };
  
  // Get background gradient based on product category
  const getBackgroundClass = (category: string) => {
    return category === "formal" ? "bg-gradient-to-r from-indigo-800 to-purple-700" : "bg-gradient-to-r from-red-600 to-amber-500";
  };

  return (
    <section className="py-16 bg-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -left-10 top-10 w-24 h-24 bg-blue-500 rounded-full blur-xl"></div>
        <div className="absolute right-20 top-40 w-32 h-32 bg-purple-500 rounded-full blur-xl"></div>
        <div className="absolute left-1/3 top-3/4 w-40 h-40 bg-pink-500 rounded-full blur-xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Title with animated elements */}
        <div className="text-center mb-12 relative">
          <div className="inline-block relative">
            <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-2 tracking-tight">
              Colección Premium
            </h2>
            <div className="absolute -right-8 -top-8">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-300 max-w-xl mx-auto text-lg">
            Descubre nuestra exclusiva selección de calzado importado con diseños únicos
          </p>
        </div>
        
        {/* 3D Carousel */}
        <div className="relative h-96 mx-auto">
          <div 
            className="carousel-container perspective-1000 relative h-96 mx-auto"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            {getVisibleProducts().map(({product, position}) => {
              // Apply different transformations based on position
              let transformStyle = {};
              let zIndex = 10;
              let opacity = 1;
              let scale = 1;
              
              switch(position) {
                case -2:
                  // Cambiar de -120% a un valor menor como -80%
                  transformStyle = { transform: 'translateX(-80%) scale(0.8) translateZ(-150px)' };
                  zIndex = 8;
                  opacity = 0.7; // Aumentar un poco la opacidad
                  scale = 0.8;
                  break;
                case -1:
                  // Cambiar de -60% a un valor menor como -40%
                  transformStyle = { transform: 'translateX(-40%) scale(0.9) translateZ(-75px)' };
                  zIndex = 9;
                  opacity = 0.85;
                  scale = 0.9;
                  break;
                case 0:
                  transformStyle = { transform: 'translateX(0) scale(1) translateZ(0)' };
                  zIndex = 10;
                  break;
                case 1:
                  // Cambiar de 60% a un valor menor como 40%
                  transformStyle = { transform: 'translateX(40%) scale(0.9) translateZ(-75px)' };
                  zIndex = 9;
                  opacity = 0.85;
                  scale = 0.9;
                  break;
                case 2:
                  // Cambiar de 120% a un valor menor como 80%
                  transformStyle = { transform: 'translateX(80%) scale(0.8) translateZ(-150px)' };
                  zIndex = 8;
                  opacity = 0.7;
                  scale = 0.8;
                  break;
                default:
                  break;
              }

              return (
                <div 
                  key={`${product.id}-${position}`}
                  className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out`}
                  style={{
                    ...transformStyle,
                    zIndex,
                    opacity
                  }}
                >
                  <div 
                    className={`w-64 mx-auto rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 ${position === 0 ? 'hover:scale-105' : ''}`}
                  >
                    {/* Card Header with category badge */}
                    <div className={`${getBackgroundClass(product.category)} p-1 relative`}>
                      <div className="absolute top-2 right-2 flex gap-1">
                        {product.sale && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            {product.sale} OFF
                          </span>
                        )}
                        {product.hot && (
                          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            HOT
                          </span>
                        )}
                        {product.new && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-40 object-cover" 
                      />
                    </div>
                    
                    {/* Card Body */}
                    <div className="bg-white p-4">
                      <h3 className="font-bold text-gray-900">{product.name}</h3>
                      <p className="text-gray-500 text-sm">{product.description}</p>
                      
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xl font-bold text-gray-900">{product.price}</span>
                        
                        {/* Show interactive buttons only for active slide */}
                        {position === 0 && (
                          <div className="flex gap-2">
                            <button className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full">
                              <Heart className="w-4 h-4" />
                            </button>
                            <button className="bg-black text-white p-2 rounded-full hover:bg-gray-800">
                              <ShoppingBag className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Control buttons */}
          <button 
            onClick={prevSlide} 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide} 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-8">
          {allProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setAnimating(true);
                setActiveIndex(index);
                setTimeout(() => setAnimating(false), 500);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'w-8 bg-gradient-to-r from-red-500 to-pink-500' 
                  : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="text-center mt-12">
          <a 
            href="#collection" 
            className="inline-block bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Ver Colección Completa
          </a>
        </div>
      </div>
    </section>
  );
};

export default DynamicShoesCarousel;