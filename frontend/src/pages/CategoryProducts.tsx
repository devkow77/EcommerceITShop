import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, LoadingProductsView, ProductCard } from "@/components";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number; // grosze
  discount: number; // grosze
  imageUrl: string;
}

interface ApiResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState("newest");
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [view, setView] = useState<"grid-5" | "grid-3">("grid-5");

  // stany dla inputów (natychmiastowe)
  const [searchInput, setSearchInput] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  // stany do faktycznego fetcha (debounced)
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // debounce 2s
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1); // reset strony
      setSearch(searchInput);
      setMinPrice(minPriceInput ? String(Number(minPriceInput) * 100) : "");
      setMaxPrice(maxPriceInput ? String(Number(maxPriceInput) * 100) : "");
    }, 1000);

    return () => clearTimeout(handler); // czyszczenie przy kolejnej zmianie
  }, [searchInput, minPriceInput, maxPriceInput]);

  // fetch produktów
  useEffect(() => {
    if (!category) return;
    setLoading(true);

    const params = new URLSearchParams({
      page: page.toString(),
      sort,
      discounted: onlyDiscounted ? "true" : "false",
    });

    if (search) params.append("search", search);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    fetch(`/api/categories/${category}/products?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Błąd pobierania produktów");
        return res.json();
      })
      .then((data: ApiResponse) => {
        setProducts(data.products);
        setPages(data.pagination.pages);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [category, page, sort, onlyDiscounted, search, minPrice, maxPrice]);

  const clearAllFiltres = () => {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setOnlyDiscounted(false);
    setSort("newest");
    setPage(1);
  };

  return (
    <section className="py-10">
      <Container className="space-y-8">
        {/* nagłówek i filtry */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold capitalize">{category}</h1>
            <div className="flex flex-wrap items-center gap-4">
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
              <div className="flex gap-4">
                <select
                  value={sort}
                  onChange={(e) => {
                    setPage(1);
                    setSort(e.target.value);
                  }}
                  className="border px-3 py-2 text-sm"
                >
                  <option className="dark:bg-[#111]" value="newest">
                    Najnowsze
                  </option>
                  <option className="dark:bg-[#111]" value="price_asc">
                    Cena rosnąco
                  </option>
                  <option className="dark:bg-[#111]" value="price_desc">
                    Cena malejąco
                  </option>
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={onlyDiscounted}
                    onChange={(e) => {
                      setPage(1);
                      setOnlyDiscounted(e.target.checked);
                    }}
                  />
                  Promocje
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* inputy filtrowania */}
        <div className="grid gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Szukaj produktu..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Cena od (zł)"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Cena do (zł)"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <Button variant="red" onClick={clearAllFiltres}>
            Wyczyść filtry
          </Button>
        </div>

        {/* lista produktów */}
        {loading ? (
          <LoadingProductsView />
        ) : products.length === 0 ? (
          <p className="text-gray-400">
            Brak produktów spełniających kryteria.
          </p>
        ) : (
          <>
            <div
              className={`grid grid-cols-2 gap-6 md:grid-cols-3 ${view == "grid-5" ? "lg:grid-cols-5" : ""}`}
            >
              {products.map((product) => (
                <ProductCard {...product} key={product.id} />
              ))}
            </div>

            {/* paginacja */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 pt-6">
                {Array.from({ length: pages }).map((_, i) => (
                  <Button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`rounded-lg px-3 py-1 text-sm ${
                      page === i + 1
                        ? "bg-blue-600 text-white hover:bg-blue-600"
                        : "border hover:bg-blue-800"
                    }`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
};

export default CategoryProducts;
