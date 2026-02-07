import { useEffect, useState } from "react";
import Forbidden from "@/pages/Forbidden";
import { useAuth } from "@/context/AuthContext";
import { Container } from "@/components";
import {
  AddUserDialog,
  EditUserDialog,
  DeleteUserDialog,
} from "@/components/admin";
import { Link } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

interface UsersResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const AdminUsers = () => {
  const { user } = useAuth();

  // dane
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // paginacja
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // filtry / sortowanie
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        sortBy,
        order,
        ...(search && { search }),
      });

      const res = await fetch(`/api/admin/users?${params}`);
      const json: UsersResponse = await res.json();

      setUsers(json.data);
      setTotalPages(json.meta.totalPages);
    } catch (err) {
      console.error("Błąd pobierania użytkowników", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, sortBy, order]);

  if (!user || user.role !== "ADMIN") return <Forbidden />;

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
            <Link
              to="/admin/statistics"
              className="bg-black px-4 py-2 text-sm text-white"
            >
              Statystyki
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
              placeholder="Szukaj użytkownika..."
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
              <option value="name">Nazwa</option>
              <option value="email">Email</option>
              <option value="role">Rola</option>
              <option value="createdAt">Data utworzenia</option>
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
          <AddUserDialog onSuccess={fetchUsers} />
        </section>

        {/* TABELA */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nazwa</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rola</th>
                <th className="px-4 py-3">Data utworzenia</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    Brak użytkowników
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{u.id}</td>
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.role}</td>
                    <td className="px-4 py-3">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="space-x-3 px-4 py-3 text-right">
                      <EditUserDialog user={u} onSuccess={fetchUsers} />
                      <DeleteUserDialog userId={u.id} onSuccess={fetchUsers} />
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

export default AdminUsers;
