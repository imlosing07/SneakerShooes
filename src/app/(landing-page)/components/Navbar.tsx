"use client";
import { useEffect, useState } from "react";

function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 80) setShowNavbar(true);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  return (
    <nav className={`fixed w-full bg-white shadow-sm transition-transform duration-300 z-50 ${showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold">
            Sneakers<span className="text-gray-400">Hooes</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <a href="#top" className="text-gray-700 hover:text-black transition">TOP</a>
            <a href="#hombre" className="text-gray-700 hover:text-black transition">Hombre</a>
            <a href="#mujer" className="text-gray-700 hover:text-black transition">Mujer</a>
            <a href="#ninos" className="text-gray-700 hover:text-black transition">Niños</a>
            <a href="#formal" className="text-gray-700 hover:text-black transition">Formal</a>
          </div>

          <div className="flex space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition">
              Login
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-black text-white rounded hover:bg-gray-800 transition">
              Signup
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;