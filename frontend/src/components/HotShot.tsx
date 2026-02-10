import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingProductsView from "./LoadingProductsView";

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
    return <LoadingProductsView />;
  }

  if (!hotShot) {
    return null;
  }

  const stockPercentage = (hotShot.stockSold / hotShot.stockLimit) * 100;
  const isLowStock = hotShot.remainingStock <= 1;

  return (
    <main className="flex flex-col items-center">
      <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        Hot Shot!
      </h2>
      <Link
        to={`/products/${hotShot.product.category.name}/${hotShot.product.slug}`}
        className="flex items-center gap-8"
      >
        <div className="relative aspect-square max-w-80">
          <img
            src={hotShot.product.imageUrl}
            alt={hotShot.product.name}
            className="h-full w-full object-contain object-center p-4"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white md:text-sm">
            {hotShot.product.discountPercent}%
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-bold">{hotShot.product.name}</h3>
          <div className="flex items-center gap-x-2">
            <p className="text-lg font-semibold text-purple-600">
              {formatPrice(hotShot.product.discountedPrice)}
            </p>
            <p className="text-sm line-through opacity-60">
              {formatPrice(hotShot.product.originalPrice)}
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <p>
              Oszczędzasz:{" "}
              {formatPrice(
                hotShot.product.originalPrice - hotShot.product.discountedPrice,
              )}
            </p>
            {isLowStock && (
              <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                OSTATNIE!
              </span>
            )}
            <span className="font-semibold">
              {hotShot.remainingStock}/{hotShot.stockLimit} szt.
            </span>
          </div>
          <div>
            Kończy się za: <strong>{timeRemaining}</strong>
          </div>
          <Button variant="green">
            Do koszyka
            <ShoppingBasket size={60} />
          </Button>
        </div>
      </Link>
    </main>
  );
};

export default HotShot;
