import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Container } from "@/components";
import { Link } from "react-router-dom";
import Forbidden from "@/pages/Forbidden";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  date: string;
  revenue: number;
  orders: number;
}

interface TopCategory {
  category: string;
  revenue: number;
}

interface Statistics {
  month: number;
  year: number;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
  chartData: ChartData[];
  topCategories: TopCategory[];
}

const AdminStatistics = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtry
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchStatistics = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        month: String(month),
        year: String(year),
      });

      const res = await fetch(`/api/admin/statistics?${params}`);

      if (!res.ok) {
        setError("Błąd pobierania statystyk");
        setLoading(false);
        return;
      }

      const data: Statistics = await res.json();
      setStatistics(data);
    } catch (err) {
      console.error("Błąd pobierania statystyk:", err);
      setError("Błąd serwera");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [month, year]);

  if (!user || user.role !== "ADMIN") return <Forbidden />;

  const monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];

  return (
    <section className="py-12">
      <Container className="space-y-8">
        <div className="space-y-4 border-b pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl font-bold md:text-3xl">
              Panel Administratora
            </h2>
            <span className="text-sm text-gray-500">
              Zalogowany jako <b>{user.name}</b>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-semibold md:gap-4">
            <Link className="hover:text-blue-500" to="/admin">
              Moje konto
            </Link>
            <Link className="hover:text-blue-500" to="/admin/products">
              Produkty
            </Link>
            <Link className="hover:text-blue-500" to="/admin/categories">
              Kategorie
            </Link>
            <Link className="hover:text-blue-500" to="/admin/users">
              Użytkownicy
            </Link>
            <Link className="hover:text-blue-500" to="/admin/orders">
              Zamówienia
            </Link>
            <Link className="hover:text-blue-500" to="/admin/statistics">
              Statystyki
            </Link>
          </div>
        </div>

        {/* TYTUŁ I FILTRY */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Statystyki sprzedaży</h3>

          <div className="flex gap-4 pb-4">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded border px-3 py-2"
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded border px-3 py-2"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-lg">Ładowanie...</div>
        ) : error ? (
          <div className="rounded bg-red-100 p-4 text-red-700">{error}</div>
        ) : statistics ? (
          <div className="space-y-8">
            {/* KARTY OGÓLNYCH STATYSTYK */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-6 shadow-sm">
                <p className="text-sm text-gray-600">Całkowity przychód</p>
                <p className="mt-2 text-3xl font-bold">
                  {statistics.stats.totalRevenue.toFixed(2)} zł
                </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <p className="text-sm text-gray-600">Liczba zamówień</p>
                <p className="mt-2 text-3xl font-bold">
                  {statistics.stats.totalOrders}
                </p>
              </div>

              <div className="rounded-lg border p-6 shadow-sm">
                <p className="text-sm text-gray-600">
                  Średnia wartość zamówienia
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {statistics.stats.avgOrderValue.toFixed(2)} zł
                </p>
              </div>
            </div>

            {/* WYKRES PRZYCHODU */}
            <div className="rounded-lg border p-6 shadow-sm">
              <h4 className="mb-4 text-lg font-bold">Przychód dziennie</h4>
              <div className="space-y-3">
                {statistics.chartData.length === 0 ? (
                  <p className="text-center text-gray-500">
                    Brak danych dla wybranego okresu
                  </p>
                ) : (
                  <>
                    <div style={{ width: "100%", height: 300 }}>
                      <ResponsiveContainer>
                        <LineChart data={statistics.chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(iso: any) =>
                              String(new Date(iso).getDate())
                            }
                          />
                          <YAxis
                            tickFormatter={(val) => `${Number(val).toFixed(0)}`}
                          />
                          <Tooltip
                            labelFormatter={(iso: any) =>
                              new Date(iso).toLocaleDateString("pl-PL")
                            }
                            formatter={(value: any) => [
                              value != null
                                ? `${Number(value).toFixed(2)} zł`
                                : "-",
                              "Przychód",
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#2563EB"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Data</th>
                            <th className="px-4 py-2 text-right">Przychód</th>
                            <th className="px-4 py-2 text-right">Zamówienia</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {statistics.chartData.map((data) => (
                            <tr key={data.date} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                {new Date(data.date).toLocaleDateString(
                                  "pl-PL",
                                )}
                              </td>
                              <td className="px-4 py-3 text-right font-medium">
                                {data.revenue.toFixed(2)} zł
                              </td>
                              <td className="px-4 py-3 text-right text-gray-600">
                                {data.orders}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* TOP KATEGORIE */}
            <div className="rounded-lg border p-6 shadow-sm">
              <h4 className="mb-4 text-lg font-bold">Top 5 kategorii</h4>
              {statistics.topCategories.length === 0 ? (
                <p className="text-center text-gray-500">Brak danych</p>
              ) : (
                <div className="space-y-3">
                  {statistics.topCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">
                        {cat.category}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{
                              width: `${
                                (cat.revenue /
                                  Math.max(
                                    ...statistics.topCategories.map(
                                      (c) => c.revenue,
                                    ),
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="w-20 text-right text-sm font-semibold">
                          {cat.revenue.toFixed(2)} zł
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
};

export default AdminStatistics;
