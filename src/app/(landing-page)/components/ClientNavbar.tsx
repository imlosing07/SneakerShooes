"use client";
import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Heart, User, LogOut, LayoutDashboard, Menu, X, Search } from "lucide-react";
import { useWishlist } from "@/src/app/lib/contexts/WishlistContext";
import { useCart } from "@/src/app/lib/contexts/CartContext";
import Image from "next/image";

export default function ClientNavbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false);
        setShowUserMenu(false);
        setShowMobileMenu(false);
        setShowSearch(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  // Focus en el input de búsqueda al abrirlo
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const navItems = [
    { id: "/", label: "Home" },
    { id: "/hombre", label: "Hombre" },
    { id: "/mujer", label: "Mujer" },
    { id: "/ninos", label: "Niños" },
    { id: "/formal", label: "Formal" }
  ];

  const handleSignOut = async () => {
    setShowUserMenu(false);
    setShowMobileMenu(false);
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleMobileNavClick = () => {
    setShowMobileMenu(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
      setShowSearch(false);
      setSearchQuery("");
      setShowMobileMenu(false);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className={`fixed w-full bg-white shadow-sm transition-transform duration-300 z-50 ${showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold cursor-pointer flex-shrink-0"
            >
              Sneakers<span className="text-gray-500">Hooes</span>
            </Link>

            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map(item => (
                <Link
                  key={item.id}
                  href={item.id}
                  className={`transition text-sm xl:text-base ${pathname === item.id
                    ? 'text-black font-medium border-b-2 border-black'
                    : 'text-gray-700 hover:text-black'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Desktop Search - Ocultar en /buscar */}
              {pathname !== '/buscar' && (
                <div className="relative flex items-center">
                  <form
                    onSubmit={handleSearchSubmit}
                    className={`flex items-center transition-all duration-300 overflow-hidden ${
                      showSearch ? 'w-56 xl:w-72 opacity-100' : 'w-0 opacity-0'
                    }`}
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar productos..."
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </form>
                  <button
                    onClick={toggleSearch}
                    className="p-2 text-gray-700 hover:text-black transition ml-1"
                    aria-label={showSearch ? "Cerrar búsqueda" : "Buscar"}
                  >
                    {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Mobile Search Button - Ocultar en /buscar */}
              {pathname !== '/buscar' && (
                <button
                  onClick={toggleSearch}
                  className="lg:hidden p-2 text-gray-700 hover:text-black transition"
                  aria-label="Buscar"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* Carrito */}
              <Link
                href="/carrito"
                className="relative p-2 text-gray-700 hover:text-black transition"
                aria-label="Carrito de compras"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Favoritos */}
              <Link
                href="/favoritos"
                className="relative p-2 text-gray-700 hover:text-black transition"
                aria-label="Lista de favoritos"
              >
                <Heart className={wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Auth Section */}
              {status === "loading" ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : session?.user ? (
              // Usuario autenticado
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
                    aria-label="Menú de usuario"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full object-cover"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <span className="hidden xl:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {session.user.name?.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user.email}
                        </p>
                      </div>

                      {/* Dashboard link solo para ADMIN */}
                      {session.user.role === 'ADMIN' && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            router.push('/dashboard');
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </button>
                      )}

                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
              // Usuario NO autenticado
                <button
                  onClick={() => router.push('/login')}
                  className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-gray-700 hover:text-black transition"
                aria-label="Menú de navegación"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - slides under navbar */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
            showSearch ? 'max-h-16 pb-3' : 'max-h-0'
          }`}>
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                className="p-2 text-gray-500 hover:text-black"
                aria-label="Cerrar búsqueda"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile Menu — hidden properly with opacity and pointer-events */}
      <div className={`fixed left-0 right-0 bg-white shadow-lg z-40 lg:hidden transition-all duration-300 ${
        showMobileMenu && showNavbar
          ? 'top-16 opacity-100 pointer-events-auto translate-y-0'
          : 'top-16 opacity-0 pointer-events-none -translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col space-y-2">
            {navItems.map(item => (
              <Link
                key={item.id}
                href={item.id}
                onClick={handleMobileNavClick}
                className={`text-left px-4 py-3 rounded-lg transition ${pathname === item.id
                  ? 'bg-gray-100 text-black font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
