import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container } from "@/components";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number; // grosze
  discountedPrice: number; // grosze
  discountPercent: number;
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

  // produkty
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // paginacja
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // filtry backendowe
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [sort, setSort] = useState("newest");

  // filtry UI (kontrolowane inputy)
  const [searchInput, setSearchInput] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  const formatPrice = (priceInCents: number) =>
    (priceInCents / 100).toLocaleString("pl-PL", {
      style: "currency",
      currency: "PLN",
    });

  // fetch produktów z backendu
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

  return (
    <section className="py-10">
      <Container className="space-y-8">
        {/* HEADER: nazwa kategorii + sort + checkbox */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold capitalize">{category}</h1>

          <div className="flex gap-4">
            <select
              value={sort}
              onChange={(e) => {
                setPage(1);
                setSort(e.target.value);
              }}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="newest">Najnowsze</option>
              <option value="price_asc">Cena rosnąco</option>
              <option value="price_desc">Cena malejąco</option>
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

        {/* FILTRY: wyszukiwarka + min/max ceny + wyczyść */}
        <div className="grid gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Szukaj produktu..."
            value={searchInput}
            onChange={(e) => {
              setPage(1);
              setSearchInput(e.target.value);
              setSearch(e.target.value);
            }}
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <input
            type="number"
            placeholder="Cena od (zł)"
            value={minPriceInput}
            onChange={(e) => {
              setPage(1);
              setMinPriceInput(e.target.value);
              setMinPrice(
                e.target.value ? String(Number(e.target.value) * 100) : "",
              );
            }}
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <input
            type="number"
            placeholder="Cena do (zł)"
            value={maxPriceInput}
            onChange={(e) => {
              setPage(1);
              setMaxPriceInput(e.target.value);
              setMaxPrice(
                e.target.value ? String(Number(e.target.value) * 100) : "",
              );
            }}
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <button
            onClick={() => {
              // wyczyść wszystkie filtry
              setSearch("");
              setMinPrice("");
              setMaxPrice("");
              setSearchInput("");
              setMinPriceInput("");
              setMaxPriceInput("");
              setOnlyDiscounted(false);
              setSort("newest");
              setPage(1);
            }}
            className="rounded-lg border bg-gray-100 text-sm hover:bg-gray-200"
          >
            Wyczyść filtry
          </button>
        </div>

        {/* TREŚĆ: produkty */}
        {loading ? (
          <p>Ładowanie produktów...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400">
            Brak produktów spełniających kryteria.
          </p>
        ) : (
          <>
            {/* GRID produktów */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${category}/${product.slug}`}
                >
                  <div className="group relative flex h-full flex-col rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
                    {product.discountPercent > 0 && (
                      <div className="absolute -top-3 -right-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                        -{product.discountPercent}%
                      </div>
                    )}

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="mb-3 h-40 w-full rounded-lg object-cover"
                    />

                    <h3 className="mb-2 text-sm font-medium text-gray-800 group-hover:text-blue-600">
                      {product.name}
                    </h3>

                    <div className="mt-auto flex flex-col">
                      {product.discountPercent > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-red-600">
                        {formatPrice(product.discountedPrice)}
                      </span>
                    </div>

                    <Button className="mt-4 w-full">Do koszyka</Button>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINACJA */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 pt-6">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`rounded-lg px-3 py-1 text-sm ${
                      page === i + 1
                        ? "bg-gray-900 text-white"
                        : "border hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
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
