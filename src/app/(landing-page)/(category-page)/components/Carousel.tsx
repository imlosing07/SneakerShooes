"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({ 
  items, 
  autoPlay = true, 
  interval = 5000,
  showDots = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const totalItems = items.length;
  const visibleItems = Math.min(
    totalItems,
    window?.innerWidth < 640 ? 1 : window?.innerWidth < 1024 ? 2 : 3
  );

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (autoPlay && !isPaused) {
      resetTimeout();
      timeoutRef.current = setTimeout(() => {
        goToNext();
      }, interval);
    }
    return () => {
      resetTimeout();
    };
  }, [currentIndex, autoPlay, isPaused]);

  const goToNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => 
      prevIndex === totalItems - visibleItems ? 0 : prevIndex + 1
    );
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Duración de la transición
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? totalItems - visibleItems : prevIndex - 1
    );
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Duración de la transición
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Duración de la transición
  };

  // Manejo de eventos táctiles para dispositivos móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) { // Umbral de desplazamiento
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setIsPaused(false);
  };

  return (
    <div className="relative mx-auto max-w-6xl">
      {/* Contenedor del carrusel */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Wrapper de los elementos del carrusel */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            width: `${(totalItems / visibleItems) * 100}%`
          }}
        >
          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex-shrink-0"
              style={{ width: `${100 / totalItems}%` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Controles de navegación */}
      <button 
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
        onClick={goToPrev}
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
        onClick={goToNext}
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores de posición */}
      {showDots && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {Array.from({ length: totalItems - visibleItems + 1 }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index 
                  ? 'bg-pink-500 w-6' 
                  : 'bg-gray-400 hover:bg-gray-300'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;