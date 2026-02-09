import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, LoadingProductsView, ProductCard } from "@/components";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount: number;
  imageUrl: string;
  category: {
    name: string;
    slug: string;
  };
}

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(!!query);
  const [view, setView] = useState<"grid-5" | "grid-3">("grid-5");

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const searchTimeout = setTimeout(async () => {
      try {
        // Search across all categories
        const allCategoriesRes = await fetch("/api/products");
        const categoriesData = await allCategoriesRes.json();

        // Flatten all products and filter by search query
        const allProducts: Product[] = [];
        categoriesData.forEach((category: any) => {
          category.products.forEach((product: any) => {
            allProducts.push({
              ...product,
              category: {
                name: category.name,
                slug: category.slug,
              },
            });
          });
        });

        // Filter by search query (case-insensitive)
        const filtered = allProducts.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase()),
        );

        setProducts(filtered);
      } catch (error) {
        console.error("Błąd wyszukiwania:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  return (
    <section className="py-10">
      <Container className="space-y-8">
        {/* Nagłówek */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Wyniki wyszukiwania:{" "}
                <span className="text-blue-600">"{query}"</span>
              </h1>
              {!loading && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Znaleziono {products.length} produkt
                  {products.length === 1 ? "" : "ów"}
                </p>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              <Button
                className={`${view == "grid-5" ? "bg-blue-600" : "bg-slate-500"} text-xs`}
                onClick={() => setView("grid-5")}
              >
                <LayoutGrid /> 5
              </Button>
              <Button
                className={`${view == "grid-3" ? "bg-blue-600" : "bg-slate-500"} text-xs`}
                onClick={() => setView("grid-3")}
              >
                <LayoutGrid /> 3
              </Button>
            </div>
          </div>
        </div>

        {/* Rezultaty */}
        {loading ? (
          <LoadingProductsView />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <p className="text-lg text-gray-500">
              Brak produktów spełniających zapytanie "{query}"
            </p>
            <p className="text-sm text-gray-400">Spróbuj innego wyszukiwania</p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 gap-6 md:grid-cols-3 ${
              view == "grid-5" ? "lg:grid-cols-5" : ""
            }`}
          >
            {products.map((product) => (
              <ProductCard {...product} key={product.id} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default SearchResults;
