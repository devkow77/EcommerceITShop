import { useEffect, useState } from "react";
import Forbidden from "@/pages/Forbidden";
import { useAuth } from "@/context/AuthContext";
import { Container } from "@/components";
import {
  EditOrderDialog,
  DeleteOrderDialog,
} from "@/components/admin";
import { Link } from "react-router-dom";

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
}

interface OrderUser {
  id: number;
  name: string;
  email: string;
}

interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  stripeSession: string | null;
  status: string;
  createdAt: string;
  user: OrderUser;
  items: OrderItem[];
}

interface OrdersResponse {
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const AdminOrders = () => {
  const { user } = useAuth();

  // dane
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // paginacja
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // filtry / sortowanie
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        sortBy,
        order,
        ...(search && { search }),
        ...(status && { status }),
      });

      const res = await fetch(`/api/admin/orders?${params}`);
      const json: OrdersResponse = await res.json();

      setOrders(json.data);
      setTotalPages(json.meta.totalPages);
    } catch (err) {
      console.error("Błąd pobierania zamówień", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search, status, sortBy, order]);

  if (!user || user.role !== "ADMIN") return <Forbidden />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600";
      case "PAID":
        return "text-blue-600";
      case "SHIPPED":
        return "text-purple-600";
      case "COMPLETED":
        return "text-green-600";
      case "CANCELED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="py-12">
      <Container className="space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-3xl font-bold">Panel Administratora</h2>
          <div className="flex items-center gap-2">
            <Link to="/admin" className="bg-black px-4 py-2 text-sm text-white">
              Moje konto
            </Link>
            <Link
              to="/admin/products"
              className="bg-black px-4 py-2 text-sm text-white"
            >
              Produkty
            </Link>
            <Link
              to="/admin/categories"
              className="bg-black px-4 py-2 text-sm text-white"
            >
              Kategorie
            </Link>
            <Link
              to="/admin/users"
              className="bg-black px-4 py-2 text-sm text-white"
            >
              Użytkownicy
            </Link>
            <Link
              to="/admin/orders"
              className="bg-black px-4 py-2 text-sm text-white"
            >
              Zamówienia
            </Link>
          </div>
          <span className="text-sm text-gray-500">
            Zalogowany jako <b>{user.name}</b>
          </span>
        </div>

        {/* FILTRY */}
        <section className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Szukaj po imieniu/emailu..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="rounded border px-3 py-2 text-sm"
            />
            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
              className="rounded border px-3 py-2 text-sm"
            >
              <option value="">Wszystkie statusy</option>
              <option value="PENDING">Oczekujące</option>
              <option value="PAID">Opłacone</option>
              <option value="SHIPPED">Wysłane</option>
              <option value="COMPLETED">Ukończone</option>
              <option value="CANCELED">Anulowane</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border px-3 py-2 text-sm"
            >
              <option value="id">ID</option>
              <option value="createdAt">Data</option>
              <option value="totalAmount">Kwota</option>
              <option value="status">Status</option>
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
        </section>

        {/* TABELA */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Klient</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Kwota</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Pozycje</th>
                <th className="px-4 py-3 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center">
                    Ładowanie...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    Brak zamówień
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{o.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p className="font-medium">{o.user.name}</p>
                        <p className="text-gray-500">{o.user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {(o.totalAmount / 100).toFixed(2)} zł
                    </td>
                    <td className={`px-4 py-3 font-medium ${getStatusColor(o.status)}`}>
                      {o.status}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs">
                        {o.items.length} szt.
                      </span>
                    </td>
                    <td className="space-x-3 px-4 py-3 text-right">
                      <EditOrderDialog
                        order={o}
                        onSuccess={fetchOrders}
                      />
                      <DeleteOrderDialog
                        orderId={o.id}
                        onSuccess={fetchOrders}
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
      </Container>
    </section>
  );
};

export default AdminOrders;
