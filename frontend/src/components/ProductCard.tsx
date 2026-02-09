import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ShoppingBasket, Heart } from "lucide-react";
import { useShoppingCart } from "use-shopping-cart";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";

interface Props {
  category?: {
    name: string;
    slug?: string;
  };
  id?: number;
  slug: string;
  imageUrl: string;
  name: string;
  discount?: number;
  price: number;
  discountedPrice?: number;
  discountPercent?: number;
  showFavorite?: boolean;
}

const formatPrice = (priceInCents: number) =>
  (priceInCents / 100).toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

const ProductCard = ({
  category,
  id,
  slug,
  imageUrl,
  name,
  discount,
  price,
  discountedPrice,
  discountPercent,
  showFavorite = true,
}: Props) => {
  const categoryName = category?.name || "Nieznana kategoria";
  const categorySlug = category?.slug || "unknown";
  const { addItem } = useShoppingCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const isInFavorites = isFavorite(Number(id));

  // Obsługa zarówno starego formatu (discount %) jak i nowego (discountedPrice)
  const finalDiscountPercent = discountPercent ?? discount ?? 0;
  const finalDiscountedPrice =
    discountedPrice ?? Math.round(price * (1 - finalDiscountPercent / 100));
  const isPromotion =
    typeof discountedPrice !== "undefined" && discountedPrice < price;
  const displayPrice = isPromotion ? finalDiscountedPrice : price;
  const priceColorClass = isPromotion ? "text-yellow-600" : "text-red-600";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      addItem({
        id: String(id || slug),
        name,
        price: finalDiscountedPrice,
        image: imageUrl,
        currency: "PLN",
      });
      toast.success(`${name} dodany do koszyka!`, { position: "top-center" });
    } catch (err) {
      console.error("Błąd przy dodawaniu do koszyka:", err);
      toast.error("Nie udało się dodać do koszyka", { position: "top-center" });
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      id: Number(id || 0),
      name,
      slug,
      price,
      imageUrl,
      category: {
        name: categoryName,
        slug: category?.slug || "",
      },
    });
    const action = isInFavorites ? "usunięty z" : "dodany do";
    toast.success(`${name} ${action} ulubionych!`, { position: "top-center" });
  };

  return (
    <Link
      to={`/products/${categorySlug}/${slug}`}
      className="text-sm lg:text-base"
    >
      <div className="relative aspect-square">
        <img
          src={imageUrl}
          alt={name}
          className="absolute h-full w-full object-contain object-center"
        />
        {finalDiscountPercent > 0 && (
          <div className="absolute top-0 right-0 rounded-full bg-yellow-600 px-3 py-1 text-xs font-semibold text-white md:text-sm">
            -{finalDiscountPercent}%
          </div>
        )}
        {showFavorite && (
          <button
            onClick={handleToggleFavorite}
            className={`absolute right-2 bottom-2 rounded-full p-2 transition-all ${
              isInFavorites
                ? "bg-red-500 text-white"
                : "bg-white text-gray-400 hover:text-red-500 dark:bg-gray-800"
            }`}
            title={isInFavorites ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          >
            <Heart
              className="h-5 w-5"
              fill={isInFavorites ? "currentColor" : "none"}
            />
          </button>
        )}
      </div>
      <div className="space-y-2 py-2 lg:space-y-3">
        <h3 className="truncate font-bold">{name}</h3>
        {isPromotion && (
          <span className="text-sm text-gray-500">Promocja!</span>
        )}
        <div className="flex items-center gap-x-2">
          <p className={`text-lg font-semibold ${priceColorClass}`}>
            {formatPrice(displayPrice)}
          </p>
          {isPromotion && (
            <p className="text-sm line-through opacity-60">
              {formatPrice(price)}
            </p>
          )}
        </div>
        <Button
          onClick={handleAddToCart}
          variant="blue"
          className="flex items-center justify-center gap-x-2"
        >
          Do koszyka
          <ShoppingBasket />
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;
