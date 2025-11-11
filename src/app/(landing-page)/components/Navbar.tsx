"use client";
import { useEffect, useState } from "react";

export default function Navbar({ onNavigate, currentPage }: { onNavigate: (page: string) => void; currentPage: string }) {
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { id: "/", label: "Home" },
    { id: "/hombre", label: "Hombre" },
    { id: "/mujer", label: "Mujer" },
    { id: "/ninos", label: "Niños" },
    { id: "/formal", label: "Formal" }
  ];

  return (
    <nav className={`fixed w-full bg-white shadow-sm transition-transform duration-300 z-50 ${
      showNavbar ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={() => onNavigate("/")}
            className="text-2xl font-bold cursor-pointer"
          >
            Sneakers<span className="text-gray-400">Hooes</span>
          </button>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`transition ${
                  currentPage === item.id 
                    ? 'text-black font-medium' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black">
              Login
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-black text-white rounded hover:bg-gray-800">
              Signup
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}