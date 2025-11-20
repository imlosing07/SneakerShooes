import { Product } from "@/src/types";
import CategoryPageLayout from "../components/CategoryPageLayout";

export default function MensPage({
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
            genre="MENS"
            heroConfig={{
                image: "/categoryImages/desktopMen.jpg",
                title: "Hombre",
                subtitle: "Descubre nuestra selección de calzado urbano y deportivo",
                gradientFrom: "blue-900"
            }}
        />
    );
}