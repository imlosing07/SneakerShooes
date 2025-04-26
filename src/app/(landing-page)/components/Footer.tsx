import NewsletterForm from "@/src/app/(landing-page)/(category-page)/components/NewsletterForm"
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-12 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Categorías</h3>
            <ul className="space-y-2">
              <li><Link href="/mujer/deportivas" className="text-gray-300 hover:text-pink-300 transition">Deportivas</Link></li>
              <li><Link href="/mujer/casual" className="text-gray-300 hover:text-pink-300 transition">Casual</Link></li>
              <li><Link href="/mujer/running" className="text-gray-300 hover:text-pink-300 transition">Running</Link></li>
              <li><Link href="/mujer/urbanas" className="text-gray-300 hover:text-pink-300 transition">Urbanas</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Marcas</h3>
            <ul className="space-y-2">
              <li><Link href="/marcas/nike" className="text-gray-300 hover:text-pink-300 transition">Nike</Link></li>
              <li><Link href="/marcas/adidas" className="text-gray-300 hover:text-pink-300 transition">Adidas</Link></li>
              <li><Link href="/marcas/puma" className="text-gray-300 hover:text-pink-300 transition">Puma</Link></li>
              <li><Link href="/marcas/reebok" className="text-gray-300 hover:text-pink-300 transition">Reebok</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Ayuda</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-300 hover:text-pink-300 transition">FAQ</Link></li>
              <li><Link href="/envios" className="text-gray-300 hover:text-pink-300 transition">Envíos</Link></li>
              <li><Link href="/devoluciones" className="text-gray-300 hover:text-pink-300 transition">Devoluciones</Link></li>
              <li><Link href="/contacto" className="text-gray-300 hover:text-pink-300 transition">Contacto</Link></li>
            </ul>
          </div>
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-semibold mb-4 text-white">Suscríbete</h3>
            <p className="text-gray-300 mb-4">Recibe nuestras novedades y promociones exclusivas</p>
            <NewsletterForm />
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-pink-300 transition">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-300 transition">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-300 transition">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-300 transition">
                <i className="fab fa-pinterest text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-2 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2025 ShoeStore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};