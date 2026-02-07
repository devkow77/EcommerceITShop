import { useEffect, useState } from "react";
import { Container, OrdersList } from "@/components";
import { useAuth } from "@/context/AuthContext";
import Forbidden from "@/pages/Forbidden";

interface OrderItemType {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    slug: string;
  };
}

interface OrderType {
  id: number;
  userId: number;
  totalAmount: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELED";
  createdAt: string;
  items: OrderItemType[];
}

const AccountOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        sortBy: "createdAt",
        order: "desc",
      });

      const res = await fetch(`/api/orders?${params}`, {
        credentials: "include",
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.msg || `Błąd serwera: ${res.status}`);
      }

      const json = await res.json();
      setOrders(json.data || []);
      setTotalPages(json.meta?.totalPages || 1);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error("Błąd pobierania zamówień:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [page, user]);

  if (!user) return <Forbidden />;

  return (
    <section className="py-12">
      <Container className="space-y-8">
        <div>
          <h2 className="mb-6 text-xl font-bold">Moje zamówienia</h2>

          {loading && (
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">Ładowanie...</p>
            </div>
          )}

          {error && (
            <div className="rounded bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Nie masz żadnych zamówień
              </p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <>
              <OrdersList orders={orders} onOrderCanceled={fetchOrders} />

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
                  >
                    Poprzednia
                  </button>
                  <span className="text-sm">
                    Strona {page} z {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
                  >
                    Następna
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </section>
  );
};

export default AccountOrders;
