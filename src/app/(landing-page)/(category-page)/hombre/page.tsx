import { Product } from "@/src/types";
import ProductGrid from "../components/ProductGrid";

export default function MensPage({ products, onProductClick }: { products: Product[]; onProductClick: (p: Product) => void }) {
    console.log("MensPage products:", products);
    const mensProducts = products.filter(p => p.genre === "MENS" || p.genre === "UNISEX");

    return (
        <div className="pt-20">
            {/* Hero específico */}
            <div className="relative h-64 bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-5xl font-bold mb-2">Hombre</h1>
                    <p className="text-xl">Calzado deportivo y urbano</p>
                </div>
            </div>

            <ProductGrid
                products={mensProducts}
                title="Colección Hombre"
                onProductClick={onProductClick}
            />
        </div>
    );
}