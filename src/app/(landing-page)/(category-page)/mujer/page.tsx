import { Product } from "@/src/types";
import CategoryPageLayout from "../components/CategoryPageLayout";

export default function WomensPage({
    products,
    onProductClick
}: {
    products: Product[];
    onProductClick: (p: Product) => void
}) {
    return (
        <CategoryPageLayout
            products={products}
            onProductClick={onProductClick}
            genre="WOMENS"
            heroConfig={{
                image: "/categoryImages/desktopWomen.webp",
                title: "Mujer",
                subtitle: "Estilo y comodidad en cada paso",
                gradientFrom: "pink-600"
            }}
        />
    );
}