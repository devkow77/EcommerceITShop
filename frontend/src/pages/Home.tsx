import { Container } from "@/components";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number; // Cena w groszach
  discountedPrice: number; // Cena po rabacie w groszach
  discountPercent: number; // Stałe 10
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Funkcja pomocnicza do formatowania waluty
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toLocaleString("pl-PL", {
      style: "currency",
      currency: "PLN",
    });
  };

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("/api/products/promotions");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Błąd przy pobieraniu promocji:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <div className="py-10">
      <Container className="flex flex-col items-center justify-center space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Okazje Dnia</h2>
          <p className="text-gray-500 italic">
            Tylko dzisiaj - wszystkie produkty poniżej 10% taniej!
          </p>
        </div>

        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <p>Szukamy najlepszych cen...</p>
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-400">
            Dzisiejsze promocje wygasły. Wróć jutro!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col items-start rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                {/* Badge procentowy */}
                <div className="absolute -top-3 -right-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  -{product.discountPercent}%
                </div>

                <h3 className="mb-2 text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {product.name}
                </h3>

                <div className="mt-auto flex flex-col">
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    {formatPrice(product.discountedPrice)}
                  </span>
                </div>

                <button className="mt-4 w-full rounded-lg bg-gray-900 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-700">
                  Do koszyka
                </button>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;
