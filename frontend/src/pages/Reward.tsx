import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useShoppingCart } from "use-shopping-cart";
import { Lock, Home } from "lucide-react";

interface Reward {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
    description: string;
    category: {
      name: string;
      slug: string;
    };
  };
  discount: number;
  discountedPrice: number;
  generatedAt: string;
}

const getDiscountColor = (discount: number): string => {
  if (discount >= 10 && discount <= 30) return "text-green-600";
  if (discount >= 31 && discount <= 50) return "text-blue-600";
  if (discount >= 51 && discount <= 80) return "text-purple-600";
  if (discount >= 81 && discount <= 99) return "text-red-600";
  return "text-gray-600";
};

const getDiscountBgColor = (discount: number): string => {
  if (discount >= 10 && discount <= 30) return "bg-green-100";
  if (discount >= 31 && discount <= 50) return "bg-blue-100";
  if (discount >= 51 && discount <= 80) return "bg-purple-100";
  if (discount >= 81 && discount <= 99) return "bg-red-100";
  return "bg-gray-100";
};

const formatPrice = (priceInCents: number) =>
  (priceInCents / 100).toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

const Reward = () => {
  const navigate = useNavigate();
  const { addItem } = useShoppingCart();
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReward = async () => {
      try {
        const response = await fetch("/api/reward", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.status === 401) {
          // Unauthorized - user is not logged in
          setError("Forbidden");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Nie udało się pobrać nagrody");
        }

        const data: Reward = await response.json();
        setReward(data);
        setLoading(false);
      } catch (err: any) {
        console.error("Błąd przy pobieraniu nagrody:", err);
        // If user was logged in but something failed (e.g., session expired), redirect to home
        setError(err.message || "Błąd serwera");
        toast.error("Sesja wygasła, przechodzę do strony głównej", {
          position: "top-center",
        });
        setTimeout(() => navigate("/"), 2000);
      }
    };

    fetchReward();
  }, [navigate]);

  const handleAddToCart = () => {
    if (!reward) return;

    try {
      addItem({
        id: String(reward.product.id),
        name: reward.product.name,
        price: reward.discountedPrice,
        image: reward.product.imageUrl,
        currency: "PLN",
      });
      toast.success(`${reward.product.name} dodany do koszyka z rabatkiem!`, {
        position: "top-center",
      });
    } catch (err) {
      console.error("Błąd przy dodawaniu do koszyka:", err);
      toast.error("Nie udało się dodać do koszyka", { position: "top-center" });
    }
  };

  if (loading) {
    return (
      <Container className="py-16">
        <div className="text-center">Ładowanie Twojej nagrody...</div>
      </Container>
    );
  }

  if (error === "Forbidden" || !reward) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 px-6 py-16">
        <Lock className="text-yellow-500" strokeWidth={1.5} size={60} />
        <h1 className="text-4xl font-bold md:text-6xl">403</h1>
        <h2>Brak dostępu</h2>
        <p className="text-center text-sm leading-6 md:text-base">
          Musisz być zalogowany, aby zobaczyć swoją nagrodę. Zaloguj się, aby
          dostać dostęp do specjalnej promocji.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            variant="blue"
            onClick={() => navigate("/login")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Zaloguj się
          </Button>
          <Button
            variant="red"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            Wróć wstecz
          </Button>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <Container className="py-16">
        <div className="text-center text-red-600">{error}</div>
      </Container>
    );
  }

  const discountColor = getDiscountColor(reward.discount);
  const discountBgColor = getDiscountBgColor(reward.discount);

  return (
    <main className="space-y-12 py-16">
      <Container className="space-y-12">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold">Twoja nagroda!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Specjalna promocja dostępna tylko dla Ciebie dzisiaj
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Zdjęcie produktu */}
            <div className="flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-sm">
                <img
                  src={reward.product.imageUrl}
                  alt={reward.product.name}
                  className="h-full w-full rounded-lg object-contain"
                />
                <div
                  className={`absolute top-4 right-4 rounded-full px-4 py-2 font-bold ${discountBgColor} ${discountColor}`}
                >
                  -{reward.discount}%
                </div>
              </div>
            </div>

            {/* Informacje o produkcie */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {reward.product.category.name}
                </p>
                <h2 className="mb-2 text-3xl font-bold">
                  {reward.product.name}
                </h2>
                <p className="max-h-32 overflow-y-auto text-gray-600 dark:text-gray-300">
                  {reward.product.description}
                </p>
              </div>

              {/* Ceny */}
              <div className="space-y-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
                <div className="flex items-baseline gap-3">
                  <p className={`text-4xl font-bold ${discountColor}`}>
                    {formatPrice(reward.discountedPrice)}
                  </p>
                  <p className="text-lg line-through opacity-60">
                    {formatPrice(reward.product.price)}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Oszczędzasz:{" "}
                  {formatPrice(reward.product.price - reward.discountedPrice)}
                </p>
              </div>

              {/* Przycisk dodaj do koszyka */}
              <Button
                onClick={handleAddToCart}
                className="w-full bg-green-600 py-6 text-lg hover:bg-green-700"
              >
                Dodaj do koszyka
              </Button>

              {/* Info */}
              <div className="rounded-lg bg-blue-50 p-3 text-center text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                ⏰ Ta nagroda będzie dostępna do końca dnia. Wróć jutro po nową!
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default Reward;
