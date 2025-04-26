"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false); // Ocultar si baja
      } else {
        setShowNavbar(true); // Mostrar si sube
      }
      setLastScrollY(window.scrollY);
    };

    const handleMouseMove = (e:any) => {
      if (e.clientY < 80) {
        setShowNavbar(true); // Aparece si el mouse está cerca de la parte superior
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`bg-white shadow fixed w-full z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold">
                  Sneekers<span className="text-slate-500">Hooes</span>
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 lg:flex-1 lg:justify-center">
            <Link href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">TOP</Link>
            <Link href="/hombre" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">Hombre</Link>
            <Link href="/mujer" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">Mujer</Link>
            <Link href="/ninos" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">Niños</Link>
          </div>
          <div className="hidden md:flex items-center lg:flex-1 lg:justify-end lg:space-x-3">
            <Link href="/login" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Login</Link>
            <Link href="/signup" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Signup</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
