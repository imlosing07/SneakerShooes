import { Product } from "@/src/types";
import CategoryPageLayout from "../components/CategoryPageLayout";

export default function KidsPage({
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
            genre="KIDS"
            heroConfig={{
                image: "/categoryImages/desktopChildren.webp",
                title: "Niños",
                subtitle: "Comodidad y diversión para los más pequeños",
                gradientFrom: "orange-500"
            }}
        />
    );
}