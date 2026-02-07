import { useEffect, useState } from "react";
import Forbidden from "@/pages/Forbidden";
import { useAuth } from "@/context/AuthContext";
import { Container } from "@/components";
import {
  AddProductDialog,
  DeleteProductDialog,
  EditProductDialog,
  AddCategoryDialog,
  EditCategoryDialog,
  DeleteCategoryDialog,
} from "@/components/admin";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  discount: number;
  imageUrl: string;
  stock: number;
  isAvailable: boolean;
  categoryId: number;
}

interface ProductsResponse {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const AdminProducts = () => {
  const { user } = useAuth();

  // dane
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // paginacja
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // filtry / sortowanie
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  // Kategorie
  const [categories, setCategories] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catPage, setCatPage] = useState(1);
  const [catTotalPages, setCatTotalPages] = useState(1);
  const [catSearch, setCatSearch] = useState("");
  const [catSortBy, setCatSortBy] = useState("id");
  const [catOrder, setCatOrder] = useState<"asc" | "desc">("asc");

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        sortBy,
        order,
        ...(search && { search }),
      });

      const res = await fetch(`/api/admin/products?${params}`);
      const json: ProductsResponse = await res.json();

      setProducts(json.data);
      setTotalPages(json.meta.totalPages);
    } catch (err) {
      console.error("Błąd pobierania produktów", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCatsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(catPage),
        limit: "10",
        sortBy: catSortBy,
        order: catOrder,
        ...(catSearch && { search: catSearch }),
      });

      const res = await fetch(`/api/admin/categories?${params}`);
      const json = await res.json();

      setCategories(json.data);
      setCatTotalPages(json.meta.totalPages);
    } catch (err) {
      console.error("Błąd pobierania kategorii", err);
    } finally {
      setCatsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, sortBy, order]);

  useEffect(() => {
    fetchCategories();
  }, [catPage, catSearch, catSortBy, catOrder]);

  if (!user || user.role !== "ADMIN") return <Forbidden />;

  return (
    <section className="py-12">
      <Container className="space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-3xl font-bold">Panel Administratora</h2>
          <span className="text-sm text-gray-500">
            Zalogowany jako <b>{user.name}</b>
          </span>
        </div>

        {/* FILTRY */}
        <section className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Szukaj produktu..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="rounded border px-3 py-2 text-sm"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border px-3 py-2 text-sm"
            >
              <option value="id">ID</option>
              <option value="price">Cena</option>
              <option value="stock">Stan</option>
              <option value="name">Nazwa</option>
            </select>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
              className="rounded border px-3 py-2 text-sm"
            >
              <option value="asc">Rosnąco</option>
              <option value="desc">Malejąco</option>
            </select>
          </div>
          <AddProductDialog onSuccess={fetchProducts} />
        </section>

        {/* TABELA */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nazwa</th>
                <th className="px-4 py-3">Zdjęcie</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Cena</th>
                <th className="px-4 py-3">Stan</th>
                <th className="px-4 py-3 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    Ładowanie...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    Brak produktów
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{p.id}</td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 font-medium">
                      <div className="h-14 w-14 bg-black/20"></div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      /products/{p.slug}
                    </td>
                    <td className="px-4 py-3">
                      {(p.price / 100).toFixed(2)} zł
                    </td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="space-x-3 px-4 py-3 text-right">
                      <EditProductDialog
                        product={p}
                        onSuccess={fetchProducts}
                      />
                      <DeleteProductDialog
                        productId={p.id}
                        onSuccess={fetchProducts}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACJA */}
        <div className="flex items-center justify-end gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            ←
          </button>

          <span className="text-sm">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            →
          </button>
        </div>

        {/* KATEGORIE */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold">Kategorie</h3>
            <AddCategoryDialog onSuccess={fetchCategories} />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Szukaj kategorii..."
                value={catSearch}
                onChange={(e) => {
                  setCatPage(1);
                  setCatSearch(e.target.value);
                }}
                className="rounded border px-3 py-2 text-sm"
              />
              <select
                value={catSortBy}
                onChange={(e) => setCatSortBy(e.target.value)}
                className="rounded border px-3 py-2 text-sm"
              >
                <option value="id">ID</option>
                <option value="name">Nazwa</option>
              </select>
              <select
                value={catOrder}
                onChange={(e) => setCatOrder(e.target.value as "asc" | "desc")}
                className="rounded border px-3 py-2 text-sm"
              >
                <option value="asc">Rosnąco</option>
                <option value="desc">Malejąco</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nazwa</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3 text-right">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {catsLoading ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center">
                      Ładowanie...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      Brak kategorii
                    </td>
                  </tr>
                ) : (
                  categories.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{c.id}</td>
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-gray-500">{c.slug}</td>
                      <td className="space-x-3 px-4 py-3 text-right">
                        <EditCategoryDialog
                          category={c}
                          onSuccess={fetchCategories}
                        />
                        <DeleteCategoryDialog
                          categoryId={c.id}
                          onSuccess={fetchCategories}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-end gap-3">
            <button
              disabled={catPage === 1}
              onClick={() => setCatPage((p) => p - 1)}
              className="rounded border px-3 py-1 disabled:opacity-40"
            >
              ←
            </button>

            <span className="text-sm">
              {catPage} / {catTotalPages}
            </span>

            <button
              disabled={catPage === catTotalPages}
              onClick={() => setCatPage((p) => p + 1)}
              className="rounded border px-3 py-1 disabled:opacity-40"
            >
              →
            </button>
          </div>
        </section>
      </Container>
    </section>
  );
};

export default AdminProducts;
