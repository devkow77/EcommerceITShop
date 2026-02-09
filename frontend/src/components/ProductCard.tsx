import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ShoppingBasket } from "lucide-react";
import { useShoppingCart } from "use-shopping-cart";
import { toast } from "sonner";

interface Props {
  category?: {
    name: string;
  };
  id?: number;
  slug: string;
  imageUrl: string;
  name: string;
  discount?: number;
  price: number;
  discountedPrice?: number;
  discountPercent?: number;
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
}: Props) => {
  const categoryName = category?.name || "Nieznana kategoria";
  const { addItem } = useShoppingCart();

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

  return (
    <Link
      to={`/products/${categoryName}/${slug}`}
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
