import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBasket, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HotShotProduct {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    description: string;
    imageUrl: string;
    originalPrice: number;
    discountedPrice: number;
    discountPercent: number;
    category: {
      name: string;
      slug: string;
    };
  };
  stockLimit: number;
  remainingStock: number;
  stockSold: number;
  expiresAt: string;
  hoursRemaining: number;
}

const HotShot = () => {
  const [hotShot, setHotShot] = useState<HotShotProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const formatPrice = (priceInCents: number) =>
    (priceInCents / 100).toLocaleString("pl-PL", {
      style: "currency",
      currency: "PLN",
    });

  useEffect(() => {
    const fetchHotShot = async () => {
      try {
        const res = await fetch("/api/products/hotshot");
        if (res.ok) {
          const data: HotShotProduct = await res.json();
          setHotShot(data);
        } else {
          setHotShot(null);
        }
      } catch (error) {
        console.error("Błąd przy pobieraniu Hot Shot:", error);
        setHotShot(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHotShot();
  }, []);

  // Odliczanie czasu
  useEffect(() => {
    if (!hotShot) return;

    const updateTimer = () => {
      const now = new Date();
      const expiresAt = new Date(hotShot.expiresAt);
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Promocja wygasła");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [hotShot]);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p>Ładowanie Hot Shot...</p>
      </div>
    );
  }

  if (!hotShot) {
    return null;
  }

  const stockPercentage = (hotShot.stockSold / hotShot.stockLimit) * 100;
  const isLowStock = hotShot.remainingStock <= 1;

  return (
    <div className="mb-12 space-y-6">
      <div className="flex items-center justify-center gap-3">
        <Flame className="h-6 w-6 text-orange-500" />
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          Hot Shot!
        </h2>
        <Flame className="h-6 w-6 text-orange-500" />
      </div>

      <Link
        to={`/products/${hotShot.product.category.name}/${hotShot.product.slug}`}
        className="block"
      >
        <article className="overflow-hidden rounded-lg border-2 border-orange-500 transition-shadow hover:shadow-lg">
          {/* Zdjęcie */}
          <div className="relative aspect-video overflow-hidden bg-gray-100 sm:aspect-square dark:bg-gray-800">
            <img
              src={hotShot.product.imageUrl}
              alt={hotShot.product.name}
              className="h-full w-full object-contain object-center p-4"
            />
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white md:text-sm">
              <Flame className="h-3 w-3" />-{hotShot.product.discountPercent}%
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4 p-4 lg:space-y-3">
            <h3 className="line-clamp-2 font-bold">{hotShot.product.name}</h3>

            {/* Ceny */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-orange-600">
                  {formatPrice(hotShot.product.discountedPrice)}
                </p>
                <p className="text-sm line-through opacity-60">
                  {formatPrice(hotShot.product.originalPrice)}
                </p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Oszczędzasz:{" "}
                <strong>
                  {formatPrice(
                    hotShot.product.originalPrice -
                      hotShot.product.discountedPrice,
                  )}
                </strong>
              </p>
            </div>

            {/* Pasek zapasów */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold">
                  {hotShot.remainingStock}/{hotShot.stockLimit} szt.
                </span>
                {isLowStock && (
                  <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                    OSTATNIE!
                  </span>
                )}
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-300 dark:bg-gray-600">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                  style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Czas */}
            <div className="flex items-center gap-1 rounded bg-orange-100 px-2 py-1.5 text-xs font-semibold text-orange-600 dark:bg-orange-950/40">
              <Clock className="h-3 w-3" />
              Kończy się za: <strong>{timeRemaining}</strong>
            </div>

            {/* Przycisk */}
            <Button className="flex w-full items-center justify-center gap-x-2 bg-orange-600 text-white hover:bg-orange-700 dark:hover:bg-orange-700">
              Do koszyka
              <ShoppingBasket className="h-4 w-4" />
            </Button>
          </div>
        </article>
      </Link>
    </div>
  );
};

export default HotShot;
