import SearchView from "./SearchView";
import { getProducts } from "@/src/services/product";

export const metadata = {
  title: "Buscar Productos | SneakersHooes",
  description: "Explora todo nuestro catálogo de zapatillas. Filtra por marca, categoría, género y precio.",
};

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.q || "";

  // Fetch all products server-side (con búsqueda si hay query)
  const response = await getProducts({
    limit: 200,
    search: searchQuery || undefined,
  });

  return <SearchView products={response.products} initialQuery={searchQuery} />;
}
